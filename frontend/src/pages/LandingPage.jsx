import React, { useState } from 'react';
import LanguageSelector from '../components/LanguageSelector';

const FEATURES = [
    { icon: '🧠', title: 'Psychometric Assessment', desc: '20 scientifically designed questions to map your personality, aptitude, and interests to ideal career domains.' },
    { icon: '🗺️', title: 'Career Roadmaps', desc: 'Step-by-step visual timeline for Engineering, MBBS, Law, Business, and Design — from today to your dream job.' },
    { icon: '🤖', title: 'AI Career Chatbot', desc: 'Ask anything about entrance exams, colleges, or salaries. Bilingual support in English and Telugu.' },
    { icon: '🎯', title: 'Opportunity Intelligence', desc: 'Curated internships, hackathons, and scholarships filtered for your domain with live deadline countdowns.' },
    { icon: '👨‍👩‍👧', title: 'Parent Explanation Mode', desc: 'Special chatbot mode that explains career choices in a way that convinces parents and builds family confidence.' },
    { icon: '📊', title: 'Domain Analytics', desc: 'See your scores across 5 dimensions — Analytical, Creative, Leadership, Medical, and Business inclination.' },
];



const LandingPage = ({ navigate }) => {
    const [activeFeature, setActiveFeature] = useState(0);

    return (
        <div style={{ background: 'transparent', minHeight: '100vh' }}>
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-inner">
                    <div className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src="/logo.png" alt="Lakshyamaarg Logo" style={{ height: '48px', width: '48px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }} />
                        <span style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.5px' }}>Lakshyamaarg</span>
                    </div>
                    <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <LanguageSelector />
                        <button className="navbar-link" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Features</button>
                        <button className="btn btn-outline btn-sm" onClick={() => navigate('auth')} style={{ marginLeft: 8 }}>Login</button>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('auth')}>Get Started →</button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero-section" style={{ position: 'relative' }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="hero-grid">
                        <div style={{ padding: '40px', background: 'rgba(10,10,15,0.7)', backdropFilter: 'blur(10px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                            <div className="hero-eyebrow">
                                <span>✨</span> AI-Powered Career Intelligence
                            </div>
                            <h1 className="hero-title">
                                Discover Your{' '}
                                <span className="text-gradient">Perfect Career</span>{' '}
                                Path
                            </h1>
                            <p className="hero-desc">
                                Lakshyamaarg uses psychometric science and AI to guide Indian students from confusion to clarity.
                                Stop guessing — find the career you were born for.
                            </p>
                            <div className="hero-actions">
                                <button className="btn btn-primary btn-lg" onClick={() => navigate('auth')}>
                                    🚀 Start Your Journey
                                </button>
                                <button className="btn btn-outline btn-lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                                    See How It Works
                                </button>
                            </div>
                            <div style={{ marginTop: 40, display: 'flex', gap: 32 }}>
                                {[['500+', 'Students Guided'], ['100+', 'Career Domains mapped'], ['95%', 'Satisfaction']].map(([val, lab]) => (
                                    <div key={lab}>
                                        <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Outfit', color: 'var(--primary-light)' }}>{val}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{lab}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="hero-visual">
                            <div className="hero-card-float">
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Your Career Match</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <span style={{ fontSize: 20 }}>🔥</span>
                                        <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>Highly Personalized AI Roadmaps</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <span style={{ fontSize: 20 }}>🧠</span>
                                        <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>Match Any Career Globally</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <span style={{ fontSize: 20 }}>📈</span>
                                        <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>Data-Driven Insights</span>
                                    </div>
                                </div>
                                <button className="btn btn-primary w-full" style={{ marginTop: 16, justifyContent: 'center' }} onClick={() => navigate('auth')}>
                                    Take Assessment →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section" id="features">
                <div className="container">
                    <div className="text-center" style={{ marginBottom: 60 }}>
                        <div className="hero-eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>🔥 Platform Features</div>
                        <h2 className="section-title">Everything You Need to Choose Right</h2>
                        <p className="section-subtitle" style={{ margin: '12px auto 0' }}>One platform for psychometrics, roadmaps, AI guidance, and live opportunities.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                        {FEATURES.map((f, i) => (
                            <div key={i} className="card" style={{ cursor: 'pointer', background: activeFeature === i ? 'rgba(99,102,241,0.08)' : '' }} onMouseEnter={() => setActiveFeature(i)}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* CTA Banner */}
            <section className="section">
                <div className="container">
                    <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 24, padding: '60px 40px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', marginBottom: 16 }}>Ready to Find Your Lakshya?</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 17, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
                            Join hundreds of students who've found direction with Lakshyamaarg's AI-powered guidance.
                        </p>
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('auth')}>
                            🎯 Start Free Assessment
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                <div className="container">
                    <div className="navbar-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                        <img src="/logo.png" alt="Lakshyamaarg Logo" style={{ height: '28px', width: '28px' }} />
                        <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.5px' }}>Lakshyamaarg</span>
                    </div>
                    <p style={{ marginTop: 8 }}>© 2025 Lakshyamaarg · AI Career Intelligence Platform · Built for Indian Students</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
