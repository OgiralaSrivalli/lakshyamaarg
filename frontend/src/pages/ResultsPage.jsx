import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRecommendation } from '../api';

const DOMAIN_COLORS = {
    analytical: '#6366f1', creativity: '#ec4899', leadership: '#f59e0b',
    medical: '#10b981', business: '#8b5cf6',
};
const DOMAIN_ICONS = {
    analytical: '🧠', creativity: '🎨', leadership: '⚡', medical: '🏥', business: '💼',
};

const ResultsPage = ({ navigate }) => {
    const { assessment } = useAuth();
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        getRecommendation()
            .then(res => { setRecommendation(res.data.recommendation); setLoading(false); setTimeout(() => setAnimated(true), 200); })
            .catch(() => { setLoading(false); });
    }, []);

    if (loading) return (
        <div className="loading-screen">
            <div style={{ fontSize: 60, animation: 'spin 2s linear infinite' }}>⚙️</div>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'Outfit', fontSize: 18 }}>Analyzing your results...</p>
        </div>
    );

    const data = recommendation || (assessment ? { scores: assessment.scores, top_domain: assessment.top_domain, explanation: assessment.explanation } : null);

    if (!data) return (
        <div className="loading-screen">
            <div style={{ fontSize: 48 }}>📝</div>
            <p style={{ color: 'var(--text-secondary)' }}>No assessment found. Please take the test first.</p>
            <button className="btn btn-primary" onClick={() => navigate('assessment')}>Take Assessment</button>
        </div>
    );

    const scores = data.scores || {};
    const sortedDomains = Object.entries(scores).sort(([, a], [, b]) => b - a);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '80px 0 60px' }}>
            {/* Header */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 18, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🎯 Your Results</span>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('dashboard')}>Go to Dashboard →</button>
            </div>

            <div className="container" style={{ maxWidth: 800 }}>
                {/* Hero result */}
                <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
                    <div style={{ fontSize: 20, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, fontFamily: 'Outfit' }}>ASSESSMENT COMPLETE ✨</div>
                    <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontFamily: 'Outfit', fontWeight: 800, marginBottom: 12 }}>
                        Your Career Match
                    </h1>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100, padding: '10px 24px', marginBottom: 16 }}>
                        <span style={{ fontSize: 24 }}>🏆</span>
                        <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Outfit', color: 'var(--primary-light)' }}>{data.top_domain}</span>
                    </div>
                </div>

                {/* Score bars */}
                <div className="card" style={{ marginBottom: 24 }}>
                    <h3 style={{ marginBottom: 20, fontSize: 18 }}>📊 Domain Inclination Scores</h3>
                    <div className="score-bar-wrapper">
                        {sortedDomains.map(([domain, score]) => (
                            <div key={domain} className="score-bar-item">
                                <div className="score-bar-label">
                                    <span>{DOMAIN_ICONS[domain]} {domain.charAt(0).toUpperCase() + domain.slice(1)}</span>
                                    <span style={{ color: DOMAIN_COLORS[domain], fontWeight: 700 }}>{score}%</span>
                                </div>
                                <div className="score-bar-track">
                                    <div className="score-bar-fill" style={{ width: animated ? `${score}%` : '0%', background: DOMAIN_COLORS[domain] || 'var(--primary)' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Explanation */}
                <div className="card" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: 24 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <div style={{ fontSize: 40, flexShrink: 0 }}>💡</div>
                        <div>
                            <h3 style={{ fontSize: 18, marginBottom: 10, color: 'var(--primary-light)' }}>What This Means For You</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 15 }}>{data.explanation}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <button className="btn btn-primary" style={{ justifyContent: 'center', padding: '18px' }} onClick={() => navigate('dashboard')}>
                        🗺️ View Career Roadmap
                    </button>
                    <button className="btn btn-outline" style={{ justifyContent: 'center', padding: '18px' }} onClick={() => navigate('assessment')}>
                        🔄 Retake Assessment
                    </button>
                </div>

                <div style={{ marginTop: 32, padding: 20, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 24 }}>🤖</span>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        <strong style={{ color: '#34d399' }}>Next Step:</strong> Head to the Dashboard to view your detailed career roadmap, chat with the AI advisor, and discover relevant scholarships and internships.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
