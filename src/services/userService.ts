import supabase from '../lib/supabase';

export const fetchUserData = async (userId: string) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    // First check if the profile exists
    const { data: profileExists, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (checkError || !profileExists) {
      // If profile doesn't exist, create it
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          total_carbon_saved: 0,
          level: 1,
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      return {
        totalCarbonSaved: 0,
        level: 1,
        username: 'ecouser',
        achievements: 0,
      };
    }

    // Fetch the existing profile with all related data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        activities:activities(
          category,
          carbon_impact,
          created_at
        ),
        user_achievements:user_achievements(
          achievements(*)
        )
      `)
      .eq('id', userId)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Calculate statistics
    const activities = profile.activities || [];
    const carbonByCategory = activities.reduce((acc: Record<string, number>, activity: any) => {
      if (!acc[activity.category]) {
        acc[activity.category] = 0;
      }
      acc[activity.category] += Math.abs(activity.carbon_impact);
      return acc;
    }, {});

    const totalActivities = activities.length;
    const achievements = profile.user_achievements?.length || 0;
    const nextAchievement = await getNextAchievement(userId, profile.total_carbon_saved);

    return {
      id: profile.id,
      username: profile.username,
      totalCarbonSaved: profile.total_carbon_saved || 0,
      level: profile.level || 1,
      achievements,
      nextAchievement,
      stats: {
        totalActivities,
        carbonByCategory,
        recentActivities: activities
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5),
      },
    };
  } catch (error) {
    console.error('Error in fetchUserData:', error);
    throw error;
  }
};

export const getNextAchievement = async (userId: string, currentCarbon: number) => {
  try {
    const { data: achievements, error } = await supabase
      .from('achievements')
      .select('*')
      .gt('carbon_required', currentCarbon)
      .order('carbon_required', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    return achievements;
  } catch (error) {
    console.error('Error getting next achievement:', error);
    return null;
  }
};

export const fetchRecentActivities = async (userId: string, limit = 5) => {
  if (!userId) {
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        profiles!activities_user_id_fkey(username)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
};

export const addActivity = async (userId: string, activity: {
  category: 'transport' | 'waste' | 'diet' | 'energy';
  activity_type: string;
  value: number;
  carbon_impact: number;
}) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    // First ensure the profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, total_carbon_saved')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      // Create profile if it doesn't exist
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          total_carbon_saved: 0,
          level: 1,
        });

      if (createError) {
        throw createError;
      }
    }

    // Add the activity
    const { data, error } = await supabase
      .from('activities')
      .insert({
        user_id: userId,
        ...activity,
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    // Update the user's total carbon saved if this is a carbon-saving activity
    if (activity.carbon_impact < 0) { // Negative impact means carbon saved
      const carbonSaved = Math.abs(activity.carbon_impact);
      const currentTotal = profile?.total_carbon_saved || 0;
      const newTotal = currentTotal + carbonSaved;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          total_carbon_saved: newTotal
        })
        .eq('id', userId);
        
      if (updateError) {
        throw updateError;
      }

      // Check for new achievements after updating carbon saved
      await checkAndAwardAchievements(userId, newTotal);
    }
    
    return data;
  } catch (error) {
    console.error('Error in addActivity:', error);
    throw error;
  }
};

export const checkAndAwardAchievements = async (userId: string, totalCarbonSaved: number) => {
  try {
    // Get achievements the user qualifies for but hasn't unlocked yet
    const { data: availableAchievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('id, carbon_required')
      .lte('carbon_required', totalCarbonSaved);

    if (achievementsError) {
      throw achievementsError;
    }

    // Get achievements the user has already unlocked
    const { data: unlockedAchievements, error: unlockedError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    if (unlockedError) {
      throw unlockedError;
    }

    const unlockedIds = new Set(unlockedAchievements?.map(ua => ua.achievement_id) || []);
    
    // Find new achievements to unlock
    const newAchievements = availableAchievements?.filter(
      achievement => !unlockedIds.has(achievement.id)
    ) || [];

    // Insert new user achievements
    if (newAchievements.length > 0) {
      const { error: insertError } = await supabase
        .from('user_achievements')
        .insert(
          newAchievements.map(achievement => ({
            user_id: userId,
            achievement_id: achievement.id,
          }))
        );

      if (insertError) {
        throw insertError;
      }

      // Update user level based on total achievements
      const totalUnlocked = unlockedIds.size + newAchievements.length;
      const newLevel = Math.min(10, Math.max(1, Math.floor(totalCarbonSaved / 100) + 1));

      const { error: levelError } = await supabase
        .from('profiles')
        .update({ level: newLevel })
        .eq('id', userId);

      if (levelError) {
        throw levelError;
      }

      return newAchievements;
    }

    return [];
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
};

export const calculateTransportEmissions = (type: string, distance: number): number => {
  const factors: Record<string, number> = {
    car: 0.12,
    bus: 0.05,
    train: 0.03,
    flight: 0.15,
    bike: 0,
    walk: 0,
  };
  
  const factor = factors[type] || 0;
  return factor * distance;
};

export const calculateWasteEmissions = (type: string, weight: number): number => {
  const factors: Record<string, number> = {
    general: 2.5,
    recyclable: 1.0,
    biodegradable: 0.8,
    compost: 0.2,
  };
  
  const factor = factors[type] || 0;
  return factor * weight;
};

export const calculateDietEmissions = (type: string, meals: number): number => {
  const factors: Record<string, number> = {
    meat: 3.0,
    fish: 1.5,
    vegetarian: 1.0,
    vegan: 0.5,
  };
  
  const factor = factors[type] || 0;
  return factor * meals;
};

export const calculateEnergyEmissions = (type: string, amount: number): number => {
  const factors: Record<string, number> = {
    fossil: 0.5,
    renewable: 0.1,
    mixed: 0.3,
  };
  
  const factor = factors[type] || 0;
  return factor * amount;
};