import React, { useState } from 'react';

// This would be fetched from backend in real app
const initialSettings = {
  googleSSOEnabled: true,
  testGoogleToken: '',
};

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState(initialSettings);

  const handleToggle = () => {
    setSettings(s => ({ ...s, googleSSOEnabled: !s.googleSSOEnabled }));
  };

  const handleTestTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(s => ({ ...s, testGoogleToken: e.target.value }));
  };

  // TODO: Save settings to backend

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-indigo-700 mb-8 flex items-center gap-2">
        <span className="inline-block bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-lg font-semibold">⚙️</span>
        Admin Settings
      </h2>
      <div className="space-y-6">
        {/* SSO Setting Card */}
        <div className="bg-indigo-50 rounded-lg p-6 flex items-center justify-between shadow">
          <div>
            <div className="text-lg font-semibold text-indigo-800 mb-1">Enable SSO for Login Website</div>
            <div className="text-sm text-gray-600">Allow users to sign in using Google SSO.</div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 font-semibold text-gray-700">
              <input type="checkbox" checked={settings.googleSSOEnabled} onChange={handleToggle} className="form-checkbox h-5 w-5 text-indigo-600" />
              <span>Enable</span>
            </label>
          </div>
        </div>
        {/* Test Token Section (only if SSO disabled) */}
        {!settings.googleSSOEnabled && (
          <div className="bg-white rounded-lg p-6 shadow flex flex-col gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Test Google Token</label>
              <input type="text" value={settings.testGoogleToken} onChange={handleTestTokenChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Paste test Google ID token here" />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Phone (optional for first time)</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter phone number" />
            </div>
          </div>
        )}
        {/* Future settings can be added here as more cards */}
      </div>
      <div className="flex justify-end mt-10">
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-2 px-8 rounded-lg shadow hover:from-indigo-700 hover:to-purple-700 transition">Save Settings</button>
      </div>
    </div>
  );
};

export default AdminSettings;
