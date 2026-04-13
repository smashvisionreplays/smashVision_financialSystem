import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Invalid email or password.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-sv-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo + brand */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <img src="/logo.png" alt="Smash Vision" className="w-16 h-16 rounded-xl" />
          <div className="text-center">
            <h1 className="text-sv-white font-bold text-2xl">Smash Vision</h1>
            <p className="text-sv-gray-text text-sm">Financial System</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-sv-dark border border-sv-gray rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block text-sv-gray-text text-sm mb-1">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sv-gray-text text-sm mb-1">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-sv-lime text-sv-black font-semibold text-sm hover:bg-sv-lime-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
