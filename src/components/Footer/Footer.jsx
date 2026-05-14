import { Link } from 'react-router-dom'
import { BookOpen, Globe, GitBranch, Mail, ArrowRight } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon">
                <BookOpen size={20} />
              </div>
              <span>Study<span className="text-gradient">AI</span></span>
            </Link>
            <p className="footer__desc">
              Transform your study materials into interactive learning experiences with AI-powered summaries, quizzes, and infographics.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social" aria-label="Twitter"><Globe size={18} /></a>
              <a href="#" className="footer__social" aria-label="LinkedIn"><Globe size={18} /></a>
              <a href="#" className="footer__social" aria-label="GitHub"><GitBranch size={18} /></a>
              <a href="#" className="footer__social" aria-label="Email"><Mail size={18} /></a>
            </div>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Product</h4>
            <a href="/#features" className="footer__link">Features</a>
            <Link to="/pricing" className="footer__link">Pricing</Link>
            <a href="#" className="footer__link">API</a>
            <a href="#" className="footer__link">Integrations</a>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Resources</h4>
            <a href="#" className="footer__link">Documentation</a>
            <a href="#" className="footer__link">Blog</a>
            <a href="#" className="footer__link">Help Center</a>
            <a href="#" className="footer__link">Community</a>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Company</h4>
            <a href="#" className="footer__link">About</a>
            <a href="#" className="footer__link">Careers</a>
            <a href="#" className="footer__link">Privacy Policy</a>
            <a href="#" className="footer__link">Terms of Service</a>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Stay Updated</h4>
            <p className="footer__newsletter-text">Get the latest features and study tips.</p>
            <div className="footer__newsletter">
              <input type="email" placeholder="Enter your email" className="footer__newsletter-input" id="footer-email" />
              <button className="footer__newsletter-btn" id="footer-subscribe">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 StudyAI. All rights reserved.</p>
          <p>Made with ❤️ for students worldwide</p>
        </div>
      </div>
    </footer>
  )
}
