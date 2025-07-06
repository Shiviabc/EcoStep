import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Trash2, Coffee, Zap, Trophy, ArrowUpRight, Award, Star, Target } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { fetchUserData } from '../services/userService';
import EmissionsSummary from '../components/dashboard/EmissionsSummary';
import supabase from '../lib/supabase';

const Dashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [recentAchievements, setRecentAchievements] = useState<any[]>([]);
  const [achievementStats, setAchievementStats] = useState({ unlocked: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          const data = await fetchUserData(user.id);
          setUserData(data);
          
          // Fetch recent achievements
          const { data: userAchievements, error: achievementsError } = await supabase
            .from('user_achievements')
            .select(`
              unlocked_at,
              achievements (
                id,
                name,
                description,
                icon,
                carbon_required
              )
            `)
            .eq('user_id', user.id)
            .order('unlocked_at', { ascending: false })
            .limit(3);
            
          if (!achievementsError && userAchievements) {
            setRecentAchievements(userAchievements);
          }
          
          // Get total achievement count
          const { count: totalCount } = await supabase
            .from('achievements')
            .select('*', { count: 'exact', head: true });
            
          const { count: unlockedCount } = await supabase
            .from('user_achievements')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
            
          setAchievementStats({
            unlocked: unlockedCount || 0,
            total: totalCount || 0
          });
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const categories = [
    { name: 'Transport', path: '/transport', icon: <Car className="h-5 w-5" />, color: 'bg-blue-500' },
    { name: 'Waste', path: '/waste', icon: <Trash2 className="h-5 w-5" />, color: 'bg-amber-500' },
    { name: 'Diet', path: '/diet', icon: <Coffee className="h-5 w-5" />, color: 'bg-red-500' },
    { name: 'Energy', path: '/energy', icon: <Zap className="h-5 w-5" />, color: 'bg-purple-500' },
  ];

  const getAchievementIcon = (iconText: string) => {
    const iconMap: Record<string, JSX.Element> = {
      '🌱': <Star className="h-4 w-4" />,
      '🌿': <Trophy className="h-4 w-4" />,
      '🌲': <Award className="h-4 w-4" />,
      '🌳': <Target className="h-4 w-4" />,
      '🌍': <Trophy className="h-4 w-4" />,
      '⚡': <Star className="h-4 w-4" />,
      '🌠': <Award className="h-4 w-4" />,
      '🚲': <Target className="h-4 w-4" />,
      '♻️': <Trophy className="h-4 w-4" />,
      '🥗': <Star className="h-4 w-4" />,
      '💡': <Award className="h-4 w-4" />,
    };
    
    return iconMap[iconText] || <Trophy className="h-4 w-4" />;
  };

  if (isLoading) {
    return <div className="animate-pulse p-4">Loading dashboard data...</div>;
  }

  const totalCarbon = Object.values(userData?.stats?.carbonByCategory || {}).reduce((sum: any, val: any) => sum + val, 0);
  const categoryPercentages = categories.map(cat => ({
    ...cat,
    value: Math.round(((userData?.stats?.carbonByCategory?.[cat.name.toLowerCase()] || 0) / totalCarbon) * 100) || 0
  }));

  const completionPercentage = achievementStats.total > 0 ? Math.round((achievementStats.unlocked / achievementStats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carbon Savings */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Carbon Saved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData?.totalCarbonSaved?.toFixed(1) || '0.0'} kg
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Level {userData?.level || 1}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Achievement Progress */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Achievements</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {achievementStats.unlocked}/{achievementStats.total}
              </p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
              <Award className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {completionPercentage}% complete
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="space-y-3">
            <Link
              to="/achievements"
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 hover:from-primary-100 hover:to-secondary-100 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 transition-all duration-200"
            >
              <div className="flex items-center">
                <Award className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">View Achievements</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400" />
            </Link>
            
            <Link
              to="/transport"
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <div className="flex items-center">
                <Car className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Log Transport</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Trophy className="h-5 w-5 text-primary-500 mr-2" />
              Recent Achievements
            </h2>
            <Link
              to="/achievements"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
            >
              View all
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAchievements.map((userAchievement, index) => {
              const achievement = userAchievement.achievements;
              return (
                <motion.div
                  key={achievement.id}
                  className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-200 dark:bg-primary-800 rounded-full">
                      {getAchievementIcon(achievement.icon)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {achievement.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                        Unlocked {new Date(userAchievement.unlocked_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Emissions Summary - full width */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <EmissionsSummary />
      </motion.div>

      {/* Emission Categories */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Emission Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryPercentages.map((category) => (
            <motion.div
              key={category.name}
              className="card border overflow-hidden"
              whileHover={{
                y: -5,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className={`${category.color} h-2`}></div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`${category.color} bg-opacity-10 p-2 rounded-lg mr-3`}>
                      <span
                        className={`text-${category.color.split('-')[1]}-600 dark:text-${category.color.split('-')[1]}-400`}
                      >
                        {category.icon}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{category.value}%</span>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`${category.color} h-1.5 rounded-full`}
                      style={{ width: `${category.value}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to={category.path}
                    className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
                  >
                    Add activity
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activities</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Activity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Carbon Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {userData?.stats?.recentActivities?.map((activity: any) => (
                <tr key={activity.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {activity.activity_type}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${activity.category}-100 text-${activity.category}-800 dark:bg-${activity.category}-900 dark:text-${activity.category}-200`}>
                      {activity.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right">
                    <span className={activity.carbon_impact < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {activity.carbon_impact < 0 ? '+' : ''}{Math.abs(activity.carbon_impact).toFixed(2)} kg CO2
                      {activity.carbon_impact < 0 ? ' saved' : ' emitted'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Eco Tip */}
      <motion.div
        className="card p-6 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Eco Tip of the Day</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Try to air dry your clothes instead of using a dryer. This can save up to 3 kg of CO2 emissions per load!
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;