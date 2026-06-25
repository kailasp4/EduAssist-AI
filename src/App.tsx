import { useState, useEffect } from 'react';
import { ChatWindow, ChatMessage } from './components/ChatWindow';
import { StudyPlanner } from './components/StudyPlanner';
import { QuizWidget } from './components/QuizWidget';
import { CareerPath } from './components/CareerPath';
import { DocAnalyzer } from './components/DocAnalyzer';
import { McpLogs } from './components/McpLogs';
import { ShieldAlert, Cpu, CheckCircle } from 'lucide-react';
import logoImg from './assets/logo.png';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'planner' | 'quiz' | 'career' | 'analyzer' | 'mcp'>('planner');
  const [backendStatus, setBackendStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  const suggestions = [
    'Create a 3-day study plan to learn CSS Flexbox and Grid.',
    'Test my knowledge on Python loops and lists with a quiz.',
    'Explain how the JavaScript Event Loop works.',
    'What skills do I need to become a Cybersecurity Analyst?'
  ];

  // Ping backend to check status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/mcp/tools');
        if (res.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      } catch {
        setBackendStatus('error');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (text: string) => {
    // 1. Add user message
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // 2. Prepare history for Gemini API format:
      // We map the last 8 messages to the role/parts format
      const history = messages.slice(-8).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      // 3. POST request to Coordinator API
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server responded with an error');
      }

      const data = await response.json();

      // 4. Add assistant response
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        text: data.content,
        steps: data.steps,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // If the message contains a checklist, auto-switch to Study Planner tab
      if (data.content.includes('- [ ]') || data.content.includes('- [x]')) {
        setActiveTab('planner');
      }
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        text: `Error connecting to EduAssist Coordinator: ${error.message || 'Please verify the backend server is running.'}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src={logoImg}
            alt="EduAssist-AI Logo"
            style={{
              height: '42px',
              width: '42px',
              objectFit: 'contain',
              flexShrink: 0,
              filter: 'drop-shadow(0 2px 8px rgba(99, 102, 241, 0.25))',
            }}
          />
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              EduAssist <span className="gradient-text">AI</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              AI-Powered Multi-Agent Personalized Learning Support
            </p>
          </div>
        </div>

        {/* Backend & Agent Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              background: 'rgba(255,255,255,0.03)',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
            }}
          >
            <Cpu size={12} style={{ color: '#818cf8' }} />
            <span style={{ color: 'var(--text-secondary)' }}>ADK Layer:</span>
            <span style={{ color: '#34d399', fontWeight: 600 }}>Active</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              background: 'rgba(255,255,255,0.03)',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
            }}
          >
            {backendStatus === 'connected' ? (
              <>
                <CheckCircle size={12} style={{ color: 'rgb(52, 211, 153)' }} />
                <span style={{ color: 'rgb(52, 211, 153)', fontWeight: 600 }}>MCP Connected</span>
              </>
            ) : backendStatus === 'connecting' ? (
              <>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgb(245, 158, 11)', animation: 'pulse 1s infinite' }} />
                <span style={{ color: 'rgb(245, 158, 11)' }}>Connecting Backend...</span>
              </>
            ) : (
              <>
                <ShieldAlert size={12} style={{ color: 'rgb(248, 113, 113)' }} />
                <span style={{ color: 'rgb(248, 113, 113)', fontWeight: 600 }}>Backend Offline</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="dashboard-grid">
        {/* Left Side: Agent Interaction Chat */}
        <div style={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loading}
            suggestions={suggestions}
          />
        </div>

        {/* Right Side: Interactive Widgets & Inspector Tabs */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
          <div className="panel-header" style={{ padding: '0.75rem 1.25rem', background: 'rgba(0, 0, 0, 0.15)' }}>
            <div className="tab-list">
              <button
                onClick={() => setActiveTab('planner')}
                className={`tab-btn ${activeTab === 'planner' ? 'active' : ''}`}
              >
                Study Planner
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
              >
                Practice Quizzes
              </button>
              <button
                onClick={() => setActiveTab('career')}
                className={`tab-btn ${activeTab === 'career' ? 'active' : ''}`}
              >
                Career Path
              </button>
              <button
                onClick={() => setActiveTab('analyzer')}
                className={`tab-btn ${activeTab === 'analyzer' ? 'active' : ''}`}
              >
                Note Analyzer
              </button>
              <button
                onClick={() => setActiveTab('mcp')}
                className={`tab-btn ${activeTab === 'mcp' ? 'active' : ''}`}
              >
                MCP Inspector
              </button>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {activeTab === 'planner' && <StudyPlanner messages={messages} />}
            {activeTab === 'quiz' && <QuizWidget />}
            {activeTab === 'career' && <CareerPath />}
            {activeTab === 'analyzer' && <DocAnalyzer />}
            {activeTab === 'mcp' && <McpLogs />}
          </div>
        </div>
      </main>
    </div>
  );
}
