import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex flex-col justify-center items-center animate-fade-in" style={{ minHeight: '85vh', padding: '60px 20px' }}>
      
      <div className="text-center mb-8">
        <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '20px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)', marginBottom: '16px' }}>
          <LogIn size={32} />
        </div>
        <h2 className="text-3xl mb-3">Welcome Back</h2>
        <p className="text-secondary text-base">Sign in to your account</p>
      </div>

      <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', padding: '40px' }}>
        {error && <div className="alert alert-error mb-6" style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4" style={{ height: '48px' }} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '24px' }}>
          <p className="text-xs text-muted text-center mb-3 text-uppercase tracking-wider">Demo Credentials</p>
          <div className="flex justify-center">
            <button
              type="button"
              className="btn btn-secondary w-full"
              onClick={() => { setEmail('admin@digitalheroes.co.in'); setPassword('adminpass'); }}
            >
              Autofill Admin Login
            </button>
          </div>
        </div>
      </div>
      
      <p className="text-center text-muted mt-8 text-sm">
        Don't have an account? <Link to="/register" style={{ color: 'var(--accent-hover)', textDecoration: 'none', fontWeight: '500' }}>Get Started</Link>
      </p>
    </div>
  );
}
