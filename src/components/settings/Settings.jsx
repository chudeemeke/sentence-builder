import React, { useState } from 'react';
import { Volume2, VolumeX, Moon, Sun, Globe, Palette } from 'lucide-react';

/**
 * Settings Component
 * User preferences and app configuration
 */
const Settings = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [difficulty, setDifficulty] = useState('beginner');
  const [language, setLanguage] = useState('en');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Sound Settings */}
          <SettingCard>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {soundEnabled ? <Volume2 className="w-5 h-5 text-gray-600" /> : <VolumeX className="w-5 h-5 text-gray-600" />}
                <div>
                  <h3 className="font-semibold text-gray-800">Sound Effects</h3>
                  <p className="text-sm text-gray-600">Play sounds for actions and feedback</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={soundEnabled}
                onChange={setSoundEnabled}
              />
            </div>
          </SettingCard>

          {/* Theme Settings */}
          <SettingCard>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {darkMode ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-gray-600" />}
                <div>
                  <h3 className="font-semibold text-gray-800">Dark Mode</h3>
                  <p className="text-sm text-gray-600">Easier on the eyes in low light</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={darkMode}
                onChange={setDarkMode}
              />
            </div>
          </SettingCard>

          {/* Difficulty Settings */}
          <SettingCard>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Palette className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Difficulty Level</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`py-2 px-4 rounded-lg capitalize transition-colors ${
                      difficulty === level
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </SettingCard>

          {/* Language Settings */}
          <SettingCard>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Language</h3>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </SettingCard>

          {/* Save Button */}
          <button className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingCard = ({ children }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {children}
    </div>
  );
};

const ToggleSwitch = ({ enabled, onChange }) => {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export default Settings;