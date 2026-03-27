import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut, Copy, UserPlus, CheckCircle } from 'lucide-react';

const Profile = () => {
    const { user, userData, updateGroup, logout } = useAuth();
    const navigate = useNavigate();
    const [joinId, setJoinId] = useState('');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(user.uid);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleJoinGroup = async () => {
        if (joinId.trim() === '') return;
        await updateGroup(joinId);
        setJoinId('');
        alert("Arkadaş grubuna başarıyla bağlandınız! Ana sayfadan 'Ortak Grup' sekmesine geçebilirsiniz.");
        navigate('/');
    };

    if (!userData) return null;

    return (
        <div className="animate-fade-in container" style={{ padding: '20px 20px' }}>
            <div className="view-header" style={{ padding: '10px 0', border: 'none', background: 'transparent' }}>
                <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ padding: '8px' }}>
                    <ChevronLeft size={24} />
                    Geri
                </button>
            </div>

            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%', background: userData.color, color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto',
                    backgroundImage: userData.photoURL ? `url(${userData.photoURL})` : 'none',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    border: `4px solid ${userData.color}`
                }}>
                    {!userData.photoURL && userData.displayName.charAt(0).toUpperCase()}
                </div>
                <h2 style={{ marginTop: '10px' }}>{userData.displayName}</h2>
                <p style={{ color: 'var(--text-muted)' }}>{userData.email}</p>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Arkadaşlarını Davet Et
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Arkadaşlarına senin kelime grubuna katılmaları için kendi ID'ni kopyalayıp gönder. Maksimum 5 kişi tavsiye edilir.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" className="input-field" readOnly value={user.uid} style={{ flex: 1, fontSize: '0.8rem', opacity: 0.7 }} />
                    <button className="btn btn-primary" onClick={handleCopy} style={{ padding: '10px' }}>
                        {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                    </button>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '15px' }}>
                    Bir Gruba Bağlan
                </h3>
                
                {userData.friendGroupId && (
                    <div style={{ background: '#fdf2f8', padding: '15px', borderRadius: '12px', color: '#be185d', marginBottom: '15px', fontSize: '0.85rem' }}>
                        Şu anda bir gruba kayıtlısınız. Başka bir ID girerek grubu değiştirebilirsiniz.
                    </div>
                )}
                
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Bir arkadaşının ortak kelime havuzuna dahil olmak için onun ID'sini yapıştır.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Arkadaşının ID'si..." 
                        value={joinId}
                        onChange={(e) => setJoinId(e.target.value)}
                        style={{ flex: 1 }} 
                    />
                    <button className="btn btn-primary" onClick={handleJoinGroup} style={{ padding: '10px 15px' }}>
                        <UserPlus size={20} />
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                <button 
                    className="btn btn-ghost" 
                    style={{ width: '100%', color: '#64748b' }}
                    onClick={async () => { await logout(); navigate('/login'); }} 
                >
                    <LogOut size={20} />
                    Çıkış Yap
                </button>

                <button 
                    className="btn btn-ghost" 
                    style={{ width: '100%', color: '#ef4444', fontSize: '0.8rem', marginTop: '10px', opacity: 0.8 }}
                    onClick={() => {
                        const confirmDelete = window.confirm("Hesabınızı ve tüm verilerinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.");
                        if (confirmDelete) {
                            deleteAccount();
                        }
                    }}
                >
                    Hesabımı ve Tüm Verilerimi Kalıcı Olarak Sil
                </button>
            </div>
        </div>
    );
};

export default Profile;
