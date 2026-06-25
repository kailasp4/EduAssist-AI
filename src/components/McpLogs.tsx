import React, { useEffect, useState } from 'react';
import { Terminal, RefreshCw, ChevronRight, ChevronDown, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { McpLog } from '../lib/mcp/server';

export const McpLogs: React.FC = () => {
  const [logs, setLogs] = useState<McpLog[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [polling, setPolling] = useState(true);

  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/mcp/logs');
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error('Error fetching MCP logs:', e);
    }
  };

  useEffect(() => {
    fetchLogs();
    if (!polling) return;

    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, [polling]);

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="panel-container" style={{ height: '100%' }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal style={{ color: 'rgb(99, 102, 241)' }} />
          <h3>MCP Protocol Inspector</h3>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={polling}
              onChange={(e) => setPolling(e.target.checked)}
              style={{ accentColor: '#4f46e5' }}
            />
            Live
          </label>
          <button
            onClick={fetchLogs}
            className="btn btn-secondary"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
          >
            <RefreshCw size={10} />
          </button>
        </div>
      </div>

      <div className="panel-body" style={{ background: '#07070c', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', marginBottom: '0.5rem' }}>
          Real-time Model Context Protocol JSON-RPC packets traversing the agent connection layer.
        </p>

        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            No JSON-RPC transmissions captured yet.
            <br />
            Ask a chat question or run a widget to trigger tools!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto', flex: 1 }}>
            {logs.slice().reverse().map((log) => {
              const isExpanded = expandedLogId === log.id;
              const isIn = log.direction === 'in';

              return (
                <div
                  key={log.id}
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    background: isIn ? 'rgba(99, 102, 241, 0.02)' : 'rgba(16, 185, 129, 0.02)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Header Row */}
                  <div
                    onClick={() => toggleExpand(log.id)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      userSelect: 'none',
                    }}
                  >
                    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, color: isIn ? '#818cf8' : '#34d399' }}>
                      {isIn ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                      {isIn ? 'REQUEST' : 'RESPONSE'}
                    </span>

                    <span style={{ color: 'white', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.message}
                    </span>

                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Details Body */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: '0.75rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                        background: '#040408',
                      }}
                    >
                      <pre
                        style={{
                          margin: 0,
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          color: '#a5f3fc',
                          overflowX: 'auto',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                        }}
                      >
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
