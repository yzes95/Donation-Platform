import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud } from 'lucide-react';

export const AwsLoginModal = ({ onAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'education' && password === 'education') {
      localStorage.setItem('ataa_aws_lab_authed', 'true');
      onAuthenticated();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
        
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-500/10 p-4 rounded-full">
            <Cloud className="w-10 h-10 text-emerald-500" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">AWS Lab Access</h2>
          <p className="text-gray-400 text-sm">Educational access only — credentials shared in class</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(false); }}
              placeholder="Username"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Password"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>
          
          {error && (
            <p className="text-red-400 text-sm text-center">Invalid credentials</p>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg px-4 py-3 transition-colors mt-2"
          >
            Enter Lab
          </button>
        </form>
      </motion.div>
    </div>
  );
};
