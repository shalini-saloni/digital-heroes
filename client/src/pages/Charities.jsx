import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, ExternalLink, Calendar, Users, Heart } from 'lucide-react';

export default function Charities() {
  const [charities, setCharities] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'youth', 'environment', 'veterans', 'health', 'education', 'community'];

  useEffect(() => {
    const fetchCharities = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category !== 'all') params.category = category;
        const res = await axios.get('/api/charities', { params });
        setCharities(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const handler = setTimeout(() => {
      fetchCharities();
    }, 300);

    return () => clearTimeout(handler);
  }, [search, category]);

  const featured = charities.filter(c => c.featured);
  const regular = charities.filter(c => !c.featured);

  return (
    <div className="container animate-fade-in" style={{ padding: '80px 24px', minHeight: '80vh' }}>
      <div className="text-center mb-10">
        <h1 className="text-5xl mb-4">Our Charity <span className="text-gradient">Partners</span></h1>
        <p className="text-secondary text-lg" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Every subscriber directly fuels a cause. Explore the organizations making a real difference.
        </p>
      </div>

      {/* FILTER & SEARCH CONTAINER */}
      <div className="glass-panel text-center mb-12" style={{ padding: '24px 32px' }}>
        <div className="flex gap-4 justify-center items-center flex-col sm:flex-row">
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search charities..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '44px', background: 'rgba(0,0,0,0.4)', border: '1px dashed var(--border-glass)' }}
              className="w-full"
            />
          </div>

          <div className="flex gap-2 justify-center flex-wrap" style={{ display: 'inline-flex' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`badge cursor-pointer transition-all ${category === cat ? 'badge-active' : ''}`}
                style={{
                  padding: '8px 16px',
                  background: category === cat ? '' : 'rgba(255,255,255,0.03)',
                  border: category === cat ? '' : '1px solid var(--border-glass)',
                  color: category === cat ? '' : 'var(--text-secondary)'
                }}
              >
                {cat === 'all' ? 'All Causes' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-glass)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          <p className="text-muted mt-4">Searching organizations...</p>
        </div>
      ) : charities.length === 0 ? (
        <div className="glass-panel text-center py-16" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Heart size={48} className="text-muted mb-4 mx-auto opacity-50" />
          <h3 className="text-2xl mb-2">No charities found</h3>
          <p className="text-secondary">Try adjusting your filters or search term.</p>
          <button onClick={() => { setSearch(''); setCategory('all'); }} className="btn btn-secondary mt-6">Clear Filters</button>
        </div>
      ) : (
        <>
          {featured.length > 0 && category === 'all' && !search && (
            <div className="mb-12">
              <h2 className="text-2xl mb-6 font-semibold flex items-center gap-2">
                <span style={{ display: 'inline-block', width: '8px', height: '24px', background: 'var(--accent-gold)', borderRadius: '4px' }}></span>
                Featured Impact Partners
              </h2>
              <div className="grid grid-3">
                {featured.map(c => <CharityCard key={c._id} charity={c} />)}
              </div>
            </div>
          )}

          {(regular.length > 0 || search || category !== 'all') && (
            <div>
              <h2 className="text-2xl mb-6 font-semibold flex items-center gap-2">
                <span style={{ display: 'inline-block', width: '8px', height: '24px', background: 'var(--accent-primary)', borderRadius: '4px' }}></span>
                Directory
              </h2>
              <div className="grid grid-3">
                {(search || category !== 'all' ? charities : regular).map(c => (
                  <CharityCard key={c._id} charity={c} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}

function CharityCard({ charity }) {
  return (
    <div className={`glass-panel flex flex-col hover:scale-[1.02] transition-transform ${charity.featured ? 'glass-panel-accent' : ''}`} style={{ padding: '28px' }}>
      <div className="flex items-center gap-4 mb-4">
        <div className="charity-icon mb-0" style={{ margin: 0, width: '48px', height: '48px', flexShrink: 0 }}>
          <Heart size={20} color={charity.featured ? "var(--accent-gold)" : "var(--accent-primary)"} />
        </div>
        <div>
          <h3 className="font-semibold text-lg leading-tight mb-1">{charity.name}</h3>
          <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{charity.category}</span>
        </div>
      </div>
      <p className="text-sm text-secondary flex-1 leading-relaxed border-t border-b border-opacity-10 mb-4 py-4" style={{ borderColor: 'var(--border-glass)', minHeight: '80px' }}>
        {charity.description}
      </p>
      
      {charity.upcomingEvents && charity.upcomingEvents.length > 0 && (
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={12} color="var(--accent-hover)" />
            <span className="text-xs text-secondary font-medium">Upcoming Initiative</span>
          </div>
          <p className="text-xs">{charity.upcomingEvents[0].title}</p>
        </div>
      )}
      
      <div className="flex items-center gap-2 mt-auto text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
        <Users size={14} color="var(--accent-primary)" />
        <span>{charity.supporterCount || 0} Members Funding This</span>
      </div>
    </div>
  );
}
