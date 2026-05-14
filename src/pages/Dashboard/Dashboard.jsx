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
import { getGeminiResponse } from '../../lib/gemini'
import { supabase } from '../../lib/supabase'

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

  const sendMessage = async (text) => {
    const msg = text || chatInput
    if (!msg.trim()) return
    
    const newUserMsg = { role: 'user', text: msg }
    setMessages(prev => [...prev, newUserMsg])
    setChatInput('')
    setIsTyping(true)

    // Call real Gemini API
    const response = await getGeminiResponse(msg, messages)
    
    setIsTyping(false)
    setMessages(prev => [...prev, { role: 'bot', text: response }])
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
