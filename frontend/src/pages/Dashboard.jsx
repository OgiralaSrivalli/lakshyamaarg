import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRecommendation, getRoadmap, sendChatMessage, getOpportunities } from '../api';
import LanguageSelector from '../components/LanguageSelector';

// ─── Roadmap Timeline ───────────────────────────────────────────────
const RoadmapPanel = ({ topDomain }) => {
    const [roadmap, setRoadmap] = useState(null);
    const [selectedKey, setSelectedKey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locationInput, setLocationInput] = useState('');
    const [localColleges, setLocalColleges] = useState(null);
    const [loadingColleges, setLoadingColleges] = useState(false);

    const ALL_KEYS = [
        { key: 'technology', label: '🤖 AI/Tech', color: '#6366f1' },
        { key: 'medical', label: '🏥 MBBS', color: '#10b981' },
        { key: 'law', label: '⚖️ Law', color: '#f59e0b' },
        { key: 'business', label: '💼 Business', color: '#8b5cf6' },
        { key: 'design', label: '🎨 Design', color: '#ec4899' },
    ];

    useEffect(() => {
        getRecommendation()
            .then(res => {
                const rm = res.data.recommendation?.roadmap;
                setRoadmap(rm);
                setSelectedKey(rm?.key);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const switchRoadmap = (key) => {
        setLoading(true);
        getRoadmap(key).then(res => {
            setRoadmap(res.data.roadmap);
            setSelectedKey(key);
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>;
    if (!roadmap) return (
        <div style={{ padding: 40, textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Take the psychometric assessment first to see your roadmap.</p>
        </div>
    );

    const handleLocalColleges = async () => {
        if (!locationInput.trim()) return;
        setLoadingColleges(true);
        try {
            // Reusing chatbot logic for a quick LLM extraction
            const res = await sendChatMessage(`List 3 nearby colleges in ${locationInput} for ${roadmap.title}. Format STRICTLY as JSON array of objects: [{"name":"College Name", "location":"City", "info":"Short detail"}]. NO MARKDOWN. NO BACKTICKS. JUST THE RAW JSON ARRAY.`, 'en', false);
            const collegesList = JSON.parse(res.data.response);
            setLocalColleges(collegesList);
        } catch (err) {
            console.error(err);
        }
        setLoadingColleges(false);
    };

    return (
        <div>


            {/* Roadmap header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '20px 24px',
                background: `${roadmap.color}12`, border: `1px solid ${roadmap.color}30`, borderRadius: 16
            }}>
                <span style={{ fontSize: 40 }}>{roadmap.icon}</span>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{roadmap.title}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{roadmap.tagline}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
                {[
                    { label: '📚 Required Subjects', items: roadmap.requiredSubjects },
                    { label: '📝 Entrance Exams', items: roadmap.entranceExams },
                ].map(section => (
                    <div key={section.label} className="card" style={{ padding: 20 }}>
                        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>{section.label}</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {section.items.map(item => (
                                <span key={item} className="badge badge-primary" style={{ fontSize: 12 }}>{item}</span>
                            ))}
                        </div>
                    </div>
                ))}
                <div className="card" style={{ padding: 20 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: 'var(--text-secondary)' }}>⏱️ Duration</h4>
                    <p style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{roadmap.degreeDuration}</p>
                </div>
                <div className="card" style={{ padding: 20 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: 'var(--text-secondary)' }}>💰 Salary Range</h4>
                    <p style={{ fontWeight: 700, color: '#34d399' }}>{roadmap.salaryRange}</p>
                </div>
            </div>

            {/* Career growth */}
            <div className="card" style={{ padding: 20, marginBottom: 28, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: '#34d399' }}>📈 Career Growth Path</h4>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{roadmap.careerGrowth}</p>
            </div>

            {/* Timeline */}
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>🗺️ Step-by-Step Timeline</h3>
            <div className="timeline">
                {roadmap.milestones.map((m, i) => (
                    <div key={i} className="timeline-item">
                        <div className="timeline-dot" style={{ background: `linear-gradient(135deg, ${roadmap.color}, ${roadmap.color}99)`, boxShadow: `0 0 20px ${roadmap.color}50` }}>
                            {i + 1}
                        </div>
                        <div className="timeline-content">
                            <div className="timeline-year" style={{ color: roadmap.color }}>{m.year}</div>
                            <div className="timeline-title">{m.title}</div>
                            <div className="timeline-desc">{m.desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Top Colleges */}
            <div className="card" style={{ padding: 20, marginTop: 8 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>🏛️ Top National Colleges</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                    {roadmap.topColleges.map(c => (
                        <span key={c} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 13, fontWeight: 500 }}>{c}</span>
                    ))}
                </div>

                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>📍 Find Nearby Colleges</h4>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    <input
                        type="text"
                        placeholder="Enter your City or State..."
                        className="form-input"
                        value={locationInput}
                        onChange={e => setLocationInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLocalColleges()}
                        style={{ flex: 1, padding: '10px 14px', fontSize: 14 }}
                    />
                    <button className="btn btn-primary" onClick={handleLocalColleges} disabled={loadingColleges || !locationInput}>
                        {loadingColleges ? '⏳' : '🔍 Search'}
                    </button>
                </div>
                {localColleges && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {localColleges.map((c, i) => (
                            <div key={i} style={{ padding: 14, background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <strong style={{ color: 'var(--primary-light)', fontSize: 15 }}>{c.name}</strong>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {c.location}</span>
                                </div>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c.info}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Chatbot Panel ───────────────────────────────────────────────────
const ChatbotPanel = () => {
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hello! I'm **LakshyaBot** 🎓 — your AI career guide. Ask me about engineering, medicine, law, business, or design careers!\n\nYou can also toggle **Parent Mode** to get answers formatted for your parents." }
    ]);
    const [input, setInput] = useState('');
    const [lang, setLang] = useState(localStorage.getItem('preferredLang') || 'en');
    const [parentMode, setParentMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    useEffect(() => {
        const handleLangChange = () => setLang(localStorage.getItem('preferredLang') || 'en');
        window.addEventListener('languageChange', handleLangChange);
        return () => window.removeEventListener('languageChange', handleLangChange);
    }, []);

    const send = async () => {
        const text = input.trim();
        if (!text || loading) return;
        setInput('');
        setMessages(m => [...m, { role: 'user', text }]);
        setLoading(true);
        try {
            const res = await sendChatMessage(text, lang, parentMode);
            setMessages(m => [...m, { role: 'bot', text: res.data.response }]);
        } catch {
            setMessages(m => [...m, { role: 'bot', text: '❌ Sorry, I encountered an error. Please try again.' }]);
        }
        setLoading(false);
    };

    const SUGGESTIONS = ['What is JEE Advanced?', 'How to prepare for NEET?', 'Best MBA colleges in India?', 'Explain UI/UX career to my parents'];

    const renderText = (text) => {
        // Basic markdown bold
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    return (
        <div>
            {/* Controls */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Chat Language:</span>
                    <select
                        value={lang}
                        onChange={(e) => {
                            const newLang = e.target.value;
                            setLang(newLang);
                            localStorage.setItem('preferredLang', newLang);
                            window.dispatchEvent(new Event('languageChange'));
                            const googleSelect = document.querySelector('.goog-te-combo');
                            if (googleSelect) {
                                googleSelect.value = newLang;
                                googleSelect.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                            } else {
                                document.cookie = `googtrans=/en/${newLang}; path=/;`;
                                window.location.reload();
                            }
                        }}
                        style={{
                            background: 'rgba(10, 10, 15, 0.5)', border: '1px solid rgba(255,255,255,0.1)',
                            color: 'var(--text-primary)', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', outline: 'none'
                        }}
                    >
                        {[
                            { code: "en", name: "English" },
                            { code: "hi", name: "Hindi (हिन्दी)" },
                            { code: "te", name: "Telugu (తెలుగు)" },
                            { code: "ta", name: "Tamil (தமிழ்)" },
                            { code: "mr", name: "Marathi (मराठी)" },
                            { code: "bn", name: "Bengali (বাংলা)" },
                            { code: "gu", name: "Gujarati (ગુજરાતી)" },
                            { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
                            { code: "ml", name: "Malayalam (മലയാളം)" },
                            { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
                            { code: "ur", name: "Urdu (اردو)" },
                            { code: "or", name: "Odia (ଓଡ଼ିଆ)" },
                            { code: "as", name: "Assamese (অসমীয়া)" },
                            { code: "mai", name: "Maithili (मैथिली)" },
                            { code: "sa", name: "Sanskrit (संस्कृत)" }
                        ].map(l => (
                            <option key={l.code} value={l.code}>{l.name}</option>
                        ))}
                    </select>
                </div>
                <button onClick={() => setParentMode(!parentMode)}
                    style={{
                        padding: '9px 18px', borderRadius: 8, border: `1.5px solid ${parentMode ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                        background: parentMode ? 'rgba(245,158,11,0.12)' : 'transparent', color: parentMode ? '#fbbf24' : 'var(--text-secondary)',
                        cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: 'Inter', transition: 'all 0.2s'
                    }}>
                    👨‍👩‍👧 Parent Mode {parentMode ? 'ON' : 'OFF'}
                </button>
                {parentMode && <span className="badge badge-warning">Answers formatted for parents</span>}
            </div>

            <div className="chatbot-container">
                <div className="chatbot-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15 }}>LakshyaBot</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>AI Career Advisor • {lang === 'te' ? 'తెలుగు' : 'English'} {parentMode ? '• 👨‍👩‍👧 Parent Mode' : ''}</div>
                        </div>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
                </div>

                <div className="chatbot-messages">
                    {messages.map((m, i) => (
                        <div key={i} className={`chat-msg ${m.role}`}>
                            {m.role === 'bot' && <div className="chat-avatar">🤖</div>}
                            <div className="chat-bubble" dangerouslySetInnerHTML={{ __html: renderText(m.text).replace(/\n/g, '<br/>') }} />
                            {m.role === 'user' && <div className="chat-avatar" style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}>👤</div>}
                        </div>
                    ))}
                    {loading && (
                        <div className="chat-msg bot">
                            <div className="chat-avatar">🤖</div>
                            <div className="chat-bubble" style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '14px 20px' }}>
                                {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', animation: `bounce 0.8s ${i * 0.15}s infinite alternate`, opacity: 0.6 }} />)}
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                <div className="chatbot-input-row">
                    <textarea className="chatbot-input" rows={1} placeholder="Ask me about any career path..." value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
                    <button className="btn btn-primary" onClick={send} disabled={loading || !input.trim()}>
                        {loading ? '⏳' : '➤'}
                    </button>
                </div>
            </div>

            {/* Quick suggestions */}
            <div style={{ marginTop: 14 }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>QUICK QUESTIONS</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {SUGGESTIONS.map(s => (
                        <button key={s} onClick={() => { setInput(s); }} className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>{s}</button>
                    ))}
                </div>
            </div>

            <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-5px); } }`}</style>
        </div>
    );
};

// ─── Opportunities Panel ─────────────────────────────────────────────
const OpportunitiesPanel = ({ recommendedDomain }) => {
    const [opps, setOpps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('');
    const [selected, setSelected] = useState(null);
    const [domainFilter, setDomainFilter] = useState(recommendedDomain || '');

    const TYPES = [
        { value: '', label: 'All' },
        { value: 'internship', label: '💼 Internships' },
        { value: 'hackathon', label: '⚡ Hackathons' },
        { value: 'scholarship', label: '🎓 Scholarships' },
    ];

    useEffect(() => {
        setLoading(true);
        getOpportunities(domainFilter, typeFilter)
            .then(res => { setOpps(res.data.opportunities); setLoading(false); })
            .catch(() => setLoading(false));
    }, [typeFilter, domainFilter]);

    const NotifModal = ({ opp, onClose }) => (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, maxWidth: 500, width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 18 }}>📧 Email Notification Preview</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 22, cursor: 'pointer' }}>×</button>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, fontFamily: 'monospace', fontSize: 13, lineHeight: 2 }}>
                    <div><strong>From:</strong> noreply@lakshyamaarg.ai</div>
                    <div><strong>To:</strong> student@email.com</div>
                    <div><strong>Subject:</strong> 🎯 Opportunity: {opp.title}</div>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }} />
                    <p>Dear Student,</p>
                    <p style={{ marginTop: 8 }}>A new <strong>{opp.type}</strong> matching your career domain <strong>({opp.domain})</strong> is available:</p>
                    <p style={{ marginTop: 8 }}><strong>{opp.title}</strong> by {opp.organizer}</p>
                    <p>Deadline: <strong>{opp.deadline_display}</strong> ({opp.days_left} days left)</p>
                    <p>Eligibility: {opp.eligibility}</p>
                    {opp.stipend && <p>Stipend/Prize: <strong>{opp.stipend || opp.prize}</strong></p>}
                    <p style={{ marginTop: 12 }}>→ Register: <span style={{ color: 'var(--primary-light)' }}>{opp.registration_link}</span></p>
                    <p style={{ marginTop: 12 }}>Best of luck! 🚀<br />Team Lakshyamaarg</p>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <a href={opp.registration_link} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Register Now →</a>
                    <button onClick={onClose} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Close</button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {selected && <NotifModal opp={selected} onClose={() => setSelected(null)} />}

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="tabs">
                    {TYPES.map(t => (
                        <button key={t.value} className={`tab-btn ${typeFilter === t.value ? 'active' : ''}`} onClick={() => setTypeFilter(t.value)}>{t.label}</button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input className="form-input" placeholder="Filter by domain..." value={domainFilter}
                        onChange={e => setDomainFilter(e.target.value)}
                        style={{ width: 180, padding: '8px 14px', fontSize: 13 }} />
                    {domainFilter && <button className="btn btn-ghost btn-sm" onClick={() => setDomainFilter('')}>✕ Clear</button>}
                </div>
            </div>

            {loading ? (
                <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
            ) : opps.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>No opportunities found for this filter.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                    {opps.map(opp => (
                        <div key={opp.id} className="opp-card">
                            <div className="opp-card-header">
                                <div>
                                    <div className="opp-card-title">{opp.title}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{opp.organizer}</div>
                                </div>
                                <span className={`badge ${opp.type === 'scholarship' ? 'badge-success' : opp.type === 'hackathon' ? 'badge-warning' : 'badge-primary'}`} style={{ flexShrink: 0, fontSize: 11 }}>
                                    {opp.type}
                                </span>
                            </div>
                            <div className="opp-card-meta">
                                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>🎯 {opp.domain}</span>
                                {(opp.stipend || opp.prize) && <span style={{ fontSize: 12, color: '#34d399', fontWeight: 600 }}>💰 {opp.stipend || opp.prize}</span>}
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{opp.description}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>📋 {opp.eligibility}</div>
                            <div className="opp-card-footer">
                                <div className={`deadline-pill ${opp.days_left <= 10 ? 'urgent' : ''}`}>
                                    ⏰ {opp.is_expired ? 'Expired' : `${opp.days_left}d left · ${opp.deadline_display}`}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(opp)} title="Preview notification">📧</button>
                                    <a href={opp.registration_link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">Apply →</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Main Dashboard ──────────────────────────────────────────────────
const Dashboard = ({ navigate }) => {
    const { user, assessment, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [recommendation, setRecommendation] = useState(null);

    useEffect(() => {
        getRecommendation()
            .then(res => setRecommendation(res.data.recommendation))
            .catch(() => { });
    }, []);

    const DOMAIN_COLORS = { analytical: '#6366f1', creativity: '#ec4899', leadership: '#f59e0b', medical: '#10b981', business: '#8b5cf6' };
    const DOMAIN_ICONS = { analytical: '🧠', creativity: '🎨', leadership: '⚡', medical: '🏥', business: '💼' };

    const NAV_ITEMS = [
        { key: 'overview', icon: '🏠', label: 'Overview' },
        { key: 'assessment', icon: '🧠', label: 'Assessment', action: () => navigate('assessment') },
        { key: 'roadmap', icon: '🗺️', label: 'Career Roadmap' },
        { key: 'chatbot', icon: '🤖', label: 'AI Advisor' },
        { key: 'opportunities', icon: '🎯', label: 'Opportunities' },
        { key: 'govjobs', icon: '🏛️', label: 'Govt Jobs' },
    ];

    const scores = assessment?.scores || {};
    const sortedDomains = Object.entries(scores).sort(([, a], [, b]) => b - a);

    const OverviewPanel = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Welcome */}
            <div style={{ padding: '28px 32px', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20 }}>
                <h2 style={{ fontSize: 26, fontFamily: 'Outfit', marginBottom: 6 }}>
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
                    {assessment ? `Your recommended path: ${assessment.top_domain}` : 'Complete your psychometric assessment to get personalized career recommendations.'}
                </p>
                {!assessment && (
                    <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('assessment')}>
                        🧠 Start Assessment Now →
                    </button>
                )}
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {[
                    { icon: '🎓', label: 'Education Level', value: user?.education_level || '—' },
                    { icon: '📚', label: 'Stream', value: user?.stream || '—' },
                    { icon: '🏆', label: 'Top Domain', value: assessment ? assessment.top_domain?.split('/')[0]?.trim() : 'Pending' },
                    { icon: '✅', label: 'Assessment', value: assessment ? 'Completed' : 'Pending' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon">{s.icon}</div>
                        <div className="stat-value" style={{ fontSize: 20, color: assessment ? 'var(--primary-light)' : 'var(--text-primary)' }}>{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Domain scores if available */}
            {assessment && sortedDomains.length > 0 && (
                <div className="card">
                    <h3 style={{ fontSize: 17, marginBottom: 20 }}>📊 Your Domain Profile</h3>
                    <div className="score-bar-wrapper">
                        {sortedDomains.map(([domain, score]) => (
                            <div key={domain} className="score-bar-item">
                                <div className="score-bar-label">
                                    <span>{DOMAIN_ICONS[domain] || '📌'} {domain.charAt(0).toUpperCase() + domain.slice(1)}</span>
                                    <span style={{ color: DOMAIN_COLORS[domain] || 'var(--primary)', fontWeight: 700 }}>{score}%</span>
                                </div>
                                <div className="score-bar-track">
                                    <div className="score-bar-fill" style={{ width: `${score}%`, background: DOMAIN_COLORS[domain] || 'var(--primary)' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('results')}>View Full Results →</button>
                        <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('roadmap')}>View Roadmap →</button>
                    </div>
                </div>
            )}

            {/* Quick access */}
            <div>
                <h3 style={{ fontSize: 17, marginBottom: 16 }}>🚀 Project Features Overview</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                    {[
                        { icon: '🗺️', label: 'Career Roadmap', desc: 'View your personalized path', tab: 'roadmap', color: '#6366f1' },
                        { icon: '🤖', label: 'Ask AI Advisor', desc: 'Get career guidance instantly', tab: 'chatbot', color: '#8b5cf6' },
                        { icon: '🎯', label: 'Opportunities', desc: 'Internships & scholarships', tab: 'opportunities', color: '#10b981' },
                        { icon: '🏛️', label: 'Govt Jobs', desc: 'Explore civil services & exams', tab: 'govjobs', color: '#ef4444' },
                        { icon: '🧠', label: 'New Assessment', desc: 'Retake psychometric test', action: () => navigate('assessment'), color: '#f59e0b' },
                    ].map(item => (
                        <button key={item.label} onClick={() => item.action ? item.action() : setActiveTab(item.tab)}
                            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: 'var(--bg-card)', border: `1px solid ${item.color}25`, borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', fontFamily: 'Inter' }}
                            onMouseEnter={e => { e.currentTarget.style.background = `${item.color}10`; e.currentTarget.style.borderColor = `${item.color}50`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = `${item.color}25`; e.currentTarget.style.transform = ''; }}>
                            <div style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{item.label}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{item.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const PAGE_TITLES = { overview: 'Dashboard', roadmap: 'Career Roadmap', chatbot: 'AI Career Advisor', opportunities: 'Opportunities', govjobs: 'Government Jobs & Exams' };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 28, padding: '0 4px', marginTop: '8px' }}>
                    <img src="/logo.png" alt="Logo" style={{ height: '40px', width: '40px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }} />
                    <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 24, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>Lakshyamaarg</span>
                </div>
                {NAV_ITEMS.map(item => (
                    <button key={item.key} className={`sidebar-item ${activeTab === item.key ? 'active' : ''}`}
                        onClick={() => item.action ? item.action() : setActiveTab(item.key)}>
                        <span className="icon">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
                <div style={{ flexGrow: 1 }} />
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 16 }}>
                    <div style={{ padding: '10px 14px', marginBottom: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</div>
                    </div>
                    <button className="sidebar-item" onClick={() => { logout(); navigate('landing'); }}
                        style={{ color: '#f87171', width: '100%' }}>
                        <span className="icon">🚪</span> Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="dashboard-main">
                {/* Top bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                    <div>
                        <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Outfit' }}>{PAGE_TITLES[activeTab]}</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <LanguageSelector />
                        {assessment && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 999 }}>
                                <span style={{ fontSize: 14 }}>🏆</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#34d399' }}>{assessment.top_domain}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Panels */}
                {activeTab === 'overview' && <OverviewPanel />}
                {activeTab === 'roadmap' && <RoadmapPanel topDomain={assessment?.top_domain} />}
                {activeTab === 'chatbot' && <ChatbotPanel />}
                {activeTab === 'opportunities' && <OpportunitiesPanel recommendedDomain={recommendation?.roadmap?.key || ''} />}
                {activeTab === 'govjobs' && <GovJobsPanel user={user} assessment={assessment} />}
            </main>
        </div>
    );
};

// ─── Govt Jobs Panel ─────────────────────────────────────────────────
const GovJobsPanel = ({ user }) => {
    const isAdmin = user?.email?.includes('admin');
    const [jobs, setJobs] = useState([
        { id: 1, title: 'UPSC Civil Services', category: 'Administration', exam: 'UPSC CSE', eligibility: 'UG/PG', link: 'https://testbook.com/upsc-civil-services' },
        { id: 2, title: 'SSC Combined Graduate Level', category: 'Staff Selection', exam: 'SSC CGL', eligibility: 'UG', link: 'https://testbook.com/ssc-cgl' },
        { id: 3, title: 'NDA / Naval Academy', category: 'Defense', exam: 'NDA', eligibility: '12th', link: 'https://testbook.com/nda' },
        { id: 4, title: 'Indian Engineering Services', category: 'Engineering', exam: 'UPSC IES', eligibility: 'B.Tech', link: 'https://testbook.com/upsc-ese' },
        { id: 5, title: 'Railway Recruitment Board', category: 'Railways', exam: 'RRB NTPC', eligibility: '12th/UG', link: 'https://testbook.com/rrb-ntpc' },
        { id: 6, title: 'IBPS PO', category: 'Banking', exam: 'IBPS PO', eligibility: 'UG', link: 'https://testbook.com/ibps-po' },
        { id: 7, title: 'SBI Probationary Officer', category: 'Banking', exam: 'SBI PO', eligibility: 'UG', link: 'https://testbook.com/sbi-po' },
        { id: 8, title: 'RBI Grade B', category: 'Banking', exam: 'RBI Grade B', eligibility: 'UG/PG', link: 'https://testbook.com/rbi-grade-b' },
        { id: 9, title: 'SSC CHSL', category: 'Staff Selection', exam: 'SSC CHSL', eligibility: '12th', link: 'https://testbook.com/ssc-chsl' },
        { id: 10, title: 'AFCAT', category: 'Defense', exam: 'AFCAT', eligibility: 'UG', link: 'https://testbook.com/afcat' },
        { id: 11, title: 'LIC AAO', category: 'Insurance', exam: 'LIC AAO', eligibility: 'UG', link: 'https://testbook.com/lic-aao' },
        { id: 12, title: 'State PSC Exams', category: 'State Administration', exam: 'State PSC', eligibility: 'UG', link: 'https://testbook.com/state-psc' },
        { id: 13, title: 'GATE (PSU Recruitment)', category: 'Engineering', exam: 'GATE', eligibility: 'B.Tech', link: 'https://testbook.com/gate' },
    ]);
    const [adding, setAdding] = useState(false);
    const [newJob, setNewJob] = useState({ title: '', category: '', exam: '', eligibility: '' });
    const [mockModal, setMockModal] = useState(null);
    const [roadmapModal, setRoadmapModal] = useState(null);

    const suggestExams = () => {
        const edu = user?.education_level || '';
        if (edu.includes('B.Tech') || edu.includes('Engineering')) return jobs.filter(j => j.eligibility.includes('B.Tech') || j.eligibility.includes('UG'));
        if (edu.includes('12') || edu.includes('11')) return jobs.filter(j => j.eligibility.includes('12th'));
        return jobs;
    };

    const suggested = suggestExams();

    const handleAdd = () => {
        setJobs([...jobs, { ...newJob, id: Date.now(), link: '#' }]);
        setAdding(false);
        setNewJob({ title: '', category: '', exam: '', eligibility: '' });
    };

    const handleDelete = (id) => setJobs(jobs.filter(j => j.id !== id));

    return (
        <div>
            {isAdmin && (
                <div style={{ marginBottom: 20, padding: 20, background: 'rgba(239,68,68,0.08)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: adding ? 16 : 0 }}>
                        <h4 style={{ color: '#ef4444', fontWeight: 700 }}>🔒 Admin Control Panel</h4>
                        <button className="btn btn-primary btn-sm" style={{ background: '#ef4444' }} onClick={() => setAdding(!adding)}>{adding ? 'Cancel' : '+ Add New Job'}</button>
                    </div>
                    {adding && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <input className="form-input" placeholder="Job Title" value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} />
                            <input className="form-input" placeholder="Category" value={newJob.category} onChange={e => setNewJob({ ...newJob, category: e.target.value })} />
                            <input className="form-input" placeholder="Exam Name" value={newJob.exam} onChange={e => setNewJob({ ...newJob, exam: e.target.value })} />
                            <input className="form-input" placeholder="Eligibility (e.g. 12th, B.Tech)" value={newJob.eligibility} onChange={e => setNewJob({ ...newJob, eligibility: e.target.value })} />
                            <button className="btn btn-primary" onClick={handleAdd} style={{ gridColumn: '1 / -1' }}>Save Job Listing</button>
                        </div>
                    )}
                </div>
            )}

            <h3 style={{ fontSize: 18, marginBottom: 16 }}>🎯 Suggested for You (Based on {user?.education_level})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
                {suggested.map(job => (
                    <div key={job.id} className="card" style={{ padding: 20, borderTop: '4px solid var(--primary-light)' }}>
                        <div className="badge" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--primary-light)', marginBottom: 12 }}>{job.category}</div>
                        <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{job.title}</h4>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Exam: {job.exam} • Eligibility: {job.eligibility}</p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                            <button className="btn btn-primary btn-sm" style={{ flex: 1, minWidth: '120px', background: 'rgba(99,102,241,0.2)', color: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.3)' }} onClick={() => setMockModal(job)}>📝 Mock Tests</button>
                            <button className="btn btn-outline btn-sm" style={{ flex: 1, minWidth: '120px', color: '#10b981', borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)' }} onClick={() => setRoadmapModal(job)}>🗺️ Roadmap</button>
                            {isAdmin && <button className="btn btn-outline btn-sm" onClick={() => handleDelete(job.id)}>🗑️</button>}
                        </div>
                    </div>
                ))}
            </div>

            <h3 style={{ fontSize: 18, marginBottom: 16 }}>🏛️ All Government Job Categories</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {jobs.map(job => (
                    <div key={job.id} className="card" style={{ padding: 20 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{job.title}</h4>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Exam: {job.exam}</p>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Eligibility: <span style={{ color: 'var(--primary-light)' }}>{job.eligibility}</span></p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                            <button className="btn btn-primary btn-sm" style={{ flex: 1, minWidth: '120px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.2)' }} onClick={() => setMockModal(job)}>📝 Mock Tests</button>
                            <button className="btn btn-outline btn-sm" style={{ flex: 1, minWidth: '120px', color: '#10b981', borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)' }} onClick={() => setRoadmapModal(job)}>🗺️ Roadmap</button>
                            {isAdmin && <button className="btn btn-outline btn-sm" onClick={() => handleDelete(job.id)}>🗑️</button>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Mock Test Selection Modal */}
            {mockModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
                    <div className="card" style={{ width: '100%', maxWidth: 450, padding: 32, background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ fontSize: 20, margin: 0 }}>Select Platform for {mockModal.exam}</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => setMockModal(null)}>✕</button>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24 }}>Choose a platform to start your mock tests for {mockModal.title}.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <button className="btn btn-outline" style={{ justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)' }} onClick={() => window.open(mockModal.link, '_blank')}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 18 }}>📘</span> Testbook</span><span>↗</span>
                            </button>
                            <button className="btn btn-outline" style={{ justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)' }} onClick={() => window.open(`https://www.adda247.com/search?q=${mockModal.exam}`, '_blank')}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 18 }}>🔴</span> Adda247</span><span>↗</span>
                            </button>
                            <button className="btn btn-outline" style={{ justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)' }} onClick={() => window.open(`https://www.oliveboard.in/exams/?q=${mockModal.exam}`, '_blank')}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 18 }}>🌿</span> Oliveboard</span><span>↗</span>
                            </button>
                            <button className="btn btn-outline" style={{ justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)' }} onClick={() => window.open(`https://cracku.in/search?q=${mockModal.exam}`, '_blank')}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 18 }}>🎯</span> Cracku</span><span>↗</span>
                            </button>
                        </div>
                    </div>
                </div>
            )
            }

            {/* Roadmap Modal */}
            {
                roadmapModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
                        <div className="card" style={{ width: '100%', maxWidth: 500, padding: 32, background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <h3 style={{ fontSize: 20, margin: 0 }}>Preparation Roadmap</h3>
                                <button className="btn btn-ghost btn-sm" onClick={() => setRoadmapModal(null)}>✕</button>
                            </div>
                            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '12px 16px', borderRadius: 8, marginBottom: 24, border: '1px solid rgba(16,185,129,0.2)' }}>
                                <h4 style={{ color: '#10b981', margin: 0, fontSize: 15 }}>{roadmapModal.title}</h4>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0, marginTop: 4 }}>Exam: {roadmapModal.exam}</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 15, top: 10, bottom: 10, width: 2, background: 'rgba(255,255,255,0.1)' }} />

                                {[
                                    { title: '1. Understand the Syllabus & Pattern', desc: 'Thoroughly analyze previous year papers and exact exam syllabus.' },
                                    { title: '2. Gather Standard Resources', desc: 'Collect NCERTs, specific recommended books, and clear fundamental concepts.' },
                                    { title: '3. Daily Practice & Mock Tests', desc: 'Enroll in test series (Testbook/Adda247) and give weekly mocks.' },
                                    { title: '4. Current Affairs & Revision', desc: 'Read daily news, make short notes, and keep revising subjects cyclically.' },
                                    { title: '5. Clear Prelims & Mains (if applicable)', desc: 'Focus strictly on mock analysis leading up to the main exam dates.' }
                                ].map((step, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 16, position: 'relative', zIndex: 1 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 'bold', color: '#000', flexShrink: 0 }}>{i + 1}</div>
                                        <div>
                                            <h5 style={{ margin: '0 0 4px', fontSize: 15 }}>{step.title}</h5>
                                            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: 28 }} onClick={() => setRoadmapModal(null)}>Got it, Let's start!</button>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default Dashboard;
