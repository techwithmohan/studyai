import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Check, X, Sparkles, ArrowRight, Zap, Crown, Shield,
  FileText, MessageSquare, Image, Brain, BarChart3, Users, Infinity
} from 'lucide-react'
import './Pricing.css'

function useReveal() {
  const ref = useRef()
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  return ref
}

const plans = [
  {
    id: 'free',
    name: 'Starter',
    icon: <Zap size={24} />,
    desc: 'Perfect for trying out StudyAI',
    price: 0,
    period: 'forever',
    color: 'gray',
    cta: 'Get Started Free',
    features: [
      { text: '5 PDF uploads / month', included: true },
      { text: '10 AI chat messages / day', included: true },
      { text: 'Basic summaries', included: true },
      { text: '2 Quiz generations / month', included: true },
      { text: 'Max 10MB per file', included: true },
      { text: 'Infographic generator', included: false },
      { text: 'Priority AI processing', included: false },
      { text: 'Advanced analytics', included: false },
      { text: 'API access', included: false },
      { text: 'Team collaboration', included: false },
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: <Crown size={24} />,
    desc: 'For serious students & researchers',
    price: 19,
    period: '/month',
    popular: true,
    color: 'primary',
    cta: 'Start Pro Trial',
    features: [
      { text: '100 PDF uploads / month', included: true },
      { text: 'Unlimited AI chat messages', included: true },
      { text: 'Advanced summaries + key points', included: true },
      { text: 'Unlimited quiz generation', included: true },
      { text: 'Max 100MB per file', included: true },
      { text: 'Infographic generator', included: true },
      { text: 'Priority AI processing', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'API access', included: false },
      { text: 'Team collaboration', included: false },
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: <Shield size={24} />,
    desc: 'For teams, institutions & universities',
    price: 49,
    period: '/month',
    color: 'dark',
    cta: 'Contact Sales',
    features: [
      { text: 'Unlimited PDF uploads', included: true },
      { text: 'Unlimited AI chat messages', included: true },
      { text: 'Advanced summaries + key points', included: true },
      { text: 'Unlimited quiz generation', included: true },
      { text: 'No file size limit', included: true },
      { text: 'Infographic generator', included: true },
      { text: 'Priority AI processing', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'API access', included: true },
      { text: 'Team collaboration (up to 50)', included: true },
    ]
  }
]

const faqs = [
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise plans.'
  },
  {
    q: 'Is there a student discount?',
    a: 'Yes! Students with a valid .edu email get 30% off Pro plans. Contact us to get your discount code.'
  },
  {
    q: 'How does the AI chatbot work?',
    a: 'Our RAG (Retrieval-Augmented Generation) AI reads and indexes your uploaded PDFs, then answers your questions by referencing relevant sections with page numbers.'
  },
  {
    q: 'Can I upgrade or downgrade my plan?',
    a: 'Absolutely. You can switch plans at any time. Upgrades take effect immediately, and downgrades apply at the next billing cycle.'
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. We use AES-256 encryption for all documents, SSL/TLS for data transfer, and never share your data with third parties. Your files are stored securely and can be deleted anytime.'
  }
]

export default function Pricing() {
  const pageRef = useReveal()
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div ref={pageRef} className="pricing-page">
      {/* Hero */}
      <section className="pricing-hero" id="pricing-hero">
        <div className="pricing-hero__bg"></div>
        <div className="container pricing-hero__inner">
          <span className="section-label reveal"><Sparkles size={14} /> Pricing</span>
          <h1 className="section-title reveal" style={{ maxWidth: 600 }}>
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h1>
          <p className="section-subtitle reveal" style={{ textAlign: 'center', margin: '0 auto' }}>
            Choose the perfect plan for your study needs. Start free and upgrade anytime.
          </p>

          <div className="pricing-toggle reveal">
            <span className={!annual ? 'pricing-toggle__active' : ''}>Monthly</span>
            <button
              className={`pricing-toggle__switch ${annual ? 'pricing-toggle__switch--active' : ''}`}
              onClick={() => setAnnual(!annual)}
              id="pricing-toggle"
              aria-label="Toggle annual billing"
            >
              <div className="pricing-toggle__knob"></div>
            </button>
            <span className={annual ? 'pricing-toggle__active' : ''}>
              Annual <span className="pricing-toggle__save">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="pricing-plans" id="pricing-plans">
        <div className="container">
          <div className="pricing-plans__grid">
            {plans.map((plan, i) => (
              <div
                key={plan.id}
                className={`plan-card ${plan.popular ? 'plan-card--popular' : ''} reveal`}
                style={{ animationDelay: `${i * 0.15}s` }}
                id={`plan-${plan.id}`}
              >
                {plan.popular && (
                  <div className="plan-card__badge">Most Popular</div>
                )}
                <div className={`plan-card__icon plan-card__icon--${plan.color}`}>
                  {plan.icon}
                </div>
                <h3 className="plan-card__name">{plan.name}</h3>
                <p className="plan-card__desc">{plan.desc}</p>
                <div className="plan-card__price">
                  <span className="plan-card__currency">$</span>
                  <span className="plan-card__amount">
                    {annual && plan.price > 0 ? Math.round(plan.price * 0.8) : plan.price}
                  </span>
                  <span className="plan-card__period">{plan.period}</span>
                </div>
                <Link
                  to="/dashboard"
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-lg plan-card__cta`}
                  id={`plan-cta-${plan.id}`}
                >
                  {plan.cta} <ArrowRight size={18} />
                </Link>
                <div className="plan-card__divider"></div>
                <ul className="plan-card__features">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`plan-card__feature ${!f.included ? 'plan-card__feature--disabled' : ''}`}>
                      {f.included
                        ? <Check size={16} className="plan-card__feature-icon plan-card__feature-icon--yes" />
                        : <X size={16} className="plan-card__feature-icon plan-card__feature-icon--no" />
                      }
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="pricing-compare section" id="pricing-compare">
        <div className="container">
          <div className="text-center reveal">
            <h2 className="section-title">Detailed <span className="text-gradient">Comparison</span></h2>
          </div>
          <div className="compare-table reveal">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Starter</th>
                  <th className="compare-highlight">Pro</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['PDF Uploads', '5/month', '100/month', 'Unlimited'],
                  ['AI Chat Messages', '10/day', 'Unlimited', 'Unlimited'],
                  ['Max File Size', '10 MB', '100 MB', 'No Limit'],
                  ['Summaries', 'Basic', 'Advanced', 'Advanced'],
                  ['Quiz Generation', '2/month', 'Unlimited', 'Unlimited'],
                  ['Infographics', '—', '✓', '✓'],
                  ['Priority Processing', '—', '✓', '✓'],
                  ['Analytics', 'Basic', 'Advanced', 'Advanced'],
                  ['API Access', '—', '—', '✓'],
                  ['Team Members', '1', '1', 'Up to 50'],
                  ['Support', 'Community', 'Priority Email', 'Dedicated Manager'],
                ].map(([feature, starter, pro, enterprise], i) => (
                  <tr key={i}>
                    <td className="compare-feature">{feature}</td>
                    <td>{starter}</td>
                    <td className="compare-highlight">{pro}</td>
                    <td>{enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pricing-faq section" id="pricing-faq">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label"><MessageSquare size={14} /> FAQ</span>
            <h2 className="section-title">Frequently Asked <span className="text-gradient">Questions</span></h2>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item reveal ${openFaq === i ? 'faq-item--open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                id={`faq-${i}`}
              >
                <div className="faq-item__q">
                  <span>{faq.q}</span>
                  <span className="faq-item__toggle">{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && (
                  <div className="faq-item__a">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
