import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import {
  BookOpen, Upload, FileText, MessageSquare, Brain, Image, BarChart3,
  Settings, LogOut, Search, Bell, ChevronDown, Send, Bot, User,
  Trash2, Eye, Download, Plus, X, Sparkles, CheckCircle2,
  PieChart, TrendingUp, Clock, Zap, ArrowRight, Menu,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import './Dashboard.css'

// Mock data
const mockDocuments = [
  { id: 1, name: 'Biology Chapter 5 - Cell Division.pdf', size: '2.4 MB', pages: 42, date: '2 hours ago', status: 'ready' },
  { id: 2, name: 'Chemistry Notes - Organic Compounds.pdf', size: '5.1 MB', pages: 78, date: '1 day ago', status: 'ready' },
  { id: 3, name: 'Physics Formulas & Derivations.pdf', size: '1.8 MB', pages: 23, date: '3 days ago', status: 'ready' },
  { id: 4, name: 'History - World War II Summary.pdf', size: '3.2 MB', pages: 56, date: '1 week ago', status: 'ready' },
]

const mockMessages = [
  { role: 'bot', text: "Hi! I'm your StudyAI assistant. I've analyzed your uploaded documents. Ask me anything about Biology, Chemistry, Physics, or History!" },
]

const sampleQuestions = [
  'Summarize the cell division process',
  'What are the key organic compounds?',
  'List Newton\'s laws of motion',
  'Explain the causes of World War II'
]

const mockSummary = {
  title: 'Biology Chapter 5 - Cell Division',
  keyPoints: [
    'Mitosis consists of 4 phases: Prophase, Metaphase, Anaphase, Telophase',
    'Cytokinesis divides the cytoplasm after nuclear division',
    'Meiosis produces 4 haploid daughter cells for sexual reproduction',
    'Cell cycle checkpoints regulate division to prevent errors',
    'Cancer results from uncontrolled cell division due to checkpoint failures'
  ],
  concepts: ['Mitosis', 'Meiosis', 'Cell Cycle', 'DNA Replication', 'Chromosomes']
}

const mockQuiz = [
  {
    q: 'How many phases does mitosis have?',
    options: ['2', '4', '6', '8'],
    correct: 1,
  },
  {
    q: 'What type of cells does meiosis produce?',
    options: ['Diploid cells', 'Haploid cells', 'Stem cells', 'Somatic cells'],
    correct: 1,
  },
  {
    q: 'Which phase of mitosis involves chromosome alignment at the cell equator?',
    options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
    correct: 1,
  }
]

const sidebarItems = [
  { key: 'documents', icon: FileText, label: 'My Documents' },
  { key: 'chat', icon: MessageSquare, label: 'AI Chat' },
  { key: 'summaries', icon: Brain, label: 'Summaries' },
  { key: 'quiz', icon: Zap, label: 'Quiz' },
  { key: 'infographics', icon: Image, label: 'Infographics' },
  { key: 'analytics', icon: BarChart3, label: 'Analytics' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('documents')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [documents, setDocuments] = useState(mockDocuments)
  const [messages, setMessages] = useState(mockMessages)
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const chatEndRef = useRef(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop: (files) => {
      const newDocs = files.map((f, i) => ({
        id: documents.length + i + 1,
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
        pages: Math.floor(Math.random() * 80) + 10,
        date: 'Just now',
        status: 'processing'
      }))
      setDocuments(prev => [...newDocs, ...prev])
      setTimeout(() => {
        setDocuments(prev => prev.map(d => d.status === 'processing' ? { ...d, status: 'ready' } : d))
      }, 3000)
    }
  })

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (text) => {
    const msg = text || chatInput
    if (!msg.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setChatInput('')
    setIsTyping(true)

    const responses = {
      'cell division': "## Cell Division Summary\n\nCell division is the process by which a parent cell divides into two or more daughter cells.\n\n**Key Types:**\n- **Mitosis**: Produces 2 identical diploid cells (for growth & repair)\n- **Meiosis**: Produces 4 unique haploid cells (for reproduction)\n\n**Mitosis Phases:**\n1. Prophase - chromosomes condense\n2. Metaphase - chromosomes align at equator\n3. Anaphase - chromosomes separate\n4. Telophase - nuclear envelopes reform\n\n📄 *Source: Biology Chapter 5, Pages 12-18*",
      'organic compounds': "## Key Organic Compounds\n\nOrganic compounds are carbon-based molecules essential to life.\n\n**Four Major Groups:**\n1. **Carbohydrates** - Energy source (glucose, starch)\n2. **Lipids** - Energy storage & cell membranes\n3. **Proteins** - Enzymes, structure, transport\n4. **Nucleic Acids** - DNA & RNA for genetic info\n\n**Key Functional Groups:** Hydroxyl (-OH), Carboxyl (-COOH), Amino (-NH₂)\n\n📄 *Source: Chemistry Notes, Pages 5-14*",
      'newton': "## Newton's Laws of Motion\n\n**1st Law (Inertia):**\nAn object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.\n\n**2nd Law (F=ma):**\nForce equals mass times acceleration. The acceleration of an object is directly proportional to the net force.\n\n**3rd Law (Action-Reaction):**\nFor every action, there is an equal and opposite reaction.\n\n📄 *Source: Physics Formulas, Pages 3-7*",
      'world war': "## Causes of World War II\n\n**Primary Causes:**\n1. **Treaty of Versailles** - Harsh penalties on Germany\n2. **Rise of Fascism** - Hitler, Mussolini, militarist Japan\n3. **Appeasement Policy** - Britain/France failed to stop aggression\n4. **Invasion of Poland** - September 1, 1939\n\n**Contributing Factors:**\n- Great Depression economic instability\n- Failure of the League of Nations\n- German rearmament and expansionism\n\n📄 *Source: History Summary, Pages 1-8*"
    }

    setTimeout(() => {
      const lowerMsg = msg.toLowerCase()
      let response = "I've searched through your uploaded documents. Based on the content, here's what I found:\n\nThis is a **demo response**. In the full version, the AI would analyze your specific PDFs using RAG (Retrieval-Augmented Generation) to provide accurate, sourced answers.\n\n💡 *Try asking about: cell division, organic compounds, Newton's laws, or World War II*"
      
      for (const [key, val] of Object.entries(responses)) {
        if (lowerMsg.includes(key)) {
          response = val
          break
        }
      }
      
      setIsTyping(false)
      setMessages(prev => [...prev, { role: 'bot', text: response }])
    }, 1500)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'documents':
        return (
          <div className="dash-content">
            <div className="dash-content__header">
              <h2>My Documents</h2>
              <span className="dash-content__count">{documents.length} files</span>
            </div>
            
            <div {...getRootProps()} className={`dash-upload ${isDragActive ? 'dash-upload--active' : ''}`} id="upload-zone">
              <input {...getInputProps()} />
              <div className="dash-upload__icon">
                <Upload size={32} />
              </div>
              <h3>Upload Study Materials</h3>
              <p>Drag & drop your PDF files here, or click to browse</p>
              <span className="dash-upload__hint">Supports PDF files up to 100MB</span>
            </div>

            <div className="dash-docs">
              {documents.map(doc => (
                <div key={doc.id} className="dash-doc" id={`doc-${doc.id}`}>
                  <div className="dash-doc__icon">
                    <FileText size={20} />
                  </div>
                  <div className="dash-doc__info">
                    <span className="dash-doc__name">{doc.name}</span>
                    <span className="dash-doc__meta">{doc.size} · {doc.pages} pages · {doc.date}</span>
                  </div>
                  <div className={`dash-doc__status dash-doc__status--${doc.status}`}>
                    {doc.status === 'processing' ? (
                      <><div className="dash-doc__spinner"></div> Processing</>
                    ) : (
                      <><CheckCircle2 size={14} /> Ready</>
                    )}
                  </div>
                  <div className="dash-doc__actions">
                    <button className="dash-doc__btn" aria-label="View"><Eye size={16} /></button>
                    <button className="dash-doc__btn" aria-label="Download"><Download size={16} /></button>
                    <button className="dash-doc__btn dash-doc__btn--danger" aria-label="Delete"
                      onClick={() => setDocuments(prev => prev.filter(d => d.id !== doc.id))}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'chat':
        return (
          <div className="dash-content dash-content--chat">
            <div className="dash-content__header">
              <h2>AI Chat</h2>
              <span className="dash-content__badge"><Bot size={14} /> RAG-Powered</span>
            </div>

            <div className="dash-chat">
              <div className="dash-chat__messages" id="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`dash-chat__msg dash-chat__msg--${msg.role}`}>
                    <div className="dash-chat__avatar">
                      {msg.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className="dash-chat__bubble">
                      {msg.text.split('\n').map((line, j) => {
                        if (line.startsWith('## ')) return <h3 key={j} className="dash-chat__h3">{line.replace('## ', '')}</h3>
                        if (line.startsWith('**') && line.endsWith('**')) return <strong key={j}>{line.replace(/\*\*/g, '')}</strong>
                        if (line.startsWith('- **')) {
                          const parts = line.replace('- **', '').split('**')
                          return <div key={j} className="dash-chat__list-item">• <strong>{parts[0]}</strong>{parts.slice(1).join('')}</div>
                        }
                        if (line.match(/^\d\./)) return <div key={j} className="dash-chat__list-item">{line}</div>
                        if (line.startsWith('📄') || line.startsWith('💡')) return <div key={j} className="dash-chat__source">{line}</div>
                        if (line === '') return <br key={j} />
                        return <p key={j}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                      })}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="dash-chat__msg dash-chat__msg--bot">
                    <div className="dash-chat__avatar"><Bot size={16} /></div>
                    <div className="dash-chat__bubble dash-chat__typing">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="dash-chat__suggestions">
                {sampleQuestions.map((q, i) => (
                  <button key={i} className="dash-chat__suggestion" onClick={() => sendMessage(q)}>
                    <Sparkles size={12} /> {q}
                  </button>
                ))}
              </div>

              <div className="dash-chat__input-area" id="chat-input-area">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask anything about your documents..."
                  className="dash-chat__input"
                  id="chat-input"
                />
                <button
                  className="dash-chat__send"
                  onClick={() => sendMessage()}
                  disabled={!chatInput.trim()}
                  id="chat-send"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        )

      case 'summaries':
        return (
          <div className="dash-content">
            <div className="dash-content__header">
              <h2>AI Summaries</h2>
              <button className="btn btn-primary btn-sm">
                <Plus size={16} /> Generate New
              </button>
            </div>

            <div className="dash-summary-card">
              <div className="dash-summary__header">
                <div className="dash-summary__icon"><Brain size={20} /></div>
                <div>
                  <h3>{mockSummary.title}</h3>
                  <span className="dash-summary__meta">Generated 2 hours ago · 42 pages analyzed</span>
                </div>
              </div>

              <div className="dash-summary__section">
                <h4>📌 Key Points</h4>
                <ul>
                  {mockSummary.keyPoints.map((point, i) => (
                    <li key={i}><CheckCircle2 size={14} /> {point}</li>
                  ))}
                </ul>
              </div>

              <div className="dash-summary__section">
                <h4>🏷️ Core Concepts</h4>
                <div className="dash-summary__tags">
                  {mockSummary.concepts.map((c, i) => (
                    <span key={i} className="dash-summary__tag">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'quiz':
        return (
          <div className="dash-content">
            <div className="dash-content__header">
              <h2>Practice Quiz</h2>
              <span className="dash-content__badge"><Zap size={14} /> Auto-Generated</span>
            </div>

            <div className="dash-quiz">
              {mockQuiz.map((item, i) => (
                <div key={i} className="dash-quiz__item" id={`quiz-q-${i}`}>
                  <h4 className="dash-quiz__question">Q{i + 1}. {item.q}</h4>
                  <div className="dash-quiz__options">
                    {item.options.map((opt, j) => {
                      const selected = quizAnswers[i] === j
                      const isCorrect = quizSubmitted && j === item.correct
                      const isWrong = quizSubmitted && selected && j !== item.correct
                      return (
                        <button
                          key={j}
                          className={`dash-quiz__option ${selected ? 'dash-quiz__option--selected' : ''} ${isCorrect ? 'dash-quiz__option--correct' : ''} ${isWrong ? 'dash-quiz__option--wrong' : ''}`}
                          onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [i]: j }))}
                          id={`quiz-${i}-opt-${j}`}
                        >
                          <span className="dash-quiz__letter">{String.fromCharCode(65 + j)}</span>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setQuizSubmitted(true)}
                disabled={Object.keys(quizAnswers).length < mockQuiz.length}
                id="quiz-submit"
              >
                {quizSubmitted ? `Score: ${Object.entries(quizAnswers).filter(([i, a]) => a === mockQuiz[i].correct).length}/${mockQuiz.length}` : 'Submit Answers'}
              </button>
            </div>
          </div>
        )

      case 'infographics':
        return (
          <div className="dash-content">
            <div className="dash-content__header">
              <h2>Infographics</h2>
              <button className="btn btn-primary btn-sm">
                <Plus size={16} /> Generate New
              </button>
            </div>

            <div className="dash-infographic">
              <div className="dash-infographic__card">
                <div className="dash-infographic__title">
                  <Image size={20} />
                  <span>Cell Division Process</span>
                </div>
                <div className="dash-infographic__visual">
                  <div className="dash-infographic__flow">
                    {['Interphase', 'Prophase', 'Metaphase', 'Anaphase', 'Telophase', 'Cytokinesis'].map((phase, i) => (
                      <div key={i} className="dash-infographic__step">
                        <div className={`dash-infographic__circle dash-infographic__circle--${i}`}>
                          {i + 1}
                        </div>
                        <span>{phase}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="dash-infographic__card">
                <div className="dash-infographic__title">
                  <PieChart size={20} />
                  <span>Organic Compounds Distribution</span>
                </div>
                <div className="dash-infographic__visual">
                  <div className="dash-infographic__bars">
                    {[
                      { label: 'Carbohydrates', value: 85, color: '#4F46E5' },
                      { label: 'Lipids', value: 72, color: '#06B6D4' },
                      { label: 'Proteins', value: 95, color: '#10B981' },
                      { label: 'Nucleic Acids', value: 60, color: '#F59E0B' }
                    ].map((item, i) => (
                      <div key={i} className="dash-infographic__bar-row">
                        <span className="dash-infographic__bar-label">{item.label}</span>
                        <div className="dash-infographic__bar-track">
                          <div
                            className="dash-infographic__bar-fill"
                            style={{ width: `${item.value}%`, background: item.color }}
                          ></div>
                        </div>
                        <span className="dash-infographic__bar-value">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'analytics':
        return (
          <div className="dash-content">
            <div className="dash-content__header">
              <h2>Study Analytics</h2>
            </div>

            <div className="dash-analytics__stats">
              {[
                { icon: FileText, label: 'Documents', value: '12', color: 'primary' },
                { icon: MessageSquare, label: 'Chat Messages', value: '148', color: 'cyan' },
                { icon: Clock, label: 'Study Hours', value: '23.5h', color: 'green' },
                { icon: TrendingUp, label: 'Quiz Score', value: '87%', color: 'orange' },
              ].map((stat, i) => (
                <div key={i} className="dash-stat-card">
                  <div className={`dash-stat-card__icon dash-stat-card__icon--${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <div className="dash-stat-card__value">{stat.value}</div>
                  <div className="dash-stat-card__label">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="dash-analytics__chart">
              <h3>Weekly Study Activity</h3>
              <div className="dash-chart">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const heights = [65, 40, 80, 55, 90, 30, 70]
                  return (
                    <div key={i} className="dash-chart__col">
                      <div className="dash-chart__bar" style={{ height: `${heights[i]}%` }}></div>
                      <span>{day}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="dashboard" id="dashboard">
      {/* Sidebar */}
      <aside className={`dash-sidebar ${sidebarOpen ? '' : 'dash-sidebar--collapsed'}`} id="sidebar">
        <div className="dash-sidebar__header">
          <Link to="/" className="dash-sidebar__logo">
            <div className="dash-sidebar__logo-icon"><BookOpen size={20} /></div>
            {sidebarOpen && <span>Study<span className="text-gradient">AI</span></span>}
          </Link>
          <button
            className="dash-sidebar__toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="dash-sidebar__nav">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              className={`dash-sidebar__item ${activeTab === item.key ? 'dash-sidebar__item--active' : ''}`}
              onClick={() => setActiveTab(item.key)}
              id={`nav-${item.key}`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="dash-sidebar__footer">
          <button className="dash-sidebar__item" id="nav-settings">
            <Settings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </button>
          <Link to="/" className="dash-sidebar__item" id="nav-logout">
            <LogOut size={20} />
            {sidebarOpen && <span>Log Out</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dash-main">
        {/* Top Bar */}
        <header className="dash-topbar" id="topbar">
          <button className="dash-topbar__menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
          <div className="dash-topbar__search">
            <Search size={18} />
            <input type="text" placeholder="Search documents, chats..." id="topbar-search" />
          </div>
          <div className="dash-topbar__actions">
            <button className="dash-topbar__notif" id="topbar-notif">
              <Bell size={20} />
              <span className="dash-topbar__notif-dot"></span>
            </button>
            <div className="dash-topbar__user" id="topbar-user">
              <div className="dash-topbar__avatar">JD</div>
              <span className="dash-topbar__name">John Doe</span>
              <span className="dash-topbar__plan">Pro Plan</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dash-body">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
