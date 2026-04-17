import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, Award, Zap } from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [scores, setScores] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const [newScore, setNewScore] = useState('');
  const [newScoreDate, setNewScoreDate] = useState('');
  const [scoreError, setScoreError] = useState('');

  useEffect(() => {
    if (user && user.subscriptionStatus === 'active') {
      fetchScores();
      fetchResults();
    }
  }, [user]);

  const fetchScores = async () => {
    try {
      const res = await axios.get('/api/scores', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
      setScores(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchResults = async () => {
    try {
      const res = await axios.get('/api/draws/my-results', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
      setMyResults(res.data);
    } catch (err) { console.error(err); }
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    setScoreError('');
    try {
      await axios.post('/api/scores', { score: Number(newScore), date: newScoreDate }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
      setNewScore('');
      setNewScoreDate('');
      fetchScores();
    } catch (err) {
      setScoreError(err.response?.data?.message || 'Error saving score');
    }
  };

  const handleDeleteScore = async (id) => {
    try {
      await axios.delete(`/api/scores/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
      fetchScores();
    } catch (err) { console.error(err); }
  };

  if (loading) return null;

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px', minHeight: '80vh' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl mb-1">Welcome back, {user?.name.split(' ')[0]}</h1>
          <p className="text-secondary text-sm">Here's your performance and platform status.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-secondary mb-1">Subscription</div>
          {user?.subscriptionStatus === 'active' ? (
            <span className="badge badge-active"><Zap size={14} /> Active {user.subscriptionPlan}</span>
          ) : (
            <span className="badge badge-inactive">Inactive</span>
          )}
        </div>
      </div>

      {user?.subscriptionStatus !== 'active' ? (
        <div className="empty-state">
          <Zap size={32} className="text-muted mb-4" />
          <h2 className="text-xl mb-2">Subscription Required</h2>
          <p className="text-secondary text-sm mb-6 max-w-md">To submit scores, participate in monthly draws, and support charities, you need an active subscription.</p>
          <Link to="/subscribe" className="btn btn-primary">View Plans</Link>
        </div>
      ) : (
        <div className="grid grid-2">
          {/* SCORES SECTION */}
          <div className="glass-panel text-left">
            <h2 className="text-xl mb-4 flex items-center gap-2"><Award size={20} /> Your Rolling 5 Scores</h2>
            
            <div className="flex gap-4 items-center justify-center mb-8 p-4" style={{ background: '#050505', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              {[0,1,2,3,4].map(idx => {
                const s = scores[idx];
                return (
                  <div key={idx} className="flex-col items-center">
                    <div className={`score-ball ${!s ? 'empty' : ''}`}>
                      {s ? s.score : '-'}
                    </div>
                    <div className="text-xs text-muted mt-2">
                      {s ? new Date(s.date).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : '--'}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleScoreSubmit} className="mb-6 p-4" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed var(--border-glass)' }}>
              <h3 className="text-sm font-semibold mb-3">Add New Round</h3>
              {scoreError && <div className="alert alert-error mb-3" style={{ padding: '8px', fontSize: '0.8rem' }}>{scoreError}</div>}
              <div className="flex gap-3">
                <input type="number" min="1" max="45" value={newScore} onChange={e=>setNewScore(e.target.value)} required placeholder="Score (1-45)" style={{ flex: 1 }} />
                <input type="date" value={newScoreDate} onChange={e=>setNewScoreDate(e.target.value)} required className="custom-date-picker" style={{ flex: 1 }} />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}><Plus size={18} /></button>
              </div>
            </form>

            <div className="text-sm">
              <h3 className="font-semibold mb-2">History</h3>
              {scores.map(s => (
                <div key={s._id} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-lg">{s.score}</span>
                    <span className="text-muted">{new Date(s.date).toLocaleDateString()}</span>
                  </div>
                  <button onClick={() => handleDeleteScore(s._id)} className="btn btn-ghost btn-xs text-secondary" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {scores.length === 0 && <p className="text-muted italic py-2">No scores logged yet.</p>}
            </div>
          </div>

          {/* RESULTS & CHARITY SECTION */}
          <div className="flex-col gap-6">
            <div className="glass-panel text-left">
              <h2 className="text-xl mb-4 font-semibold">Your Draw Results</h2>
              {myResults.length === 0 ? (
                <div className="text-center py-6 text-muted border" style={{ borderRadius: '8px', border: '1px dashed var(--border-glass)' }}>
                  No winnings yet. Keep playing!
                </div>
              ) : (
                <div className="flex-col gap-4">
                  {myResults.map((r, i) => (
                    <div key={i} className="flex justify-between items-center p-4" style={{ background: '#111', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                      <div>
                        <div className="font-semibold badge badge-active mb-1">{r.tier.replace('match', 'Match ')}</div>
                        <div className="text-xs text-muted">Draw: {r.month}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-primary">£{r.prizeAmount.toFixed(2)}</div>
                        <div className="text-xs text-secondary">{r.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
