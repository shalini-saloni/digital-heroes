import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, UserPlus } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [charityId, setCharityId] = useState('');
  const [charities, setCharities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/charities').then(res => setCharities(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password, charityId: charityId || undefined });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please attempt again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex flex-col justify-center items-center animate-fade-in" style={{ minHeight: '85vh', padding: '60px 20px' }}>
      <div className="text-center mb-8">
        <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-hover)', marginBottom: '16px' }}>
          <UserPlus size={32} />
        </div>
        <h2 className="text-3xl mb-3">Join Digital Heroes</h2>
        <p className="text-secondary text-base">Create your account to start playing</p>
      </div>

      <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', padding: '40px' }}>
        {error && <div className="alert alert-error mb-6" style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" minLength={6} />
          </div>
          <div className="form-group">
            <label>Support a Cause <span className="text-muted">(optional)</span></label>
            <select value={charityId} onChange={e => setCharityId(e.target.value)}>
              <option value="">-- Choose an impactful cause --</option>
              {charities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4" style={{ height: '48px' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
      
      <p className="text-center text-muted mt-8 text-sm">
        Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '500' }}>Log In here</Link>
      </p>
    </div>
  );
}
