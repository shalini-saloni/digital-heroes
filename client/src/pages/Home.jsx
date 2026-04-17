import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, Trophy, ArrowRight, Zap, Target, DollarSign, Users, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    axios.get('/api/charities').then(res => {
      setCharities(res.data.filter(c => c.featured).slice(0, 3));
    }).catch(() => {});
  }, []);

  return (
    <div className="animate-fade-in">
      {/* HERO WITH CASCADING GLOW */}
      <section className="hero-bg">
        <div className="hero-glow"></div>
        <div className="container animate-slide-up" style={{ maxWidth: '850px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div className="badge badge-active mb-6" style={{ margin: '0 auto' }}>
            <Zap size={14} /> Monthly Prize Draws · Auto Charity Giving
          </div>
          <h1 className="text-5xl mb-6">
            Play to <span className="text-gradient">Win.</span><br />
            Play with <span className="text-gradient-accent">Purpose.</span>
          </h1>
          <p className="text-lg mb-8 text-secondary" style={{ maxWidth: '600px', margin: '0 auto 36px' }}>
            Subscribe, submit your Stableford scores, enter monthly jackpot draws, and automatically fund charities that matter.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="btn btn-primary btn-lg">
              Join the Movement <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn btn-secondary btn-lg">
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="container mb-8" style={{ marginTop: '-40px', position: 'relative', zIndex: 20 }}>
        <div className="glass-panel text-center" style={{ padding: '32px 24px' }}>
          <div className="grid grid-4" style={{ gap: '20px' }}>
            {[
              { icon: <Users size={24} />, value: '2,400+', label: 'Active Members', color: '#10b981' },
              { icon: <DollarSign size={24} />, value: '£48,000', label: 'Prizes Awarded', color: '#34d399' },
              { icon: <Heart size={24} />, value: '£12,500', label: 'Charity Donated', color: '#fbbf24' },
              { icon: <Trophy size={24} />, value: '156', label: 'Winners So Far', color: '#8b5cf6' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2 justify-center hover:scale-105 transition-transform">
                <div style={{ color: stat.color, background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>{stat.icon}</div>
                <div>
                  <div className="font-semibold text-2xl mb-1">{stat.value}</div>
                  <div className="text-xs text-muted uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container mt-8" id="how-it-works" style={{ padding: '80px 24px' }}>
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">How It <span className="text-gradient">Works</span></h2>
          <p className="text-secondary text-lg">Three simple steps to play, win, and make a difference</p>
        </div>

        <div className="grid grid-3">
          {[
            {
              icon: <Target size={28} />,
              color: 'var(--accent-purple)',
              title: '1. Track Scores',
              desc: 'Input your 5 most recent Stableford scores. Add a new score and your oldest one automatically drops off.'
            },
            {
              icon: <Trophy size={28} />,
              color: 'var(--accent-hover)',
              title: '2. Enter The Draw',
              desc: 'Every month, our engine calculates winning combos. Match 3, 4, or 5 scores to win from the prize pool.'
            },
            {
              icon: <Heart size={28} />,
              color: 'var(--accent-gold)',
              title: '3. Fund What Matters',
              desc: 'At least 10% of your subscription goes directly to your chosen charity. Full transparency on every dime.'
            }
          ].map((step, i) => (
            <div key={i} className="glass-panel" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <div className="charity-icon" style={{ color: step.color }}>
                {step.icon}
              </div>
              <h3 className="text-2xl mb-3">{step.title}</h3>
              <p className="text-secondary text-base leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED CHARITIES */}
      {charities.length > 0 && (
        <section className="container mt-8" style={{ padding: '60px 24px 80px' }}>
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Causes Making <span className="text-gradient-accent">Impact</span></h2>
            <p className="text-secondary text-lg">Your subscription directly supports these incredible causes</p>
          </div>

          <div className="grid grid-3">
            {charities.map((charity) => (
              <div key={charity._id} className="glass-panel flex flex-col">
                <div className="charity-icon">
                  <Heart size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-2">{charity.name}</h3>
                  <p className="text-sm text-secondary mb-6 leading-relaxed">{charity.description?.substring(0, 120)}...</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="badge badge-info"><Target size={12} /> {charity.category}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/charities" className="btn btn-secondary">View All Causes</Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container mt-8" style={{ padding: '0 24px 120px' }}>
        <div className="glass-panel-accent text-center" style={{ padding: '80px 40px' }}>
          <ShieldCheck size={48} className="mb-6" style={{ margin: '0 auto', color: 'var(--accent-hover)' }} />
          <h2 className="text-4xl mb-6">Ready to Make Your Mark?</h2>
          <p className="text-secondary mb-8 text-lg" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Join a modern platform prioritizing security, fairness, and charitable contribution. Let's change the game.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Start Your Journey <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
