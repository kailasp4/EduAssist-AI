import React, { useState } from 'react';
import { createHeaders } from '../lib/httpHeaders';
import { FileText, Brain, RefreshCw, CheckCircle, Search, BookOpen } from 'lucide-react';

interface AnalysisResult {
  summary: string;
  keyConceptsIdentified: string[];
  weaknessesOrGaps: string[];
  recommendations: string[];
}

export const DocAnalyzer: React.FC = () => {
  const [content, setContent] = useState('');
  const [focusArea, setFocusArea] = useState('general');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please paste or write some content to analyze.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:3001/api/mcp/call', {
        method: 'POST',
        headers: createHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          toolName: 'document_analysis',
          arguments: {
            content,
            focusArea,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze document');
      }

      const rawResult = await response.json();
      const text = rawResult.content?.[0]?.text;
      if (!text) {
        throw new Error('No analysis content returned');
      }

      const parsedResult = JSON.parse(text) as AnalysisResult;
      setResult(parsedResult);
    } catch (err: any) {
      setError(err.message || 'Error communicating with MCP Server');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleNotes = () => {
    setContent(`
Study Notes: JavaScript Async Functions & Promises

1. Promises:
Represent the eventual completion or failure of an asynchronous operation.
States: Pending, Fulfilled, Rejected.
We use .then() for success and .catch() for errors.

2. Async/Await:
It makes asynchronous code look like synchronous code.
We write 'async' in front of a function declaration.
Inside it, we use 'await' before a promise call.
BUT I am not sure how error handling works here. I think we just let errors bubble up, or maybe we use .catch() at the end? Also, what is event loop?
    `);
    setFocusArea('Identify logical gaps and explain error handling');
  };

  return (
    <div className="panel-container" style={{ height: '100%' }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText style={{ color: 'rgb(245, 158, 11)' }} />
          <h3>MCP Note Analyzer</h3>
        </div>
        <span className="badge badge-career" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'rgb(245, 158, 11)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          Document Analysis
        </span>
      </div>

      <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Editor Form */}
        {!result && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Paste your class notes or essay to verify conceptual correctness and get constructive feedback.
              </p>
              <button
                onClick={loadSampleNotes}
                className="btn btn-secondary"
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
              >
                Load Sample
              </button>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field"
              placeholder="Paste your study notes or essay draft here..."
              style={{ minHeight: '180px', resize: 'vertical', fontSize: '0.85rem' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Focus Area / Prompt</label>
              <input
                type="text"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="input-field"
                placeholder="e.g. grammar review, explain gaps, check logic..."
              />
            </div>

            {error && <div style={{ color: '#f87171', fontSize: '0.8rem' }}>{error}</div>}

            <button onClick={handleAnalyze} className="btn btn-primary">
              <Brain size={16} /> Analyze Notes via MCP Server
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
            <RefreshCw size={32} className="animate-spin" style={{ color: 'rgb(245, 158, 11)', margin: '0 auto 1rem auto' }} />
            <h4>Running Document Analysis</h4>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
              MCP server is evaluating your notes and compiling recommendations...
            </p>
          </div>
        )}

        {/* Analysis Result */}
        {result && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-slide-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ color: 'white' }}>Analysis Report</h4>
              <button
                onClick={() => setResult(null)}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
              >
                Analyze New Notes
              </button>
            </div>

            {/* Summary */}
            <div className="glass-panel" style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)' }}>
              <strong style={{ color: 'white', display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Summary</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{result.summary}</p>
            </div>

            {/* Grid for Concepts / Gaps */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {/* Concepts */}
              <div className="glass-panel" style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.01)' }}>
                <strong style={{ color: 'rgb(52, 211, 153)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <CheckCircle size={14} /> Identified Concepts
                </strong>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {result.keyConceptsIdentified?.map((concept: string, idx: number) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{concept}</li>
                  ))}
                </ul>
              </div>

              {/* Gaps */}
              <div className="glass-panel" style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.01)', borderLeft: '3px solid rgb(239, 68, 68)' }}>
                <strong style={{ color: 'rgb(248, 113, 113)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <Search size={14} /> Missing Gaps / Weaknesses
                </strong>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {result.weaknessesOrGaps?.map((gap: string, idx: number) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{gap}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass-panel" style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.01)', borderLeft: '3px solid rgb(245, 158, 11)' }}>
              <strong style={{ color: 'rgb(251, 191, 36)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <BookOpen size={14} /> Actionable Recommendations
              </strong>
              <ul style={{ paddingLeft: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {result.recommendations?.map((rec, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
