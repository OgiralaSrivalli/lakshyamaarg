import React, { useEffect, useState } from 'react';

const LanguageSelector = () => {
    const [lang, setLang] = useState('en');

    useEffect(() => {
        const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
        if (match) {
            const val = match[2].split('/');
            if (val.length > 2) setLang(val[2]);
        }
    }, []);

    const handleLanguageChange = (e) => {
        const selected = e.target.value;
        setLang(selected);
        localStorage.setItem('preferredLang', selected);
        window.dispatchEvent(new Event('languageChange'));

        const googleSelect = document.querySelector('.goog-te-combo');
        if (googleSelect) {
            googleSelect.value = selected;
            googleSelect.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        } else {
            document.cookie = `googtrans=/en/${selected}; path=/;`;
            window.location.reload();
        }
    };

    const languages = [
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
    ];

    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px', fontSize: '18px' }}>🌐</span>
            <select
                value={lang}
                onChange={handleLanguageChange}
                style={{
                    appearance: 'none',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    color: '#f1f1f8',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '6px 28px 6px 12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    outline: 'none',
                    fontFamily: 'Outfit, sans-serif',
                    transition: 'all 0.2s'
                }}
            >
                {languages.map(l => (
                    <option key={l.code} style={{ background: '#0a0a0f', color: '#fff' }} value={l.code}>{l.name}</option>
                ))}
            </select>
            <div style={{
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                pointerEvents: 'none', fontSize: '10px', color: '#a0a0b8'
            }}>
                ▼
            </div>
            <style>{`
                /* Hide the google branding popup */
                iframe.goog-te-banner-frame { display: none !important; }
                body { top: 0 !important; }
                .goog-te-balloon-frame { display: none !important; }
            `}</style>
        </div>
    );
};

export default LanguageSelector;
