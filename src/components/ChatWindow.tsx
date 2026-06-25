import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Terminal, ChevronDown, ChevronUp, CheckCircle, Play, AlertCircle } from 'lucide-react';

export interface AgentStep {
  agentName: string;
  type: 'thought' | 'tool_call' | 'tool_response' | 'text' | 'error';
  message: string;
  details?: any;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  steps?: AgentStep[];
}

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  loading: boolean;
  suggestions: string[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  loading,
  suggestions,
}) => {
  const [input, setInput] = useState('');
  const [showTrace, setShowTrace] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelBodyRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const toggleTrace = (msgId: string) => {
    setShowTrace((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  useEffect(() => {
    if (panelBodyRef.current) {
      panelBodyRef.current.scrollTo({
        top: panelBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, loading]);

  const renderBadge = (agentName: string) => {
    const name = agentName.toLowerCase();
    if (name.includes('coordinator')) return <span className="badge badge-coordinator">Coordinator</span>;
    if (name.includes('learning')) return <span className="badge badge-learning">Learning Agent</span>;
    if (name.includes('assessment')) return <span className="badge badge-assessment">Assessment Agent</span>;
    if (name.includes('career')) return <span className="badge badge-career">Career Agent</span>;
    return <span className="badge badge-secondary">{agentName}</span>;
  };

  const renderStepIcon = (type: AgentStep['type']) => {
    switch (type) {
      case 'thought':
        return <Bot size={14} className="text-indigo-400" style={{ color: '#818cf8' }} />;
      case 'tool_call':
        return <Play size={14} className="text-yellow-400 animate-pulse" style={{ color: '#facc15' }} />;
      case 'tool_response':
        return <CheckCircle size={14} className="text-emerald-400" style={{ color: '#34d399' }} />;
      case 'error':
        return <AlertCircle size={14} className="text-rose-400" style={{ color: '#f87171' }} />;
      default:
        return <Sparkles size={14} className="text-sky-400" style={{ color: '#38bdf8' }} />;
    }
  };

  // Render inline markdown: **bold**, *italic*, `code`, ---
  const renderInline = (text: string): React.ReactNode => {
    // Split by inline patterns, preserving delimiters
    const parts: React.ReactNode[] = [];
    // Pattern: **bold**, *italic*, `code`
    const inlineRegex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
    let lastIndex = 0;
    let match;

    while ((match = inlineRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[2] !== undefined) {
        parts.push(<strong key={match.index}>{match[2]}</strong>);
      } else if (match[3] !== undefined) {
        parts.push(<em key={match.index}>{match[3]}</em>);
      } else if (match[4] !== undefined) {
        parts.push(<code key={match.index}>{match[4]}</code>);
      }
      lastIndex = inlineRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts.length > 0 ? <>{parts}</> : text;
  };

  const renderMarkdown = (text: string) => {
    // Basic parser for common markdown elements
    const lines = text.split('\n');
    let inTable = false;

    const htmlElements = lines.map((line, idx) => {
      // Horizontal rule
      if (/^---+$/.test(line.trim())) return <hr key={idx} style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />;

      // Headers
      if (line.startsWith('# ')) return <h1 key={idx}>{renderInline(line.substring(2))}</h1>;
      if (line.startsWith('## ')) return <h2 key={idx}>{renderInline(line.substring(3))}</h2>;
      if (line.startsWith('### ')) return <h3 key={idx}>{renderInline(line.substring(4))}</h3>;

      // Tables (very simple parse)
      if (line.startsWith('|') && line.includes('-|-')) {
        inTable = true;
        return null; // Skip table header separator
      }
      if (line.startsWith('|')) {
        const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
        const isHeader = !inTable && idx > 0 && lines[idx - 1] === '';
        
        return (
          <tr key={idx} style={{ background: isHeader ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
            {cells.map((cell, cidx) => (
              <td key={cidx} style={{ padding: '0.4rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                {renderInline(cell)}
              </td>
            ))}
          </tr>
        );
      }

      // Checklists & Bullet lists
      if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
        const checked = line.startsWith('- [x] ');
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
            <input type="checkbox" checked={checked} readOnly style={{ accentColor: '#4f46e5' }} />
            <span>{renderInline(line.substring(6))}</span>
          </div>
        );
      }

      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={idx}>{renderInline(line.substring(2))}</li>;
      }

      if (/^\d+\.\s/.test(line)) {
        return <li key={idx} style={{ listStyleType: 'decimal' }}>{renderInline(line.replace(/^\d+\.\s/, ''))}</li>;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        return <blockquote key={idx}>{renderInline(line.substring(2))}</blockquote>;
      }

      // Empty space
      if (!line.trim()) return <div key={idx} style={{ height: '0.5rem' }} />;

      // Normal paragraph
      return <p key={idx}>{renderInline(line)}</p>;
    });

    return <div className="markdown-content">{htmlElements}</div>;
  };

  return (
    <div className="panel-container glass-panel" style={{ height: '100%', minHeight: 0 }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bot style={{ color: 'rgb(250, 204, 21)' }} />
          <h3>Personal Learning Assistant</h3>
        </div>
        <span className="badge badge-coordinator">Active Session</span>
      </div>

      <div
        ref={panelBodyRef}
        className="panel-body"
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
            <Bot size={48} style={{ color: 'rgb(99, 102, 241)', marginBottom: '1rem', opacity: 0.8 }} />
            <h4>Welcome to EduAssist AI!</h4>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Your personalized multi-agent support network. Ask questions, build study plans, practice with quizzes, or map your career path.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(s)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                  disabled={loading}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`animate-slide-in`}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
              }}
            >
              {msg.role === 'user' ? (
                <>
                  <span>You</span>
                  <User size={12} />
                </>
              ) : (
                <>
                  <Bot size={12} style={{ color: 'rgb(250, 204, 21)' }} />
                  <span>EduAssist Agent</span>
                </>
              )}
            </div>

            <div
              style={{
                padding: '0.85rem 1.1rem',
                borderRadius: '12px',
                background: msg.role === 'user' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)',
                border: msg.role === 'user' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border-color)',
                fontSize: '0.9rem',
              }}
            >
              {msg.role === 'user' ? msg.text : renderMarkdown(msg.text)}
            </div>

            {/* Trace Log Expander (for Assistant messages containing steps) */}
            {msg.role === 'assistant' && msg.steps && msg.steps.length > 0 && (
              <div
                style={{
                  marginTop: '0.25rem',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  borderRadius: '8px',
                  background: 'rgba(10, 10, 20, 0.4)',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => toggleTrace(msg.id)}
                  style={{
                    width: '100%',
                    padding: '0.4rem 0.75rem',
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: 'none',
                    color: 'rgb(129, 140, 248)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Terminal size={12} />
                    ADK Multi-Agent Execution Trace ({msg.steps.length} steps)
                  </span>
                  {showTrace[msg.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                {showTrace[msg.id] && (
                  <div
                    style={{
                      padding: '0.6rem 0.85rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      borderTop: '1px solid rgba(99, 102, 241, 0.1)',
                    }}
                  >
                    {msg.steps.map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <div style={{ marginTop: '0.15rem' }}>{renderStepIcon(step.type)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {renderBadge(step.agentName)}
                            <span style={{ color: 'var(--text-muted)' }}>{step.timestamp}</span>
                          </div>
                          <div style={{ color: step.type === 'error' ? '#f87171' : 'var(--text-primary)', marginTop: '0.15rem' }}>
                            {step.message}
                          </div>
                          {step.details && (
                            <pre
                              style={{
                                background: 'rgba(0,0,0,0.5)',
                                padding: '0.4rem',
                                borderRadius: '4px',
                                marginTop: '0.25rem',
                                color: '#a5f3fc',
                                fontSize: '0.7rem',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-all',
                                border: '1px solid rgba(255,255,255,0.04)',
                              }}
                            >
                              {JSON.stringify(step.details, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div
            style={{
              alignSelf: 'flex-start',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Bot size={12} style={{ color: 'rgb(250, 204, 21)' }} />
              <span>Orchestrating Agents...</span>
            </div>
            <div
              className="glass-panel pulse-glow"
              style={{
                padding: '0.85rem 1.1rem',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'rgb(99, 102, 241)',
                  animation: 'ping 1s infinite',
                }}
              />
              Thinking and invoking tools via MCP server...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question, request a quiz or study plan..."
          className="input-field"
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
