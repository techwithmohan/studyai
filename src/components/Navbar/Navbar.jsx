import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Menu, X } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-nav">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" id="nav-logo">
          <div className="navbar__logo-icon">
            <BookOpen size={22} />
          </div>
          <span className="navbar__logo-text">Study<span className="text-gradient">AI</span></span>
        </Link>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}>Home</Link>
          <a href="/#features" className="navbar__link">Features</a>
          <a href="/#how-it-works" className="navbar__link">How It Works</a>
          <Link to="/pricing" className={`navbar__link ${location.pathname === '/pricing' ? 'navbar__link--active' : ''}`}>Pricing</Link>

          <div className="navbar__cta-group">
            <Link to="/login" className="btn btn-ghost" id="nav-login">Log In</Link>
            <Link to="/dashboard" className="btn btn-primary" id="nav-get-started">Get Started Free</Link>
          </div>
        </div>

        <button
          className="navbar__toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          id="nav-toggle"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  )
}
