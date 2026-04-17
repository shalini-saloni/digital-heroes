import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [charities, setCharities] = useState([]);
  const [draws, setDraws] = useState([]);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    try {
      const p1 = axios.get('/api/admin/stats', { headers });
      const p2 = axios.get('/api/admin/users', { headers });
      const p3 = axios.get('/api/charities', { headers });
      const p4 = axios.get('/api/draws');

      const [sRes, uRes, cRes, dRes] = await Promise.all([p1, p2, p3, p4]);
      setStats(sRes.data);
      setUsers(uRes.data);
      setCharities(cRes.data);
      setDraws(dRes.data);
    } catch (err) { console.error(err); }
  };

  const handleSimulateDraw = async () => {
    try {
      const monthStr = new Date().toISOString().substring(0, 7);
      await axios.post('/api/draws/simulate', { month: monthStr, logic: 'random' }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handlePublishDraw = async (id) => {
    try {
      await axios.post(`/api/draws/${id}/publish`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchData();
    } catch (err) { console.error(err); }
  };

  if (!stats) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
      <h1 className="text-3xl mb-8 font-semibold">Admin Command Center</h1>

      <div className="grid grid-4 mb-8">
        <div className="glass-panel p-4">
          <div className="text-muted text-xs font-semibold uppercase mb-1">Total Users</div>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
        </div>
        <div className="glass-panel p-4">
          <div className="text-muted text-xs font-semibold uppercase mb-1">Active Subs</div>
          <div className="text-2xl font-bold">{stats.activeSubscribers}</div>
        </div>
        <div className="glass-panel p-4">
          <div className="text-muted text-xs font-semibold uppercase mb-1">Prize Pool</div>
          <div className="text-2xl font-bold text-primary">£{stats.currentPrizePool.toFixed(2)}</div>
        </div>
        <div className="glass-panel p-4">
          <div className="text-muted text-xs font-semibold uppercase mb-1">Charity Given</div>
          <div className="text-2xl font-bold text-accent-green">£{stats.totalCharityContributions.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="glass-panel">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Draw Management</h2>
            <button className="btn btn-secondary btn-sm" onClick={handleSimulateDraw}>Simulate Engine</button>
          </div>
          
          {draws.length === 0 ? <p className="text-muted text-sm">No draws generated.</p> : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Month</th><th>Status</th><th>Logic</th><th>Action</th></tr></thead>
                <tbody>
                  {draws.map(d => (
                    <tr key={d._id}>
                      <td>{d.month}</td>
                      <td>
                        <span className={`badge ${d.status === 'published' ? 'badge-info' : 'badge-pending'}`}>{d.status}</span>
                      </td>
                      <td className="text-xs uppercase">{d.logic}</td>
                      <td>
                        {d.status !== 'published' && (
                          <button onClick={() => handlePublishDraw(d._id)} className="btn btn-primary btn-xs text-black">Publish</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="glass-panel">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Users Overview</h2>
          </div>
          <div className="table-wrapper" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <table>
              <thead><tr><th>Email</th><th>Sub</th><th>Score Count</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td className="text-xs">{u.email}</td>
                    <td>{u.subscriptionStatus === 'active' ? <span className="text-accent-green text-xs">Active</span> : <span className="text-muted text-xs">Inactive</span>}</td>
                    <td className="text-xs">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
