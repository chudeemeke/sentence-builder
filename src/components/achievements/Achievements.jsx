import React from 'react';
import { Trophy, Star, Zap, Target, Award, Medal } from 'lucide-react';

/**
 * Achievements Component
 * Displays earned badges and achievements
 */
const Achievements = () => {
  // Mock achievement data
  const achievements = [
    {
      id: 1,
      name: 'First Steps',
      description: 'Build your first sentence',
      icon: <Star className="w-8 h-8" />,
      earned: true,
      date: '2024-01-15',
      color: 'yellow'
    },
    {
      id: 2,
      name: 'Grammar Expert',
      description: 'Build 10 perfect sentences',
      icon: <Trophy className="w-8 h-8" />,
      earned: true,
      date: '2024-01-16',
      color: 'gold'
    },
    {
      id: 3,
      name: 'Speed Builder',
      description: 'Build a sentence in under 10 seconds',
      icon: <Zap className="w-8 h-8" />,
      earned: true,
      date: '2024-01-17',
      color: 'blue'
    },
    {
      id: 4,
      name: 'Perfect Week',
      description: 'Practice 7 days in a row',
      icon: <Target className="w-8 h-8" />,
      earned: false,
      progress: 5,
      total: 7,
      color: 'green'
    },
    {
      id: 5,
      name: 'Vocabulary Master',
      description: 'Use 50 different words',
      icon: <Award className="w-8 h-8" />,
      earned: false,
      progress: 32,
      total: 50,
      color: 'purple'
    },
    {
      id: 6,
      name: 'Champion',
      description: 'Reach 1000 points',
      icon: <Medal className="w-8 h-8" />,
      earned: false,
      progress: 420,
      total: 1000,
      color: 'red'
    }
  ];

  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Achievements</h1>
          <p className="text-gray-600">
            You've earned {earnedCount} out of {achievements.length} achievements!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Overall Progress</span>
            <span className="text-sm font-medium text-gray-800">
              {Math.round((earnedCount / achievements.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
              style={{ width: `${(earnedCount / achievements.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} {...achievement} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AchievementCard = ({ name, description, icon, earned, date, progress, total, color }) => {
  const colorMap = {
    yellow: 'from-yellow-400 to-orange-400',
    gold: 'from-yellow-500 to-yellow-600',
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    red: 'from-red-400 to-red-600'
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 transition-all ${
        earned ? 'ring-2 ring-yellow-400' : 'opacity-75'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-lg bg-gradient-to-r ${colorMap[color]} text-white ${
            !earned && 'grayscale'
          }`}
        >
          {icon}
        </div>
        {earned && (
          <span className="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</span>
        )}
      </div>

      <h3 className="font-semibold text-gray-800 mb-1">{name}</h3>
      <p className="text-sm text-gray-600 mb-3">{description}</p>

      {!earned && progress !== undefined && (
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs text-gray-700">
              {progress}/{total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`bg-gradient-to-r ${colorMap[color]} h-2 rounded-full transition-all`}
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {earned && (
        <div className="flex items-center text-green-500">
          <Trophy className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">Earned!</span>
        </div>
      )}
    </div>
  );
};

export default Achievements;