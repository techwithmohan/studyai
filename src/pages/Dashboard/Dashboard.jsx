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

// Constants
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const sampleQuestions = [
  'Summarize my uploaded documents',
  'What are the key concepts mentioned?',
  'Generate 5 practice questions',
  'Explain the main topics in simple terms'
]

const sidebarItems = [
  { key: 'documents', icon: FileText, label: 'My Documents' },
  { key: 'chat', icon: MessageSquare, label: 'AI Chat' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('documents')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [documents, setDocuments] = useState([])
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your StudyAI assistant. Upload your PDFs and I'll help you study them using AI!" }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const chatEndRef = useRef(null)

  // Fetch documents on load
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch(`${API_URL}/documents`)
        const data = await res.json()
        setDocuments(data)
      } catch (err) {
        console.error('Failed to fetch documents:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDocs()
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop: async (acceptedFiles) => {
      const formData = new FormData()
      acceptedFiles.forEach(file => {
        formData.append('pdf', file)
      })

      // Optimistic UI: Add temporary processing state
      const tempDocs = acceptedFiles.map((f, i) => ({
        id: `temp-${Date.now()}-${i}`,
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
        status: 'processing'
      }))
      setDocuments(prev => [...tempDocs, ...prev])

      try {
        const res = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData
        })
        const data = await res.json()
        
        // Replace temp doc with real one from server
        setDocuments(prev => prev.map(d => 
          d.name === data.document.name && d.status === 'processing' 
          ? { ...data.document, status: 'ready' } 
          : d
        ))
      } catch (err) {
        console.error('Upload failed:', err)
        setDocuments(prev => prev.filter(d => d.status !== 'processing'))
        alert('Failed to upload file. Please check if the backend is running.')
      }
    }
  })

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const msg = text || chatInput
    if (!msg.trim()) return
    
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setChatInput('')
    setIsTyping(true)

    try {
      const response = await getGeminiResponse(msg, messages)
      setMessages(prev => [...prev, { role: 'bot', text: response }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error: Could not reach the AI server." }])
    } finally {
      setIsTyping(false)
    }
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
              {isLoading ? (
                <div className="dash-docs__loading">Loading your library...</div>
              ) : documents.length === 0 ? (
                <div className="dash-docs__empty">No documents uploaded yet.</div>
              ) : (
                documents.map(doc => (
                  <div key={doc.id} className="dash-doc" id={`doc-${doc.id}`}>
                    <div className="dash-doc__icon">
                      <FileText size={20} />
                    </div>
                    <div className="dash-doc__info">
                      <span className="dash-doc__name">{doc.name}</span>
                      <span className="dash-doc__meta">{doc.size} · {new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className={`dash-doc__status dash-doc__status--${doc.status || 'ready'}`}>
                      {doc.status === 'processing' ? (
                        <><div className="dash-doc__spinner"></div> Processing</>
                      ) : (
                        <><CheckCircle2 size={14} /> Ready</>
                      )}
                    </div>
                    <div className="dash-doc__actions">
                      <button className="dash-doc__btn" title="View"><Eye size={16} /></button>
                      <button className="dash-doc__btn" title="Download"><Download size={16} /></button>
                      <button className="dash-doc__btn dash-doc__btn--danger" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )

      case 'chat':
        return (
          <div className="dash-content dash-content--chat">
            <div className="dash-content__header">
              <h2>AI Chat</h2>
              <span className="dash-content__badge"><Bot size={14} /> Gemini 1.5 Flash</span>
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
                        if (line === '') return <br key={j} />
                        return <p key={j}>{line}</p>
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

              <div className="dash-chat__input-area">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask anything about your documents..."
                  className="dash-chat__input"
                />
                <button
                  className="dash-chat__send"
                  onClick={() => sendMessage()}
                  disabled={!chatInput.trim() || isTyping}
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
      <aside className={`dash-sidebar ${sidebarOpen ? '' : 'dash-sidebar--collapsed'}`} id="sidebar">
        <div className="dash-sidebar__header">
          <Link to="/" className="dash-sidebar__logo">
            <div className="dash-sidebar__logo-icon"><BookOpen size={20} /></div>
            {sidebarOpen && <span>Study<span className="text-gradient">AI</span></span>}
          </Link>
          <button className="dash-sidebar__toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="dash-sidebar__nav">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              className={`dash-sidebar__item ${activeTab === item.key ? 'dash-sidebar__item--active' : ''}`}
              onClick={() => setActiveTab(item.key)}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="dash-sidebar__footer">
          <Link to="/" className="dash-sidebar__item">
            <LogOut size={20} />
            {sidebarOpen && <span>Log Out</span>}
          </Link>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-topbar">
          <button className="dash-topbar__menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
          <div className="dash-topbar__search">
            <Search size={18} />
            <input type="text" placeholder="Search documents..." />
          </div>
          <div className="dash-topbar__actions">
            <div className="dash-topbar__user">
              <div className="dash-topbar__avatar">JD</div>
              <span className="dash-topbar__name">John Doe</span>
            </div>
          </div>
        </header>

        <div className="dash-body">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
