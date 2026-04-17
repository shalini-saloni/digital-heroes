import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Check } from 'lucide-react';

export default function Subscribe() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan) => {
    setLoading(true);
    try {
      await axios.post('/api/auth/subscribe', { plan }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
      // Refresh user context via local reload of data
      await axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}).then(res => {
        // Simple reload for context update in demo
        window.location.href = '/dashboard';
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in text-center" style={{ padding: '80px 24px', maxWidth: '800px' }}>
      <h1 className="text-4xl mb-4">Choose Your Plan</h1>
      <p className="text-secondary text-lg mb-12">10% of your subscription goes directly to your selected charity. Cancel anytime.</p>
      
      <div className="grid grid-2" style={{ alignItems: 'center' }}>
        
        <div className="glass-panel text-left" style={{ position: 'relative' }}>
          <h3 className="text-xl font-semibold mb-2">Monthly</h3>
          <p className="text-sm text-secondary mb-6">Perfect for trying out the platform.</p>
          <div className="text-4xl font-bold mb-6">£9.99<span className="text-sm font-normal text-muted">/mo</span></div>
          
          <ul className="mb-8 flex-col gap-3">
            <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-secondary" /> Submit scores for monthly draw</li>
            <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-secondary" /> 5-Match Jackpot entry</li>
            <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-secondary" /> Charity contribution</li>
          </ul>
          
          <button onClick={() => handleSubscribe('monthly')} disabled={loading} className="btn btn-secondary w-full">
            {loading ? 'Processing...' : 'Go Monthly'}
          </button>
        </div>

        <div className="glass-panel" style={{ border: '1px solid #ffffff', transform: 'scale(1.05)', position: 'relative', background: '#0e0e0e', textAlign: 'left' }}>
          <div className="badge badge-active" style={{ position: 'absolute', top: '-12px', left: '24px' }}>Most Popular</div>
          <h3 className="text-xl font-semibold mb-2">Yearly <span className="text-sm text-muted line-through ml-2">£119.88</span></h3>
          <p className="text-sm text-secondary mb-6">Save 20% when you commit annually.</p>
          <div className="text-4xl font-bold mb-6">£7.99<span className="text-sm font-normal text-muted">/mo</span></div>
          
          <ul className="mb-8 flex-col gap-3">
            <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-secondary" /> Submit scores for monthly draw</li>
            <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-secondary" /> 5-Match Jackpot entry</li>
            <li className="flex items-center gap-2 text-sm"><Check size={16} className="text-secondary" /> Charity contribution</li>
          </ul>
          
          <button onClick={() => handleSubscribe('yearly')} disabled={loading} className="btn btn-primary w-full text-black">
            {loading ? 'Processing...' : 'Subscribe Annually'}
          </button>
        </div>
      </div>
      
      <p className="text-xs text-muted flex items-center justify-center gap-2 mt-12">
        <ShieldCheck size={16} /> Secure payments processed via Stripe (PCI-Compliant).
      </p>
    </div>
  );
}
