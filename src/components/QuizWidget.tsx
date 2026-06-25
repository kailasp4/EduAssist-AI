import React, { useState } from 'react';
import { HelpCircle, Award, Check, X, Sparkles, RefreshCw } from 'lucide-react';
import { createHeaders } from '../lib/httpHeaders';

// (rest of imports remain unchanged)

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface QuizData {
  quizTitle: string;
  questions: Question[];
}

export const QuizWidget: React.FC = () => {
  const [subject, setSubject] = useState('React Hooks');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState(3);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const generateQuiz = async () => {
    setLoading(true);
    setError('');
    setQuiz(null);
    setSelectedAnswers({});
    setSubmitted(false);

    try {
      const response = await fetch('http://localhost:3001/api/mcp/call', {
        method: 'POST',
        headers: createHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          toolName: 'quiz_generator',
          arguments: {
            subject,
            difficulty,
            numQuestions,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const rawResult = await response.json();
      // Express backend returns the content block containing stringified JSON
      const text = rawResult.content?.[0]?.text;
      if (!text) {
        throw new Error('No quiz content returned');
      }

      const quizData = JSON.parse(text) as QuizData;
      setQuiz(quizData);
    } catch (err: any) {
      setError(err.message || 'Error communicating with MCP Server');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (qId: number, oIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: oIdx }));
  };

  const handleSubmitQuiz = () => {
    if (quiz && Object.keys(selectedAnswers).length < quiz.questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }
    setSubmitted(true);
    setError('');
  };

  const getScore = () => {
    if (!quiz) return 0;
    let score = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="panel-container" style={{ height: '100%' }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle style={{ color: 'rgb(16, 185, 129)' }} />
          <h3>MCP Quiz Generator</h3>
        </div>
        <span className="badge badge-assessment">Testing Center</span>
      </div>

      <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Setup Quiz form if no quiz is loaded */}
        {!quiz && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Choose a topic, choose a difficulty level, and invoke the MCP Server Quiz Generator to assess your knowledge.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Quiz Subject / Topic</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-field"
                placeholder="e.g. JavaScript Closures, Physics Gravity..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="input-field"
                  style={{ background: '#0a0a0f' }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Questions</label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="input-field"
                  style={{ background: '#0a0a0f' }}
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                </select>
              </div>
            </div>

            {error && <div style={{ color: '#f87171', fontSize: '0.8rem' }}>{error}</div>}

            <button onClick={generateQuiz} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Sparkles size={16} /> Generate Quiz via MCP Server
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
            <RefreshCw size={32} className="animate-spin" style={{ color: 'rgb(16, 185, 129)', margin: '0 auto 1rem auto' }} />
            <h4>Invoking Quiz Generator Tool</h4>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
              MCP Server is synthesizing quiz questions using Gemini API...
            </p>
          </div>
        )}

        {/* Active Quiz */}
        {quiz && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ color: 'white' }}>{quiz.quizTitle}</h4>
              {!submitted && (
                <button
                  onClick={() => setQuiz(null)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                >
                  Reset
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {quiz.questions.map((q, qidx) => (
                <div
                  key={q.id}
                  className="glass-panel animate-slide-in"
                  style={{
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.01)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Question {qidx + 1} of {quiz.questions.length}
                  </span>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{q.questionText}</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {q.options.map((option, oIdx) => {
                      const isSelected = selectedAnswers[q.id] === oIdx;
                      const isCorrect = q.correctAnswerIndex === oIdx;
                      
                      let optionBg = 'rgba(255, 255, 255, 0.02)';
                      let optionBorder = 'var(--border-color)';
                      
                      if (submitted) {
                        if (isCorrect) {
                          optionBg = 'rgba(16, 185, 129, 0.1)';
                          optionBorder = 'rgba(16, 185, 129, 0.4)';
                        } else if (isSelected && !isCorrect) {
                          optionBg = 'rgba(239, 68, 68, 0.1)';
                          optionBorder = 'rgba(239, 68, 68, 0.4)';
                        }
                      } else if (isSelected) {
                        optionBg = 'rgba(99, 102, 241, 0.15)';
                        optionBorder = 'rgba(99, 102, 241, 0.4)';
                      }

                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleSelectAnswer(q.id, oIdx)}
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            background: optionBg,
                            border: `1px solid ${optionBorder}`,
                            cursor: submitted ? 'default' : 'pointer',
                            fontSize: '0.85rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span>{option}</span>
                          {submitted && isCorrect && <Check size={14} style={{ color: 'rgb(52, 211, 153)' }} />}
                          {submitted && isSelected && !isCorrect && <X size={14} style={{ color: 'rgb(248, 113, 113)' }} />}
                        </div>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '6px',
                        borderLeft: `3px solid ${selectedAnswers[q.id] === q.correctAnswerIndex ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)'}`,
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <strong style={{ color: 'white', display: 'block', marginBottom: '0.15rem' }}>Explanation:</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {error && <div style={{ color: '#f87171', fontSize: '0.8rem' }}>{error}</div>}

            {!submitted ? (
              <button onClick={handleSubmitQuiz} className="btn btn-primary">
                Submit Quiz Answers
              </button>
            ) : (
              <div
                className="glass-panel"
                style={{
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(16, 185, 129, 0.05)',
                  borderColor: 'rgba(16, 185, 129, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Award style={{ color: 'rgb(52, 211, 153)' }} size={24} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem' }}>Quiz Results</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      You scored {getScore()} out of {quiz.questions.length} correct.
                    </p>
                  </div>
                </div>
                <button onClick={() => setQuiz(null)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }}>
                  Take Another
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
