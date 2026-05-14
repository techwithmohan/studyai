import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Upload, Brain, FileText, BarChart3, MessageSquare, Sparkles,
  ArrowRight, CheckCircle2, Zap, Shield, Clock, Users,
  Star, ChevronRight, BookOpen, Bot, Image, PieChart
} from 'lucide-react'
import './Home.css'

function useReveal() {
  const ref = useRef()
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )
    const elements = ref.current?.querySelectorAll('.reveal')
    elements?.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  return ref
}

export default function Home() {
  const pageRef = useReveal()

  return (
    <div ref={pageRef}>
      {/* ===== HERO ===== */}
      <section className="hero" id="hero">
        <div className="hero__bg-shapes">
          <div className="hero__shape hero__shape--1"></div>
          <div className="hero__shape hero__shape--2"></div>
          <div className="hero__shape hero__shape--3"></div>
        </div>
        <div className="container hero__inner">
          <div className="hero__content">
            <div className="hero__badge animate-fade-up">
              <Sparkles size={14} />
              <span>AI-Powered Learning Platform</span>
            </div>
            <h1 className="hero__title animate-fade-up delay-1">
              Turn Your Study PDFs Into
              <span className="text-gradient"> Interactive Knowledge</span>
            </h1>
            <p className="hero__subtitle animate-fade-up delay-2">
              Upload any exam study material and get instant AI-generated summaries, 
              practice questions, infographics, and an intelligent chatbot that 
              answers your questions — all in seconds.
            </p>
            <div className="hero__cta animate-fade-up delay-3">
              <Link to="/dashboard" className="btn btn-primary btn-lg" id="hero-cta">
                Start Studying Free <ArrowRight size={20} />
              </Link>
              <a href="#how-it-works" className="btn btn-secondary btn-lg" id="hero-demo">
                See How It Works
              </a>
            </div>
            <div className="hero__stats animate-fade-up delay-4">
              <div className="hero__stat">
                <span className="hero__stat-value">50K+</span>
                <span className="hero__stat-label">Students</span>
              </div>
              <div className="hero__stat-divider"></div>
              <div className="hero__stat">
                <span className="hero__stat-value">2M+</span>
                <span className="hero__stat-label">PDFs Processed</span>
              </div>
              <div className="hero__stat-divider"></div>
              <div className="hero__stat">
                <span className="hero__stat-value">4.9</span>
                <span className="hero__stat-label">
                  <span className="hero__stars">★★★★★</span>
                </span>
              </div>
            </div>
          </div>
          <div className="hero__visual animate-fade-up delay-2">
            <div className="hero__mockup">
              <div className="hero__mockup-header">
                <div className="hero__mockup-dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="hero__mockup-title">StudyAI Dashboard</span>
              </div>
              <div className="hero__mockup-body">
                <div className="hero__mockup-sidebar">
                  <div className="hero__mockup-nav-item active">
                    <BookOpen size={14} /> My Documents
                  </div>
                  <div className="hero__mockup-nav-item">
                    <MessageSquare size={14} /> AI Chat
                  </div>
                  <div className="hero__mockup-nav-item">
                    <BarChart3 size={14} /> Infographics
                  </div>
                  <div className="hero__mockup-nav-item">
                    <FileText size={14} /> Quizzes
                  </div>
                </div>
                <div className="hero__mockup-main">
                  <div className="hero__mockup-upload">
                    <Upload size={24} strokeWidth={1.5} />
                    <p>Drop your PDF here</p>
                  </div>
                  <div className="hero__mockup-chat">
                    <div className="hero__chat-msg hero__chat-msg--bot">
                      <Bot size={14} />
                      <span>I've analyzed your Biology notes. The key topics are cell division, DNA replication, and protein synthesis. What would you like to study?</span>
                    </div>
                    <div className="hero__chat-msg hero__chat-msg--user">
                      <span>Explain mitosis in simple terms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero__float-card hero__float-card--1 animate-float">
              <Brain size={20} className="hero__float-icon" />
              <div>
                <span className="hero__float-title">AI Summary</span>
                <span className="hero__float-text">Generated in 3s</span>
              </div>
            </div>
            <div className="hero__float-card hero__float-card--2 animate-float" style={{ animationDelay: '1s' }}>
              <CheckCircle2 size={20} className="hero__float-icon hero__float-icon--green" />
              <div>
                <span className="hero__float-title">Quiz Ready</span>
                <span className="hero__float-text">25 questions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUSTED BY ===== */}
      <section className="trusted" id="trusted">
        <div className="container">
          <p className="trusted__label">Trusted by students at leading universities</p>
          <div className="trusted__logos">
            {['Stanford', 'MIT', 'Harvard', 'Oxford', 'Cambridge', 'Yale'].map(uni => (
              <div key={uni} className="trusted__logo">{uni}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features section" id="features">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label"><Sparkles size={14} /> Features</span>
            <h2 className="section-title">Everything You Need to <span className="text-gradient">Ace Your Exams</span></h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Our AI understands your study material deeply and creates personalized learning tools.
            </p>
          </div>

          <div className="features__grid">
            <div className="features__card features__card--large reveal">
              <div className="features__card-icon features__card-icon--primary">
                <Upload size={28} />
              </div>
              <h3 className="features__card-title">Smart PDF Upload</h3>
              <p className="features__card-desc">
                Upload any study material — textbooks, lecture notes, research papers. Our AI processes 
                and indexes every page for instant knowledge retrieval.
              </p>
              <div className="features__card-visual">
                <div className="features__upload-demo">
                  <div className="features__upload-file">
                    <FileText size={18} />
                    <div>
                      <span>Biology_Ch5.pdf</span>
                      <span className="features__file-size">2.4 MB</span>
                    </div>
                    <CheckCircle2 size={16} className="features__file-check" />
                  </div>
                  <div className="features__upload-file">
                    <FileText size={18} />
                    <div>
                      <span>Chemistry_Notes.pdf</span>
                      <span className="features__file-size">5.1 MB</span>
                    </div>
                    <CheckCircle2 size={16} className="features__file-check" />
                  </div>
                  <div className="features__upload-progress">
                    <FileText size={18} />
                    <div>
                      <span>Physics_Formulas.pdf</span>
                      <div className="features__progress-bar">
                        <div className="features__progress-fill" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    <span className="features__progress-pct">72%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="features__card reveal" style={{ animationDelay: '0.1s' }}>
              <div className="features__card-icon features__card-icon--cyan">
                <Bot size={24} />
              </div>
              <h3 className="features__card-title">RAG AI Chatbot</h3>
              <p className="features__card-desc">
                Ask any question about your documents. Our AI retrieves relevant passages and provides accurate, 
                sourced answers with page references.
              </p>
            </div>

            <div className="features__card reveal" style={{ animationDelay: '0.2s' }}>
              <div className="features__card-icon features__card-icon--purple">
                <Brain size={24} />
              </div>
              <h3 className="features__card-title">Smart Summaries</h3>
              <p className="features__card-desc">
                Get concise, chapter-by-chapter summaries highlighting key concepts, definitions, 
                and important formulas from your materials.
              </p>
            </div>

            <div className="features__card reveal" style={{ animationDelay: '0.3s' }}>
              <div className="features__card-icon features__card-icon--green">
                <Image size={24} />
              </div>
              <h3 className="features__card-title">Infographic Generator</h3>
              <p className="features__card-desc">
                Transform complex topics into beautiful, shareable infographics. Perfect for visual 
                learners and last-minute revision.
              </p>
            </div>

            <div className="features__card reveal" style={{ animationDelay: '0.4s' }}>
              <div className="features__card-icon features__card-icon--orange">
                <FileText size={24} />
              </div>
              <h3 className="features__card-title">Auto Quiz Builder</h3>
              <p className="features__card-desc">
                Automatically generate practice questions — MCQs, short answers, and explanations — 
                from your uploaded content.
              </p>
            </div>

            <div className="features__card reveal" style={{ animationDelay: '0.5s' }}>
              <div className="features__card-icon features__card-icon--pink">
                <PieChart size={24} />
              </div>
              <h3 className="features__card-title">Progress Analytics</h3>
              <p className="features__card-desc">
                Track your study sessions, quiz scores, and knowledge gaps with detailed 
                analytics dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="how-it-works section" id="how-it-works">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label"><Zap size={14} /> How It Works</span>
            <h2 className="section-title">Start Learning in <span className="text-gradient">3 Simple Steps</span></h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              From PDF upload to exam-ready in minutes. No complicated setup needed.
            </p>
          </div>

          <div className="steps">
            <div className="step reveal">
              <div className="step__number">01</div>
              <div className="step__icon">
                <Upload size={32} />
              </div>
              <h3 className="step__title">Upload Your PDFs</h3>
              <p className="step__desc">
                Drag and drop your study materials. We support textbooks, notes, research papers, 
                and any PDF document up to 100MB.
              </p>
            </div>
            <div className="step__connector reveal"></div>
            <div className="step reveal">
              <div className="step__number">02</div>
              <div className="step__icon step__icon--cyan">
                <Brain size={32} />
              </div>
              <h3 className="step__title">AI Processes & Learns</h3>
              <p className="step__desc">
                Our AI reads, understands, and indexes your content using advanced RAG technology. 
                This takes just seconds.
              </p>
            </div>
            <div className="step__connector reveal"></div>
            <div className="step reveal">
              <div className="step__number">03</div>
              <div className="step__icon step__icon--green">
                <Sparkles size={32} />
              </div>
              <h3 className="step__title">Study Smarter</h3>
              <p className="step__desc">
                Chat with your documents, generate summaries, create infographics, 
                and take AI-generated quizzes. You're exam-ready!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials section" id="testimonials">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label"><Star size={14} /> Testimonials</span>
            <h2 className="section-title">Loved by <span className="text-gradient">50,000+ Students</span></h2>
          </div>

          <div className="testimonials__grid">
            {[
              {
                name: 'Sarah Chen',
                role: 'Medical Student, Stanford',
                text: 'StudyAI turned my 500-page anatomy textbook into concise summaries. I saved 20+ hours per week and improved my grades from B to A+.',
                avatar: 'SC'
              },
              {
                name: 'James Rodriguez',
                role: 'Law Student, Harvard',
                text: 'The RAG chatbot is incredible. I can ask specific questions about case law and get accurate answers with exact page references. Game changer!',
                avatar: 'JR'
              },
              {
                name: 'Priya Sharma',
                role: 'Engineering, MIT',
                text: 'The infographic generator helps me visualize complex engineering concepts. The auto-generated quizzes helped me identify weak areas before exams.',
                avatar: 'PS'
              },
              {
                name: 'Alex Turner',
                role: 'PhD Candidate, Oxford',
                text: 'As a research student, I upload dozens of papers weekly. StudyAI helps me quickly extract key findings and cross-reference information.',
                avatar: 'AT'
              },
              {
                name: 'Maria Garcia',
                role: 'Nursing Student, UCLA',
                text: 'The quiz builder generates questions exactly like our real exams. I went from struggling to top 10% in my cohort after using StudyAI for just 2 months.',
                avatar: 'MG'
              },
              {
                name: 'David Kim',
                role: 'MBA Student, Wharton',
                text: 'Perfect for case study preparation. I upload cases and the AI helps me analyze financial data, strategic frameworks, and key takeaways instantly.',
                avatar: 'DK'
              }
            ].map((t, i) => (
              <div key={i} className="testimonial-card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="testimonial-card__stars">★★★★★</div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">{t.avatar}</div>
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    <div className="testimonial-card__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="faq section" id="faq">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label"><MessageSquare size={14} /> FAQ</span>
            <h2 className="section-title">Frequently Asked <span className="text-gradient">Questions</span></h2>
          </div>
          
          <div className="faq__list reveal">
            <details className="faq__item">
              <summary className="faq__question">
                What types of files can I upload?
                <ChevronRight size={20} className="faq__icon" />
              </summary>
              <div className="faq__answer">
                You can upload any PDF document up to 100MB. This includes textbooks, lecture slides, research papers, and handwritten notes that have been scanned to PDF. Our AI can extract text even from complex layouts.
              </div>
            </details>
            <details className="faq__item">
              <summary className="faq__question">
                Is my study data secure?
                <ChevronRight size={20} className="faq__icon" />
              </summary>
              <div className="faq__answer">
                Yes, your privacy is our top priority. All uploaded documents are encrypted at rest and in transit. We do not use your private study materials to train our public AI models, and you can delete your files at any time.
              </div>
            </details>
            <details className="faq__item">
              <summary className="faq__question">
                Can I use StudyAI on my phone or tablet?
                <ChevronRight size={20} className="faq__icon" />
              </summary>
              <div className="faq__answer">
                Absolutely! StudyAI is fully responsive and works perfectly on all devices. You can read summaries, take quizzes, and chat with your documents on the go.
              </div>
            </details>
            <details className="faq__item">
              <summary className="faq__question">
                What languages are supported?
                <ChevronRight size={20} className="faq__icon" />
              </summary>
              <div className="faq__answer">
                Currently, our AI works best with English, Spanish, French, German, and Mandarin. We are constantly expanding our language support to help students worldwide.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section section" id="cta">
        <div className="container">
          <div className="cta-box reveal">
            <div className="cta-box__bg"></div>
            <div className="cta-box__content">
              <h2 className="cta-box__title">Ready to Study <span className="text-gradient">10x Smarter?</span></h2>
              <p className="cta-box__subtitle">
                Join 50,000+ students already using StudyAI to ace their exams. 
                Start for free — no credit card required.
              </p>
              <div className="cta-box__actions">
                <Link to="/dashboard" className="btn btn-primary btn-lg" id="cta-start">
                  Get Started Free <ArrowRight size={20} />
                </Link>
                <Link to="/pricing" className="btn btn-secondary btn-lg" id="cta-pricing">
                  View Pricing
                </Link>
              </div>
              <div className="cta-box__trust">
                <CheckCircle2 size={16} />
                <span>Free plan available</span>
                <CheckCircle2 size={16} />
                <span>No credit card needed</span>
                <CheckCircle2 size={16} />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
