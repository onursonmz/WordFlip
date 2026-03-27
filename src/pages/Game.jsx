import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw, Trophy } from 'lucide-react';
import { useWords } from '../context/WordContext';

const shuffle = (array) => {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const balloonColors = ['#ef4444', '#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

const Game = () => {
    const navigate = useNavigate();
    const { words } = useWords();
    
    const [currentBatch, setCurrentBatch] = useState([]);
    const [turkishTargets, setTurkishTargets] = useState([]);
    const [selectedEng, setSelectedEng] = useState(null);
    const [matchedIds, setMatchedIds] = useState([]);
    const [errorId, setErrorId] = useState(null);
    const [score, setScore] = useState(0);

    const loadNewBatch = () => {
        const available = shuffle(words).slice(0, 5);
        setCurrentBatch(available);
        setTurkishTargets(shuffle(available));
        setMatchedIds([]);
        setSelectedEng(null);
    };

    useEffect(() => {
        if (words && words.length >= 5) {
            loadNewBatch();
        }
    }, [words.length]);

    const handleEngClick = (id) => {
        if (matchedIds.includes(id)) return;
        setSelectedEng(selectedEng === id ? null : id);
        setErrorId(null);
    };

    const handleTrClick = (id) => {
        if (matchedIds.includes(id)) return;
        if (!selectedEng) return;

        if (id === selectedEng) {
            // Eşleşti -> Pop animasyonu tetikle ve listeye al
            setMatchedIds(prev => [...prev, id]);
            setSelectedEng(null);
            setScore(s => s + 10);
            
            if (matchedIds.length + 1 === currentBatch.length) {
                setTimeout(() => {
                    loadNewBatch();
                }, 1000);
            }
        } else {
            // Yanlış eşleşme -> Titreme efekti
            setErrorId(id);
            setTimeout(() => setErrorId(null), 500);
        }
    };

    if (words.length < 5) {
        return (
             <div className="container animate-fade-in" style={{ padding: '20px', textAlign: 'center' }}>
                <div className="view-header" style={{ marginBottom: '40px', background: 'transparent', border: 'none' }}>
                    <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ padding: '8px' }}>
                        <ChevronLeft size={24} />
                    </button>
                    <h2>Balon Patlatma</h2>
                </div>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎈</div>
                <p style={{ color: 'var(--text-muted)' }}>Bu harika oyunu oynayabilmek için listende en az 5 kelimen olmalı!</p>
             </div>
        );
    }

    return (
        <div className="animate-fade-in container" style={{ padding: '20px', minHeight: '100vh', background: '#f8fafc' }}>
            <div className="view-header" style={{ marginBottom: '20px', background: 'transparent', border: 'none' }}>
                <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ padding: '8px' }}>
                    <ChevronLeft size={24} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, color: 'var(--primary)' }}>
                    <Trophy size={20} color="#f59e0b" />
                    <span>{score} Puan</span>
                </div>
            </div>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '30px' }}>
                Önce ingilizce balonu tut, sonra eşleştiği Türkçe kelimenin kutusuna dokun! 🎈
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                {/* Sol Taraf - İngilizce Balonlar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                    {currentBatch.map((word, index) => {
                        const isMatched = matchedIds.includes(word.id);
                        const isSelected = selectedEng === word.id;
                        const color = balloonColors[index % balloonColors.length];

                        return (
                            <div 
                                key={`eng-${word.id}`}
                                onClick={() => handleEngClick(word.id)}
                                className={`balloon ${isMatched ? 'popped' : ''} ${isSelected ? 'selected' : ''}`}
                                style={{
                                    background: `linear-gradient(135deg, ${color} 0%, #00000040 200%)`, // Parlaklık hissi
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    padding: '15px 10px',
                                    borderRadius: '50% 50% 50% 10%', // Balon şekli
                                    textAlign: 'center',
                                    boxShadow: isSelected ? `0 0 15px ${color}` : '0 4px 6px rgba(0,0,0,0.1)',
                                    transform: isSelected ? 'scale(1.1) translateY(-5px)' : 'scale(1)',
                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    opacity: isMatched ? 0 : 1,
                                    visibility: isMatched ? 'hidden' : 'visible', // Animasyondan sonra gizle
                                    cursor: 'pointer',
                                    wordBreak: 'break-word',
                                    position: 'relative'
                                }}
                            >
                                {word.englishWord}
                                {/* Balon ipi detayı */}
                                <div style={{ position: 'absolute', bottom: '-15px', left: '10px', width: '2px', height: '15px', background: '#94a3b8', transform: 'rotate(-20deg)', opacity: isMatched ? 0 : 1 }}></div>
                            </div>
                        );
                    })}
                </div>

                {/* Sağ Taraf - Türkçe Anlam Kutuları */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, paddingLeft: '20px' }}>
                    {turkishTargets.map((word) => {
                        const isMatched = matchedIds.includes(word.id);
                        const isError = errorId === word.id;
                        const isTargetHover = selectedEng !== null; // Eğer bir balon tutuluyorsa kutular belirginleşsin

                        return (
                            <div 
                                key={`tr-${word.id}`}
                                onClick={() => handleTrClick(word.id)}
                                className={isError ? 'shake-animation' : ''}
                                style={{
                                    background: isMatched ? '#10b981' : 'white',
                                    color: isMatched ? 'white' : 'var(--text-color)',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                    border: isTargetHover ? '2px dashed rgba(0,0,0,0.1)' : '2px solid transparent',
                                    transition: 'all 0.3s',
                                    opacity: isMatched ? 0 : 1, // tamamen eşleşince kaybolsun (balon patlayınca o da gitsin)
                                    visibility: isMatched ? 'hidden' : 'visible',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '40px'
                                }}
                            >
                                {word.turkishMeaning}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ textAlign: 'center', margin: '40px 0' }}>
                 <button className="btn btn-ghost" onClick={loadNewBatch} style={{color: 'var(--text-muted)'}}>
                     <RefreshCw size={18} style={{marginRight: '8px'}} /> Başka Kelimeler Getir
                 </button>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .shake-animation {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                    background: #fee2e2 !important;
                    color: #ef4444 !important;
                }
                
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }

                .popped {
                    animation: pop 0.4s ease-out forwards;
                }

                @keyframes pop {
                    0% { transform: scale(1.1); filter: brightness(1.2); }
                    50% { transform: scale(1.4); opacity: 0.8; }
                    100% { transform: scale(0); opacity: 0; }
                }
            `}} />
        </div>
    );
};

export default Game;
