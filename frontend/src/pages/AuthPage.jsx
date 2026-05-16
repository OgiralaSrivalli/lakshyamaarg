import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerUser, verifyOtp, loginUser } from '../api';
import LanguageSelector from '../components/LanguageSelector';

// ─── Education → Stream options ───────────────────────────────────────────────
const STREAM_OPTIONS = {
    '10th': ['SSC', 'CBSE', 'ICSE', 'Other'],
    '11th': ['MPC', 'BiPC', 'MEC', 'CEC', 'HEC', 'Other'],
    '12th': ['MPC', 'BiPC', 'MEC', 'CEC', 'HEC', 'Other'],
    'B.Tech': ['CSE', 'CSM', 'CSD', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'],
};
const EDUCATION_LEVELS = Object.keys(STREAM_OPTIONS);

const selectStyle = {
    background: '#0f0f1a',
    color: '#f1f5f9',
    border: '1.5px solid rgba(99,102,241,0.25)',
    borderRadius: 10,
    padding: '13px 14px',
    fontSize: 15,
    fontFamily: 'Inter, sans-serif',
    width: '100%',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23a0aec0' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5H7z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '20px',
    paddingRight: 40,
    transition: 'border-color 0.2s',
};

const Toast = ({ msg, type }) => msg ? (
    <div style={{
        position: 'fixed', top: 20, right: 20, zIndex: 9999, padding: '14px 20px',
        borderRadius: 12, fontWeight: 600, fontSize: 14, maxWidth: 400,
        background: type === 'success' ? 'rgba(16,185,129,0.18)' : type === 'error' ? 'rgba(239,68,68,0.18)' : 'rgba(99,102,241,0.18)',
        border: `1px solid ${type === 'success' ? 'rgba(16,185,129,0.4)' : type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(99,102,241,0.4)'}`,
        color: type === 'success' ? '#34d399' : type === 'error' ? '#f87171' : '#a5b4fc',
        backdropFilter: 'blur(10px)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)', lineHeight: 1.5,
    }}>
        {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} {msg}
    </div>
) : null;

const AuthPage = ({ navigate }) => {
    const { login } = useAuth();
    const [mode, setMode] = useState('login'); // login | register | otp
    const [step, setStep] = useState(1); // 1=name+email, 2=education, 3=password
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ msg: '', type: 'info' });


    const [form, setForm] = useState({
        name: '', email: '', education_level: '', stream: '', password: '', confirm: '',
    });
    const [otp, setOtp] = useState('');
    const [otpEmail, setOtpEmail] = useState('');

    const showToast = (msg, type = 'info', duration = 5000) => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: '', type: 'info' }), duration);
    };

    const set = (k, v) => setForm(f => {
        const next = { ...f, [k]: v };
        if (k === 'education_level') next.stream = ''; // reset stream when edu changes
        return next;
    });

    // ── REGISTER steps ──
    const handleRegister = async () => {
        if (step === 1) {
            if (!form.name.trim()) return showToast('Please enter your full name', 'error');
            if (!form.email.includes('@') || !form.email.includes('.'))
                return showToast('Please enter a valid email address', 'error');
            return setStep(2);
        }
        if (step === 2) {
            if (!form.education_level) return showToast('Select your education level', 'error');
            if (!form.stream) return showToast('Select your stream / branch', 'error');
            return setStep(3);
        }
        if (step === 3) {
            if (form.password.length < 6) return showToast('Password must be at least 6 characters', 'error');
            if (form.password !== form.confirm) return showToast('Passwords do not match', 'error');
            setLoading(true);
            try {
                await registerUser({
                    name: form.name.trim(),
                    email: form.email.trim().toLowerCase(),
                    education_level: form.education_level,
                    stream: form.stream,
                    password: form.password,
                });
                setOtpEmail(form.email.trim().toLowerCase());
                showToast('Account created! OTP sent to your email/phone 📱📧', 'success', 7000);
                setMode('otp');
            } catch (err) {
                showToast(err.response?.data?.message || 'Registration failed. Try again.', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    // ── OTP verify ──
    const handleVerifyOtp = async () => {
        if (otp.length !== 6) return showToast('Enter the 6-digit OTP', 'error');
        setLoading(true);
        try {
            await verifyOtp({ email: otpEmail, otp });
            showToast('Email verified! Redirecting to login...', 'success');
            setTimeout(() => { setMode('login'); setOtp(''); }, 1800);
        } catch (err) {
            showToast(err.response?.data?.message || 'Invalid OTP. Try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // ── Login ──
    const handleLogin = async () => {
        if (!form.email || !form.password) return showToast('Email and password required', 'error');
        setLoading(true);
        try {
            const res = await loginUser({ email: form.email.trim().toLowerCase(), password: form.password });
            login(res.data.token, res.data.user);
        } catch (err) {
            showToast(err.response?.data?.message || 'Login failed. Check your credentials.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const stepLabels = ['Basic Info', 'Education', 'Password'];
    const currentStreams = STREAM_OPTIONS[form.education_level] || [];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ position: 'absolute', top: 24, right: 24 }}><LanguageSelector /></div>
            <Toast msg={toast.msg} type={toast.type} />
            <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 30% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 460, position: 'relative' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                        <img src="/logo.png" alt="Lakshyamaarg Logo" style={{ height: '60px', width: '60px', borderRadius: '16px', boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)' }} />
                        <span style={{ fontSize: 36, fontFamily: 'Outfit', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>Lakshyamaarg</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>AI Career Intelligence Platform</p>
                </div>

                <div className="card" style={{ padding: 36 }}>
                    {/* Mode tabs */}
                    {mode !== 'otp' && (
                        <div className="tabs" style={{ marginBottom: 28, width: '100%' }}>
                            <button className={`tab-btn ${mode === 'login' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => { setMode('login'); setStep(1); }}>Login</button>
                            <button className={`tab-btn ${mode === 'register' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => { setMode('register'); setStep(1); }}>Register</button>
                        </div>
                    )}

                    {/* ── LOGIN ── */}
                    {mode === 'login' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            <div>
                                <h2 style={{ fontSize: 22, marginBottom: 4 }}>Welcome back 👋</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Sign in with your email and password</p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input className="form-input" type="email" placeholder="you@email.com"
                                    value={form.email} onChange={e => set('email', e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input className="form-input" type="password" placeholder="Your password"
                                    value={form.password} onChange={e => set('password', e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                            </div>
                            <button className="btn btn-primary" style={{ justifyContent: 'center', padding: '14px' }} onClick={handleLogin} disabled={loading}>
                                {loading ? '⏳ Signing in...' : '→ Sign In'}
                            </button>
                            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                                No account yet?{' '}
                                <span style={{ color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setMode('register')}>Create one free</span>
                            </p>
                        </div>
                    )}

                    {/* ── REGISTER ── */}
                    {mode === 'register' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            <div>
                                <h2 style={{ fontSize: 22, marginBottom: 4 }}>Create Account</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Step {step} of 3 — {stepLabels[step - 1]}</p>
                            </div>

                            {/* Step bar */}
                            <div style={{ display: 'flex', gap: 6 }}>
                                {stepLabels.map((_, i) => (
                                    <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < step ? 'var(--primary)' : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
                                ))}
                            </div>

                            {/* Step 1: Name + Email */}
                            {step === 1 && <>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input className="form-input" placeholder="e.g. Ravi Kumar"
                                        value={form.name} onChange={e => set('name', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input className="form-input" type="email" placeholder="you@email.com"
                                        value={form.email} onChange={e => set('email', e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleRegister()} />
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>📧 Verification OTP will be sent here</p>
                                </div>
                            </>}

                            {/* Step 2: Education + Stream */}
                            {step === 2 && <>
                                <div className="form-group">
                                    <label className="form-label">Highest Qualification</label>
                                    <select style={selectStyle} value={form.education_level} onChange={e => set('education_level', e.target.value)}>
                                        <option value="" style={{ background: '#0f0f1a' }}>Select qualification...</option>
                                        <option value="10th" style={{ background: '#0f0f1a' }}>10th</option>
                                        <option value="11th" style={{ background: '#0f0f1a' }}>11th</option>
                                        <option value="12th" style={{ background: '#0f0f1a' }}>12th</option>
                                        <option value="B.Tech" style={{ background: '#0f0f1a' }}>B.Tech</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        {form.education_level === '10th' ? 'Board Type' : form.education_level === 'B.Tech' ? 'Department' : 'Stream'}
                                    </label>
                                    {!form.education_level ? (
                                        <div style={{ padding: '13px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontSize: 14 }}>
                                            ↑ Select education level first
                                        </div>
                                    ) : (
                                        <select style={selectStyle} value={form.stream} onChange={e => set('stream', e.target.value)}>
                                            <option value="" style={{ background: '#0f0f1a' }}>Select {form.education_level === '10th' ? 'board' : form.education_level === 'B.Tech' ? 'department' : 'stream'}...</option>
                                            {currentStreams.map(s => <option key={s} value={s} style={{ background: '#0f0f1a' }}>{s}</option>)}
                                        </select>
                                    )}
                                </div>
                            </>}

                            {/* Step 3: Password */}
                            {step === 3 && <>
                                <div className="form-group">
                                    <label className="form-label">Create Password</label>
                                    <input className="form-input" type="password" placeholder="Min. 6 characters"
                                        value={form.password} onChange={e => set('password', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Confirm Password</label>
                                    <input className="form-input" type="password" placeholder="Repeat password"
                                        value={form.confirm} onChange={e => set('confirm', e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleRegister()} />
                                    {form.confirm && form.password !== form.confirm && (
                                        <p style={{ fontSize: 12, color: '#f87171', marginTop: 6 }}>⚠️ Passwords do not match</p>
                                    )}
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, padding: '10px 14px' }}>
                                    📧 An OTP will be sent to <strong style={{ color: 'var(--text-secondary)' }}>{form.email}</strong> to verify your account.
                                </div>
                            </>}

                            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                                {step > 1 && <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>← Back</button>}
                                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px' }} onClick={handleRegister} disabled={loading}>
                                    {loading ? '⏳ Sending OTP...' : step === 3 ? '✅ Create Account' : 'Continue →'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── OTP ── */}
                    {mode === 'otp' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 52, marginBottom: 12 }}>📧</div>
                                <h2 style={{ fontSize: 22, marginBottom: 8 }}>Check Your Email</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
                                    We sent a 6-digit OTP to<br />
                                    <strong style={{ color: 'var(--primary-light)' }}>{otpEmail}</strong>
                                </p>
                            </div>



                            <div className="form-group">
                                <label className="form-label">Enter OTP</label>
                                <input className="form-input" placeholder="_ _ _ _ _ _" maxLength={6}
                                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                    onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                                    style={{ textAlign: 'center', letterSpacing: 10, fontSize: 26, fontWeight: 700 }} />
                            </div>
                            <button className="btn btn-primary" style={{ justifyContent: 'center', padding: '14px' }} onClick={handleVerifyOtp} disabled={loading || otp.length !== 6}>
                                {loading ? '⏳ Verifying...' : '✅ Verify Email'}
                            </button>
                            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                                Already verified?{' '}
                                <span style={{ color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setMode('login')}>Login here</span>
                            </p>
                        </div>
                    )}
                </div>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => navigate('landing')}>
                    ← Back to Home
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
