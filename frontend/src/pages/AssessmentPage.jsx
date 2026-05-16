import React, { useEffect, useState, useRef } from 'react';
import { getQuestions, submitAssessment } from '../api';
import { useAuth } from '../context/AuthContext';

const DOMAIN_LABELS = {
    analytical: { label: 'Analytical', icon: '🧠', color: '#6366f1' },
    creativity: { label: 'Creativity', icon: '🎨', color: '#ec4899' },
    leadership: { label: 'Leadership', icon: '⚡', color: '#f59e0b' },
    medical: { label: 'Medical', icon: '🏥', color: '#10b981' },
    business: { label: 'Business', icon: '💼', color: '#8b5cf6' },
};

const AssessmentPage = ({ navigate }) => {
    const { updateAssessment } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 min
    const timerRef = useRef(null);

    useEffect(() => {
        getQuestions()
            .then(res => { setQuestions(res.data.questions); setLoading(false); })
            .catch(() => { setError('Failed to load questions. Please try again.'); setLoading(false); });
    }, []);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0; } return t - 1; });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [questions]);

    const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const selectAnswer = (label) => {
        setAnswers(prev => ({ ...prev, [questions[current].id]: label }));
    };

    const handleSubmit = async () => {
        clearInterval(timerRef.current);
        if (Object.keys(answers).length < questions.length) {
            const unanswered = questions.length - Object.keys(answers).length;
            if (!window.confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
        }
        setSubmitting(true);
        try {
            const res = await submitAssessment(answers);
            updateAssessment(res.data);
            navigate('results');
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed. Please try again.');
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="loading-screen">
            <div className="spinner" />
            <p style={{ color: 'var(--text-secondary)' }}>Loading your assessment...</p>
        </div>
    );

    if (error) return (
        <div className="loading-screen">
            <div style={{ fontSize: 48 }}>❌</div>
            <p style={{ color: 'var(--danger)' }}>{error}</p>
            <button className="btn btn-outline" onClick={() => navigate('dashboard')}>← Back to Dashboard</button>
        </div>
    );

    const q = questions[current];
    const answered = Object.keys(answers).length;
    const progress = ((current + 1) / questions.length) * 100;

    // Domain section labels
    const getDomainSection = () => {
        if (!q) return '';
        const d = DOMAIN_LABELS[q.domain];
        return d ? `${d.icon} ${d.label} Aptitude` : '';
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '80px 0 40px' }}>
            {/* Header bar */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 18, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>⚡ Psychometric Assessment</span>
                <div style={{ display: 'flex', align: 'center', gap: 20 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>ANSWERED</div>
                        <div style={{ fontWeight: 700, color: 'var(--secondary)' }}>{answered}/{questions.length}</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '4px 16px', background: timeLeft < 300 ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.12)', borderRadius: 8, border: `1px solid ${timeLeft < 300 ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.25)'}` }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>TIME LEFT</div>
                        <div style={{ fontWeight: 800, fontSize: 18, color: timeLeft < 300 ? '#f87171' : 'var(--primary-light)' }}>{fmtTime(timeLeft)}</div>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99, height: 3 }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--grad-primary)', transition: 'width 0.4s ease' }} />
            </div>

            <div className="container" style={{ maxWidth: 720 }}>
                {/* Question number nav */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 28 }}>
                    {questions.map((_, i) => (
                        <button key={i} onClick={() => setCurrent(i)}
                            style={{
                                width: 34, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, transition: 'all 0.2s',
                                background: i === current ? 'var(--primary)' : answers[questions[i]?.id] ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                                color: i === current ? 'white' : answers[questions[i]?.id] ? '#34d399' : 'var(--text-muted)',
                                boxShadow: i === current ? '0 0 12px rgba(99,102,241,0.5)' : 'none'
                            }}>
                            {i + 1}
                        </button>
                    ))}
                </div>

                {/* Question card */}
                {q && (
                    <div className="card" key={q.id} style={{ padding: '32px', minHeight: 300 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <span className="badge badge-primary">{getDomainSection()}</span>
                            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Q{current + 1} of {questions.length}</span>
                        </div>
                        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 28, lineHeight: 1.5 }}>{q.question}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {q.options.map(opt => {
                                const selected = answers[q.id] === opt.label;
                                return (
                                    <button key={opt.label} onClick={() => selectAnswer(opt.label)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 12,
                                            background: selected ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                                            border: `2px solid ${selected ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
                                            cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', color: 'var(--text-primary)', fontFamily: 'Inter',
                                            boxShadow: selected ? '0 0 20px rgba(99,102,241,0.2)' : 'none'
                                        }}>
                                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: selected ? 'var(--primary)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0, color: selected ? 'white' : 'var(--text-secondary)' }}>
                                            {opt.label}
                                        </div>
                                        <span style={{ fontSize: 15, lineHeight: 1.5 }}>{opt.text}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
                    <button className="btn btn-outline" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>← Previous</button>
                    <div style={{ display: 'flex', gap: 12 }}>
                        {current < questions.length - 1 ? (
                            <button className="btn btn-primary" onClick={() => setCurrent(c => c + 1)}>Next →</button>
                        ) : (
                            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}
                                style={{ background: 'var(--grad-success)' }}>
                                {submitting ? '⏳ Submitting...' : '✅ Submit Assessment'}
                            </button>
                        )}
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                    💡 All questions are equally important. Answer honestly for the best recommendation.
                </p>
            </div>
        </div>
    );
};

export default AssessmentPage;
