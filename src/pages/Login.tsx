import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = signIn(password);
    if (!ok) setError(true);
  };

  return (
    <div className="min-h-screen bg-sv-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
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
            <label className="block text-sv-gray-text text-sm mb-1">Password</label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className="w-full bg-sv-gray border border-sv-gray-light rounded-lg px-3 py-2 text-sm text-sv-white focus:outline-none focus:border-sv-lime/50"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm">Incorrect password.</p>}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-sv-lime text-sv-black font-semibold text-sm hover:bg-sv-lime-dark transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
