import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const { signInWithGoogle, loading, user, loginAsGuest } = useAuth();
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    // Eğer kullanıcı zaten giriş yaptıysa ana sayfaya gönder
    React.useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogin = async () => {
        setLoginError('');
        try {
            await signInWithGoogle();
            navigate('/');
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/popup-blocked') {
                setLoginError('Tarayıcınız pop-up pencereleri engelledi. Lütfen izin verin.');
            } else if (error.code === 'auth/configuration-not-found' || error.message.includes('configuration')) {
                setLoginError('Firebase Console üzerinde Authentication -> Google girişi aktif edilmemiş gibi görünüyor.');
            } else {
                setLoginError('Giriş başarısız: ' + error.message);
            }
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                <Loader2 className="animate-spin" size={40} color="var(--primary)" />
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: '20px',
            textAlign: 'center'
        }} className="animate-fade-in">
            <h1 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '10px' }}>WordFlip</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', maxWidth: '300px' }}>
                Kelimelerinizi bulutta saklayın ve arkadaşlarınızla ortak listeler oluşturun.
            </p>

            {loginError && (
                <div style={{ background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 500, maxWidth: '300px' }}>
                    {loginError}
                </div>
            )}
            
            <button 
                onClick={handleLogin}
                className="btn btn-primary"
                style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '50px', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}
            >
                <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '24px', marginRight: '10px', background: 'white', borderRadius: '50%', padding: '2px' }} />
                Google ile Giriş Yap
            </button>

            <button 
                onClick={loginAsGuest}
                className="btn btn-ghost"
                style={{ marginTop: '20px', padding: '10px 20px', fontSize: '0.95rem' }}
            >
                Misafir Olarak Devam Et
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '5px', maxWidth: '280px' }}>
                *Misafir olarak girdiğinizde kelimeler sadece bu cihazda tutulur ve tarayıcıyı sıfırladığınızda silinir.
            </p>
        </div>
    );
};

export default Login;
