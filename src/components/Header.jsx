import React from 'react';
import { Search, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWords } from '../context/WordContext';

const Header = ({ searchQuery, setSearchQuery, activeFilter, setActiveFilter }) => {
    const filters = [
        { id: 'all', label: 'Öğrenilecekler' },
        { id: 'favorites', label: 'Favoriler' },
        { id: 'study', label: 'Çalışma Listesi' },
        { id: 'memorized', label: 'Ezberlenenler' }
    ];
    const navigate = useNavigate();
    const { userData } = useAuth();
    const { currentMode, setCurrentMode } = useWords();

    return (
        <header className="view-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="view-title" style={{ color: 'var(--primary)', letterSpacing: '-0.5px' }}>WordFlip</h1>
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button className="btn btn-ghost" style={{ padding: '8px', borderRadius: '50%', background: '#ffedd5', color: '#ea580c' }} onClick={() => navigate('/game')} title="Oyun Modu">
                        <Gamepad2 size={24} />
                    </button>
                    
                    <button className="btn btn-ghost" style={{ padding: '4px', borderRadius: '50%' }} onClick={() => navigate('/profile')}>
                        {userData ? (
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: userData.color || 'var(--primary)', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: '16px', border: '2px solid white',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}>
                               {userData.displayName?.charAt(0).toUpperCase()}
                            </div>
                        ) : (
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ccc' }}></div>
                        )}
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '12px', marginTop: '5px' }}>
                <button 
                    onClick={() => setCurrentMode('personal')}
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: currentMode === 'personal' ? 'white' : 'transparent', fontWeight: 600, color: currentMode === 'personal' ? 'var(--primary)' : 'var(--text-muted)', boxShadow: currentMode === 'personal' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' }}
                >
                    Şahsi Kelimelerim
                </button>
                <button 
                    onClick={() => {
                        if (!userData?.friendGroupId) {
                            alert('Henüz bir arkadaşınıza bağlanmadınız. Öncelikle profil sayfasına giderek bir ID girin.');
                            navigate('/profile');
                        } else {
                            setCurrentMode('group');
                        }
                    }}
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: currentMode === 'group' ? 'white' : 'transparent', fontWeight: 600, color: currentMode === 'group' ? 'var(--primary)' : 'var(--text-muted)', boxShadow: currentMode === 'group' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' }}
                >
                    Ortak Grup
                </button>
            </div>

            <div style={{ position: 'relative', marginTop: '10px' }}>
                <Search
                    size={20}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                    type="text"
                    placeholder="Kelime veya anlam ara..."
                    className="input-field"
                    style={{ paddingLeft: '44px' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="filter-tabs" style={{ marginTop: '5px' }}>
                {filters.map(filter => (
                    <button
                        key={filter.id}
                        className={`filter-tag ${activeFilter === filter.id ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter.id)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </header>
    );
};

export default Header;
