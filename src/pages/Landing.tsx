import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  ArrowRight, 
  Car, 
  Trash2, 
  Coffee, 
  Zap, 
  Trophy, 
  Target, 
  Users, 
  TrendingDown,
  CheckCircle,
  Star,
  Award,
  BarChart3,
  Shield,
  Smartphone,
  Globe
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <Car className="h-6 w-6" />,
      title: 'Track Transportation',
      description: 'Monitor your daily commute and travel choices to understand their environmental impact.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Trash2 className="h-6 w-6" />,
      title: 'Waste Management',
      description: 'Log your recycling and waste disposal habits to see how much carbon you save.',
      color: 'from-amber-500 to-amber-600'
    },
    {
      icon: <Coffee className="h-6 w-6" />,
      title: 'Dietary Choices',
      description: 'Track your food consumption and discover how plant-based meals reduce emissions.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Energy Usage',
      description: 'Monitor your energy consumption and switch to renewable sources for maximum impact.',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Users', icon: <Users className="h-5 w-5" /> },
    { number: '500,000kg', label: 'CO2 Saved', icon: <TrendingDown className="h-5 w-5" /> },
    { number: '50,000+', label: 'Activities Logged', icon: <BarChart3 className="h-5 w-5" /> },
    { number: '95%', label: 'User Satisfaction', icon: <Star className="h-5 w-5" /> }
  ];

  const benefits = [
    'Real-time carbon footprint tracking',
    'Personalized eco-friendly recommendations',
    'Achievement system to stay motivated',
    'Beautiful data visualizations',
    'Community challenges and leaderboards',
    'Export your environmental impact reports'
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Environmental Advocate',
      content: 'EcoStep helped me reduce my carbon footprint by 40% in just 3 months. The insights are incredible!',
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Chen',
      role: 'Software Engineer',
      content: 'Love the gamification aspect. Earning achievements for being eco-friendly makes it so much more engaging.',
      avatar: '👨‍💻'
    },
    {
      name: 'Emma Davis',
      role: 'Student',
      content: 'The app is beautifully designed and easy to use. Perfect for tracking my daily environmental impact.',
      avatar: '👩‍🎓'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container-app h-16 flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900 mr-3">
              <Leaf className="h-6 w-6 text-primary-500" />
            </div>
            <span className="text-primary-500 dark:text-primary-400 text-xl font-bold">Eco</span>
            <span className="text-gray-900 dark:text-white text-xl font-bold">Step</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container-app py-20 lg:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
                <Globe className="h-4 w-4 mr-2" />
                Join the climate action movement
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Track Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500"> Carbon Footprint</span>
                <br />
                Make a Difference
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Monitor your daily activities, reduce emissions, and contribute to a sustainable future. 
                Join thousands of users making a positive environmental impact.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="btn-primary text-lg px-8 py-4 flex items-center justify-center"
                >
                  Start Tracking Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button className="btn-outline text-lg px-8 py-4 flex items-center justify-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  View Demo
                </button>
              </div>
              
              <div className="flex items-center mt-8 space-x-6">
                <div className="flex -space-x-2">
                  {['👩‍💼', '👨‍💻', '👩‍🎓', '👨‍🔬', '👩‍🌾'].map((avatar, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm border-2 border-white dark:border-gray-900">
                      {avatar}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">10,000+ users</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">already tracking their impact</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full opacity-20"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full opacity-10"></div>
                
                <div className="relative">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Impact Dashboard</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-3">
                          <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Carbon Saved</span>
                      </div>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">127.5 kg</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mr-3">
                          <Trophy className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Level</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">5</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mr-3">
                          <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Achievements</span>
                      </div>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">12/20</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container-app">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                  <span className="text-primary-600 dark:text-primary-400">{stat.icon}</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500"> Go Green</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive tools to track, analyze, and reduce your environmental impact across all aspects of daily life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg mb-4 text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container-app">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose EcoStep?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Join a community of environmentally conscious individuals making a real difference. 
                Our platform provides the tools and motivation you need to reduce your carbon footprint effectively.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center"
                  >
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Progress</h3>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">+15% improvement</span>
                </div>
                
                <div className="space-y-4">
                  {['Transport', 'Energy', 'Waste', 'Diet'].map((category, index) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{category}</span>
                        <span className="text-gray-900 dark:text-white font-medium">{85 - index * 10}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${85 - index * 10}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real stories from people making a difference with EcoStep
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.content}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="container-app text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already reducing their carbon footprint and creating a sustainable future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center">
                <Smartphone className="mr-2 h-5 w-5" />
                Download App
              </button>
            </div>
            
            <p className="text-white/80 text-sm mt-6">
              Free to use • No credit card required • Join 10,000+ users
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-app">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-primary-600 mr-3">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-primary-400 text-xl font-bold">Eco</span>
                <span className="text-white text-xl font-bold">Step</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering individuals to track and reduce their carbon footprint for a sustainable future.
              </p>
              <div className="flex space-x-4">
                <Shield className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-400">Privacy Protected</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EcoStep. All rights reserved. Made with 💚 for the planet.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;