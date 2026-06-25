import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle, BookOpen, BarChart2 } from 'lucide-react';
import { ChatMessage } from './ChatWindow';

interface StudyPlannerProps {
  messages: ChatMessage[];
}

interface PlanItem {
  id: string;
  text: string;
  checked: boolean;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({ messages }) => {
  const [items, setItems] = useState<PlanItem[]>([]);
  const [title, setTitle] = useState('My Personalized Study Plan');

  // Parse latest message for study plan items
  useEffect(() => {
    const assistantMessages = messages.filter((m) => m.role === 'assistant');
    if (assistantMessages.length === 0) return;

    const latest = assistantMessages[assistantMessages.length - 1];
    const text = latest.text;

    // Check if there are checklist items: - [ ] or - [x]
    const checklistRegex = /^-\s\[([ xX])\]\s(.*)$/gm;
    const matches = [...text.matchAll(checklistRegex)];

    if (matches.length > 0) {
      const parsedItems = matches.map((m, idx) => ({
        id: `plan-${idx}-${m[2].substring(0, 10)}`,
        text: m[2],
        checked: m[1] === 'x' || m[1] === 'X',
      }));
      setItems(parsedItems);

      // Attempt to extract a title (first heading in message)
      const titleMatch = text.match(/^#+\s(.*)$/m);
      if (titleMatch) {
        setTitle(titleMatch[1]);
      } else {
        setTitle('Custom Personalized Study Plan');
      }
    }
  }, [messages]);

  // Fallback default plans if none are parsed yet
  useEffect(() => {
    if (items.length === 0) {
      setItems([
        { id: 'def-1', text: 'Day 1: Setup developer environment and create React-Vite project skeleton', checked: true },
        { id: 'def-2', text: 'Day 2: Build atomic UI components (Button, Input) and styles in Vanilla CSS', checked: false },
        { id: 'def-3', text: 'Day 3: Write Agent orchestrator logic & register MCP Tools', checked: false },
        { id: 'def-4', text: 'Day 4: Integrate Model Context Protocol server via JSON-RPC SSE/HTTP', checked: false },
        { id: 'def-5', text: 'Day 5: Conduct end-to-end flow debugging and run local performance benchmarks', checked: false },
      ]);
      setTitle('Default Bootcamp Roadmap');
    }
  }, [items.length]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const completedCount = items.filter((i) => i.checked).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="panel-container" style={{ height: '100%' }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar style={{ color: 'rgb(99, 102, 241)' }} />
          <h3>Study Planner & tracker</h3>
        </div>
        <span className="badge badge-learning" style={{ background: 'rgba(99,102,241,0.2)' }}>
          {progressPercent}% Done
        </span>
      </div>

      <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Progress Card */}
        <div
          className="glass-panel"
          style={{
            padding: '1rem',
            background: 'rgba(255,255,255,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <BarChart2 size={14} /> Overall Progress
            </span>
            <span style={{ fontWeight: 600 }}>
              {completedCount} / {items.length} tasks completed
            </span>
          </div>

          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, rgb(99, 102, 241) 0%, rgb(14, 165, 233) 100%)',
                borderRadius: '4px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Plan Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.25rem' }}>{title}</h4>
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="glass-panel"
              style={{
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                background: item.checked ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.01)',
                borderColor: item.checked ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-color)',
                transition: 'all 0.2s ease',
              }}
            >
              {item.checked ? (
                <CheckCircle2 size={18} style={{ color: 'rgb(52, 211, 153)', flexShrink: 0 }} />
              ) : (
                <Circle size={18} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
              )}
              <span
                style={{
                  fontSize: '0.85rem',
                  textDecoration: item.checked ? 'line-through' : 'none',
                  color: item.checked ? 'var(--text-secondary)' : '#ffffff',
                }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Reference Advice */}
        <div
          style={{
            marginTop: 'auto',
            padding: '0.85rem',
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px dashed rgba(99, 102, 241, 0.2)',
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <BookOpen size={16} style={{ color: 'rgb(99, 102, 241)', flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 600, color: 'white', display: 'block', marginBottom: '0.15rem' }}>
              Pro Tip: How to update?
            </span>
            Ask the Chat Agent: <em>"Create a study plan for learning [subject]"</em>. It will parse and load as an interactive schedule here automatically!
          </div>
        </div>
      </div>
    </div>
  );
};
