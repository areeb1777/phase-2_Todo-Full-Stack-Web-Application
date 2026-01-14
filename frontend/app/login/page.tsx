"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { todoApi } from '@/lib/api';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await todoApi.login({ email, password });
      router.push('/'); // Redirect to dashboard after login
      router.refresh(); // Refresh to update the UI
    } catch (err: any) {
      if (err.message.includes('401')) {
        setError('Invalid email or password. Please try again.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please make sure the backend is running.');
      } else {
        setError(err.message || 'An error occurred during login. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/10 p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            TaskFlow Pro
          </h1>
          <p className="text-foreground/70 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-8">
          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary/50 rounded-lg transition"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary/50 rounded-lg transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-foreground/70 text-sm">
              Don't have an account?{' '}
              <a href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}