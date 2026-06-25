import React, { useState } from 'react';
import { Briefcase, BookOpen, Star, Shield, Cpu, ChevronRight, Search, Loader2 } from 'lucide-react';
import { createHeaders } from '../lib/httpHeaders';

interface SkillNode {
  name: string;
  type: 'language' | 'framework' | 'tool' | 'concept';
  status: 'mandatory' | 'recommended' | 'optional';
}

interface CareerRoadmap {
  role: string;
  salary: string;
  description: string;
  stages: {
    title: string;
    skills: SkillNode[];
  }[];
}

export const CareerPath: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'frontend' | 'datascience' | 'devops' | 'custom'>('frontend');
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customRoadmap, setCustomRoadmap] = useState<CareerRoadmap | null>(null);

  const roadmaps: Record<'frontend' | 'datascience' | 'devops', CareerRoadmap> = {
    frontend: {
      role: 'Frontend Engineer',
      salary: '$85,000 - $130,000',
      description: 'Responsible for building client-facing web application interfaces. Focuses on responsiveness, usability, and smooth visual performance.',
      stages: [
        {
          title: 'Stage 1: Core Fundamentals',
          skills: [
            { name: 'HTML5 Semantic markup', type: 'concept', status: 'mandatory' },
            { name: 'CSS3 (Flexbox/Grid)', type: 'language', status: 'mandatory' },
            { name: 'JavaScript ES6+', type: 'language', status: 'mandatory' }
          ]
        },
        {
          title: 'Stage 2: Modern Frameworks & Bundlers',
          skills: [
            { name: 'React.js & State Management', type: 'framework', status: 'mandatory' },
            { name: 'TypeScript', type: 'language', status: 'recommended' },
            { name: 'Vite & ESBuild', type: 'tool', status: 'recommended' }
          ]
        },
        {
          title: 'Stage 3: Advanced Skills',
          skills: [
            { name: 'Next.js (Server Components)', type: 'framework', status: 'recommended' },
            { name: 'Performance Optimization', type: 'concept', status: 'recommended' },
            { name: 'E2E Testing (Playwright)', type: 'tool', status: 'optional' }
          ]
        }
      ]
    },
    datascience: {
      role: 'Data Scientist',
      salary: '$95,000 - $145,000',
      description: 'Extracts value from data. Uses mathematics, statistics, and machine learning models to solve business challenges.',
      stages: [
        {
          title: 'Stage 1: Math & Scripting Core',
          skills: [
            { name: 'Python (Pandas / NumPy)', type: 'language', status: 'mandatory' },
            { name: 'SQL & Database Queries', type: 'language', status: 'mandatory' },
            { name: 'Probability & Statistics', type: 'concept', status: 'mandatory' }
          ]
        },
        {
          title: 'Stage 2: Machine Learning Foundations',
          skills: [
            { name: 'Scikit-Learn models', type: 'framework', status: 'mandatory' },
            { name: 'Regression & Classification', type: 'concept', status: 'mandatory' },
            { name: 'Data Visualization (Seaborn)', type: 'tool', status: 'recommended' }
          ]
        },
        {
          title: 'Stage 3: Deep Learning & AI Systems',
          skills: [
            { name: 'TensorFlow or PyTorch', type: 'framework', status: 'recommended' },
            { name: 'Neural Networks (CNN/RNN)', type: 'concept', status: 'recommended' },
            { name: 'LLM Fine-tuning & APIs', type: 'concept', status: 'optional' }
          ]
        }
      ]
    },
    devops: {
      role: 'DevOps / Site Reliability Engineer',
      salary: '$100,000 - $160,000',
      description: 'Bridges software development and systems operations. Automates deployments, manages cloud infrastructure, and monitors reliability.',
      stages: [
        {
          title: 'Stage 1: System Foundations',
          skills: [
            { name: 'Linux Command Line / Bash', type: 'concept', status: 'mandatory' },
            { name: 'Git & Version Control', type: 'tool', status: 'mandatory' },
            { name: 'Networking Basics (DNS, HTTP)', type: 'concept', status: 'mandatory' }
          ]
        },
        {
          title: 'Stage 2: Containers & Automation',
          skills: [
            { name: 'Docker Containerization', type: 'tool', status: 'mandatory' },
            { name: 'GitHub Actions / CI Pipelines', type: 'tool', status: 'recommended' },
            { name: 'Cloud Basics (AWS or GCP)', type: 'concept', status: 'recommended' }
          ]
        },
        {
          title: 'Stage 3: Scale & Infrastructure',
          skills: [
            { name: 'Kubernetes Orchestration', type: 'tool', status: 'mandatory' },
            { name: 'Terraform (Infrastructure as Code)', type: 'tool', status: 'recommended' },
            { name: 'Prometheus & Grafana logging', type: 'tool', status: 'optional' }
          ]
        }
      ]
    }
  };

  const handleGenerateCustomPath = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customRoleInput.trim()) {
      setError('Please enter a role or technology name.');
      return;
    }

    setLoading(true);
    setError('');
    setSelectedRole('custom');

    try {
      const response = await fetch('http://localhost:3001/api/mcp/call', {
        method: 'POST',
        headers: createHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          toolName: 'career_navigator',
          arguments: {
            role: customRoleInput.trim(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate career pathway');
      }

      const rawResult = await response.json();
      const text = rawResult.content?.[0]?.text;
      if (!text) {
        throw new Error('No career pathway content returned');
      }

      const roadmapData = JSON.parse(text) as CareerRoadmap;
      setCustomRoadmap(roadmapData);
    } catch (err: any) {
      setError(err.message || 'Error communicating with MCP Server');
    } finally {
      setLoading(false);
    }
  };

  const currentRoadmap = selectedRole === 'custom' ? customRoadmap : roadmaps[selectedRole];

  return (
    <div className="panel-container" style={{ height: '100%' }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase style={{ color: 'rgb(14, 165, 233)' }} />
          <h3>Career Pathway Navigator</h3>
        </div>
        <span className="badge badge-career">Career Guidance</span>
      </div>

      <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Custom Role Input Form */}
        <form onSubmit={handleGenerateCustomPath} style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              value={customRoleInput}
              onChange={(e) => setCustomRoleInput(e.target.value)}
              placeholder="Enter any technology or career role..."
              className="input-field"
              style={{ paddingLeft: '2.25rem', fontSize: '0.8rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {loading && selectedRole === 'custom' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              'Navigate'
            )}
          </button>
        </form>

        {/* Preset Toggles */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '0.5rem',
            background: 'rgba(0,0,0,0.2)',
            padding: '0.25rem',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
          }}
        >
          <button
            onClick={() => setSelectedRole('frontend')}
            className={`tab-btn ${selectedRole === 'frontend' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '0.4rem', fontSize: '0.75rem' }}
          >
            <Cpu size={12} /> Frontend
          </button>
          <button
            onClick={() => setSelectedRole('datascience')}
            className={`tab-btn ${selectedRole === 'datascience' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '0.4rem', fontSize: '0.75rem' }}
          >
            <Star size={12} /> Data Science
          </button>
          <button
            onClick={() => setSelectedRole('devops')}
            className={`tab-btn ${selectedRole === 'devops' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '0.4rem', fontSize: '0.75rem' }}
          >
            <Shield size={12} /> DevOps
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: 'rgb(14, 165, 233)', margin: '0 auto 1rem auto' }} />
            <h4>Mapping Career Pathway</h4>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
              MCP server is analyzing market trends and compiling skill recommendations...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ color: '#f87171', fontSize: '0.8rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        {/* Roadmap Display */}
        {currentRoadmap && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Role Overview */}
            <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ color: 'white', fontSize: '0.9rem' }}>{currentRoadmap.role}</h4>
                <span style={{ fontSize: '0.8rem', color: 'rgb(56, 189, 248)', fontWeight: 600 }}>{currentRoadmap.salary}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{currentRoadmap.description}</p>
            </div>

            {/* Stages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentRoadmap.stages?.map((stage, sidx) => (
                <div
                  key={sidx}
                  className="glass-panel animate-slide-in"
                  style={{
                    padding: '0.85rem 1rem',
                    borderLeft: '3px solid rgb(14, 165, 233)',
                    background: 'rgba(255,255,255,0.01)',
                  }}
                >
                  <h5 style={{ fontSize: '0.85rem', color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ChevronRight size={14} style={{ color: 'rgb(14, 165, 233)' }} />
                    {stage.title}
                  </h5>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {stage.skills?.map((skill, skidx) => (
                      <span
                        key={skidx}
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          background: 'rgba(0, 0, 0, 0.25)',
                          border: `1px solid ${
                            skill.status === 'mandatory'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : skill.status === 'recommended'
                              ? 'rgba(14, 165, 233, 0.2)'
                              : 'var(--border-color)'
                          }`,
                          color:
                            skill.status === 'mandatory'
                              ? '#fca5a5'
                              : skill.status === 'recommended'
                              ? '#7dd3fc'
                              : 'var(--text-secondary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advice Panel */}
        <div
          style={{
            padding: '0.85rem',
            background: 'rgba(14, 165, 233, 0.05)',
            border: '1px dashed rgba(14, 165, 233, 0.2)',
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            gap: '0.5rem',
            marginTop: 'auto',
          }}
        >
          <BookOpen size={16} style={{ color: 'rgb(14, 165, 233)', flexShrink: 0 }} />
          <div>
            Ask the Chat Agent: <em>"Analyze my skills for a junior Backend Developer role"</em>. It will run the Career Agent to perform a custom skill gap evaluation!
          </div>
        </div>
      </div>
    </div>
  );
};
