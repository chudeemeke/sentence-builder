import React from 'react';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';

/**
 * Dashboard Component
 * Shows progress and statistics
 */
const Dashboard = () => {
  // Mock data for now - will connect to store later
  const stats = {
    totalSentences: 42,
    accuracy: 85,
    streak: 7,
    timeSpent: '2h 15m'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Progress</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Target className="w-6 h-6" />}
            label="Sentences Built"
            value={stats.totalSentences}
            color="blue"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Accuracy"
            value={`${stats.accuracy}%`}
            color="green"
          />
          <StatCard
            icon={<Award className="w-6 h-6" />}
            label="Current Streak"
            value={`${stats.streak} days`}
            color="yellow"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="Time Spent"
            value={stats.timeSpent}
            color="purple"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Sentences</h2>
          <div className="space-y-3">
            <RecentItem sentence="The happy cat plays." score={10} />
            <RecentItem sentence="A bird sings in the tree." score={15} />
            <RecentItem sentence="The big dog runs quickly." score={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className={`inline-flex p-3 rounded-lg ${colors[color]} mb-4`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-gray-600">{label}</p>
    </div>
  );
};

const RecentItem = ({ sentence, score }) => {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
      <span className="text-gray-700">{sentence}</span>
      <span className="text-sm font-medium text-blue-600">+{score} points</span>
    </div>
  );
};

export default Dashboard;