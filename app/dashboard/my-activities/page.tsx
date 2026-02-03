import React from 'react'
import { 
  Upload, 
  FileText, 
  Eye, 
  Download, 
  ThumbsUp, 
  MessageSquare, 
  Clock, 
  BarChart3,
  Filter,
  Search,
  Calendar,
  BookOpen,
  Star,
  Users,
  TrendingUp,
  Award
} from 'lucide-react'

const MyActivities = () => {
  // Mock data for activities
  const recentActivities = [
    {
      id: 1,
      type: 'upload',
      title: 'React Hooks Complete Guide',
      description: 'Uploaded new notes',
      date: '2 hours ago',
      views: 245,
      downloads: 89,
      icon: <Upload className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      type: 'view',
      title: 'Data Structures & Algorithms',
      description: 'Viewed your notes',
      date: '1 day ago',
      views: 189,
      downloads: 45,
      icon: <Eye className="w-4 h-4" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 3,
      type: 'download',
      title: 'Machine Learning Fundamentals',
      description: 'Downloaded by 12 users',
      date: '2 days ago',
      views: 456,
      downloads: 123,
      icon: <Download className="w-4 h-4" />,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 4,
      type: 'like',
      title: 'Node.js Backend Development',
      description: 'Received 24 likes',
      date: '3 days ago',
      views: 321,
      downloads: 78,
      icon: <ThumbsUp className="w-4 h-4" />,
      color: 'bg-pink-100 text-pink-600'
    },
    {
      id: 5,
      type: 'comment',
      title: 'System Design Patterns',
      description: 'New comment: "Very helpful notes!"',
      date: '1 week ago',
      views: 567,
      downloads: 156,
      icon: <MessageSquare className="w-4 h-4" />,
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  const stats = [
    { label: 'Total Uploads', value: '24', icon: <Upload className="w-5 h-5" />, change: '+12%' },
    { label: 'Total Views', value: '2,458', icon: <Eye className="w-5 h-5" />, change: '+24%' },
    { label: 'Total Downloads', value: '489', icon: <Download className="w-5 h-5" />, change: '+18%' },
    { label: 'Avg Rating', value: '4.8', icon: <Star className="w-5 h-5" />, change: '+0.3' }
  ]

  const popularNotes = [
    { id: 1, title: 'Advanced JavaScript Concepts', views: 890, rating: 4.9, date: '2024-01-15' },
    { id: 2, title: 'React Performance Optimization', views: 745, rating: 4.7, date: '2024-01-10' },
    { id: 3, title: 'TypeScript Mastery', views: 623, rating: 4.8, date: '2024-01-05' },
    { id: 4, title: 'Next.js 14 Complete Guide', views: 512, rating: 4.6, date: '2024-01-01' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Activities</h1>
            <p className="text-gray-600 mt-2">Track your notes uploads, views, and engagement</p>
          </div>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
            <Upload className="w-5 h-5" />
            Upload My Notes
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${index === 0 ? 'bg-blue-100' : index === 1 ? 'bg-green-100' : index === 2 ? 'bg-purple-100' : 'bg-yellow-100'}`}>
                  {React.cloneElement(stat.icon, {
                    className: `w-5 h-5 ${index === 0 ? 'text-blue-600' : index === 1 ? 'text-green-600' : index === 2 ? 'text-purple-600' : 'text-yellow-600'}`
                  })}
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
                <p className="text-gray-600 text-sm">Latest updates on your notes</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
            
            <div className="divide-y divide-gray-100">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${activity.color}`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                        </div>
                        <span className="text-sm text-gray-500 whitespace-nowrap">{activity.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{activity.views} views</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Download className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{activity.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 text-center">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All Activities →
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Most Popular Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Most Popular Notes</h3>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            
            <div className="space-y-4">
              {popularNotes.map((note) => (
                <div key={note.id} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{note.title}</h4>
                    <div className="flex items-center gap-1 text-amber-600">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{note.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{note.views.toLocaleString()} views</span>
                    <span>{new Date(note.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">View Analytics</span>
                </div>
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900">Manage Followers</span>
                </div>
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-900">View Achievements</span>
                </div>
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              </button>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Top Contributor</p>
                  <p className="text-sm text-gray-600">Awarded for 20+ uploads</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Rising Star</p>
                  <p className="text-sm text-gray-600">1000+ views this month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyActivities