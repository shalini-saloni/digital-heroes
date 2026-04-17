import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Charities from './pages/Charities';
import Subscribe from './pages/Subscribe';
import AdminPanel from './pages/AdminPanel';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <header>
      <div className="container flex justify-between items-center">
        <Link to="/" className="logo-text">
          Digital Heroes
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/charities" className="text-sm text-secondary hover:text-primary transition-colors">Charities</Link>
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin" className="text-sm font-medium" style={{ color: 'var(--accent-tertiary)' }}>Admin</Link>}
              <Link to="/dashboard" className="text-sm text-secondary hover:text-primary transition-colors">Dashboard</Link>
              <div className="flex items-center gap-3 ml-4" style={{ borderLeft: '1px solid var(--border-glass)', paddingLeft: '20px' }}>
                <span className="text-sm flex items-center gap-1 font-medium"><UserIcon size={14} /> {user.name.split(' ')[0]}</span>
                <button onClick={logout} className="btn btn-ghost btn-sm text-muted" title="Logout"><LogOut size={16} /></button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-glass)', padding: '40px 0', marginTop: 'auto', background: '#050505' }}>
      <div className="container flex justify-between items-center text-sm">
        <div className="text-muted">© 2026 Digital Heroes. Purposeful Play.</div>
        <div className="flex gap-4">
          <a href="#" className="text-muted hover:text-primary transition-colors">Terms</a>
          <a href="#" className="text-muted hover:text-primary transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/charities" element={<Charities />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/subscribe" element={<ProtectedRoute><Subscribe /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
