import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Star, Target, Award } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import supabase from '../lib/supabase';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  carbon_required: number;
  unlocked: boolean;
  unlocked_at?: string;
}

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState({ totalCarbonSaved: 0, level: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  
  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Get user's profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('total_carbon_saved, level')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          throw new Error('Failed to load user profile');
        }
        
        const carbonSaved = profile?.total_carbon_saved || 0;
        const userLevel = profile?.level || 1;
        
        setUserStats({ totalCarbonSaved: carbonSaved, level: userLevel });
        
        // Get all achievements
        const { data: allAchievements, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')
          .order('carbon_required', { ascending: true });
          
        if (achievementsError) {
          console.error('Error fetching achievements:', achievementsError);
          throw new Error('Failed to load achievements');
        }
        
        // Get user's unlocked achievements
        const { data: userAchievements, error: userAchievementsError } = await supabase
          .from('user_achievements')
          .select('achievement_id, unlocked_at')
          .eq('user_id', user.id);
          
        if (userAchievementsError) {
          console.error('Error fetching user achievements:', userAchievementsError);
          throw new Error('Failed to load user achievements');
        }
        
        // Create a map of unlocked achievements
        const unlockedMap = (userAchievements || []).reduce((acc: Record<string, string>, item: any) => {
          acc[item.achievement_id] = item.unlocked_at;
          return acc;
        }, {});
        
        // Map achievements with unlock status
        const mappedAchievements = (allAchievements || []).map((achievement: any) => ({
          ...achievement,
          unlocked: unlockedMap.hasOwnProperty(achievement.id),
          unlocked_at: unlockedMap[achievement.id] || undefined,
        }));
        
        setAchievements(mappedAchievements);
      } catch (error: any) {
        console.error('Error fetching achievements:', error);
        setError(error.message || 'Failed to load achievements');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAchievements();
  }, [user]);
  
  const calculateProgress = (achievement: Achievement) => {
    const { totalCarbonSaved } = userStats;
    
    if (achievement.unlocked) return 100;
    
    // Find the previous achievement's carbon requirement
    const previousAchievement = achievements
      .filter(a => a.carbon_required < achievement.carbon_required && a.unlocked)
      .sort((a, b) => b.carbon_required - a.carbon_required)[0];
    
    const previousRequirement = previousAchievement ? previousAchievement.carbon_required : 0;
    const requiredRange = achievement.carbon_required - previousRequirement;
    const userProgress = totalCarbonSaved - previousRequirement;
    
    if (userProgress <= 0) return 0;
    if (userProgress >= requiredRange) return 99; // Almost there but not unlocked yet
    
    return Math.floor((userProgress / requiredRange) * 100);
  };
  
  const getProgressText = (achievement: Achievement) => {
    const { totalCarbonSaved } = userStats;
    
    if (achievement.unlocked) {
      return `Unlocked on ${new Date(achievement.unlocked_at!).toLocaleDateString()}`;
    }
    
    const remaining = achievement.carbon_required - totalCarbonSaved;
    if (remaining <= 0) {
      return 'Ready to unlock!';
    }
    
    return `${remaining.toFixed(1)} kg CO2 remaining`;
  };
  
  const getAchievementIcon = (iconText: string, unlocked: boolean) => {
    // Map emoji icons to Lucide icons for better consistency
    const iconMap: Record<string, JSX.Element> = {
      '🌱': <Star className="h-6 w-6" />,
      '🌿': <Trophy className="h-6 w-6" />,
      '🌲': <Award className="h-6 w-6" />,
      '🌳': <Target className="h-6 w-6" />,
      '🌍': <Trophy className="h-6 w-6" />,
      '⚡': <Star className="h-6 w-6" />,
      '🌠': <Award className="h-6 w-6" />,
      '🚲': <Target className="h-6 w-6" />,
      '♻️': <Trophy className="h-6 w-6" />,
      '🥗': <Star className="h-6 w-6" />,
      '💡': <Award className="h-6 w-6" />,
    };
    
    return iconMap[iconText] || (unlocked ? <Trophy className="h-6 w-6" /> : <Lock className="h-6 w-6" />);
  };
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your progress and unlock rewards by reducing your carbon footprint.
          </p>
        </div>
        <div className="card p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your progress and unlock rewards by reducing your carbon footprint.
        </p>
      </div>
      
      {/* Progress Overview */}
      <motion.div
        className="card p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Progress</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {unlockedCount} of {totalCount} achievements unlocked
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {completionPercentage}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <motion.div 
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {userStats.totalCarbonSaved.toFixed(1)} kg
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Carbon Saved</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              Level {userStats.level}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Level</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {unlockedCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Achievements</div>
          </div>
        </div>
      </motion.div>
      
      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => {
          const progress = calculateProgress(achievement);
          const progressText = getProgressText(achievement);
          
          return (
            <motion.div
              key={achievement.id}
              className={`card overflow-hidden transition-all duration-300 ${
                achievement.unlocked 
                  ? 'border-primary-200 dark:border-primary-800 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-900/20' 
                  : 'hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ 
                y: -5, 
                boxShadow: achievement.unlocked 
                  ? '0 20px 25px -5px rgba(16, 185, 129, 0.1), 0 10px 10px -5px rgba(16, 185, 129, 0.04)'
                  : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Achievement Header */}
              <div className={`px-6 py-4 ${
                achievement.unlocked 
                  ? 'bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30' 
                  : 'bg-gray-50 dark:bg-gray-800/50'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300 shadow-lg' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {getAchievementIcon(achievement.icon, achievement.unlocked)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                      className="text-primary-500"
                    >
                      <Trophy className="h-5 w-5" />
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Achievement Details */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {achievement.carbon_required} kg CO2 required
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {progress}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3">
                  <motion.div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500' 
                        : 'bg-gray-400 dark:bg-gray-600'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                
                <div className={`text-sm flex items-center ${
                  achievement.unlocked 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {achievement.unlocked ? (
                    <Trophy className="h-4 w-4 mr-1" />
                  ) : (
                    <Target className="h-4 w-4 mr-1" />
                  )}
                  <span>{progressText}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Achievement Tips */}
      <motion.div 
        className="card p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
          <Award className="h-5 w-5 mr-2 text-primary-500" />
          Achievement Tips
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Looking to earn more achievements? Here are some ways to reduce your carbon footprint:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-primary-500 mr-2 mt-1">•</span>
              <span>Choose cycling or walking for short trips instead of driving</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2 mt-1">•</span>
              <span>Reduce meat consumption by having plant-based meals several times a week</span>
            </li>
          </ul>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-primary-500 mr-2 mt-1">•</span>
              <span>Recycle and compost consistently to reduce landfill waste</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2 mt-1">•</span>
              <span>Install energy-efficient appliances and LED lighting in your home</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default Achievements;