import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Mail, Lock, Eye, EyeOff, ArrowRight, Globe } from 'lucide-react'
import './Login.css'

export default function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="login-page">
      <div className="login-page__bg"></div>
      <div className="login-container">
        <div className="login-card">
          <div className="login-card__header">
            <Link to="/" className="login-card__logo">
              <div className="login-card__logo-icon"><BookOpen size={20} /></div>
              <span>Study<span className="text-gradient">AI</span></span>
            </Link>
            <h1 className="login-card__title">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="login-card__subtitle">
              {isSignup ? 'Start studying smarter with AI' : 'Sign in to continue learning'}
            </p>
          </div>

          <button className="login-card__google" id="login-google">
            <Globe size={20} />
            Continue with Google
          </button>

          <div className="login-card__divider">
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit} className="login-card__form">
            {isSignup && (
              <div className="login-field">
                <label htmlFor="login-name">Full Name</label>
                <input type="text" id="login-name" placeholder="John Doe" />
              </div>
            )}
            <div className="login-field">
              <label htmlFor="login-email">Email</label>
              <div className="login-field__input-wrap">
                <Mail size={18} className="login-field__icon" />
                <input type="email" id="login-email" placeholder="you@university.edu" />
              </div>
            </div>
            <div className="login-field">
              <div className="login-field__label-row">
                <label htmlFor="login-password">Password</label>
                {!isSignup && <a href="#" className="login-card__forgot">Forgot password?</a>}
              </div>
              <div className="login-field__input-wrap">
                <Lock size={18} className="login-field__icon" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  id="login-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="login-field__toggle"
                  onClick={() => setShowPwd(!showPwd)}
                  aria-label="Toggle password"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg login-card__submit" id="login-submit">
              {isSignup ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>

          <p className="login-card__switch">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => setIsSignup(!isSignup)} className="login-card__switch-btn" id="login-toggle">
              {isSignup ? 'Sign In' : 'Sign Up Free'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
