import React, { useState, useEffect } from 'react';
import WordCard from './WordCard';
import { useWords } from '../context/WordContext';
import { X, Check } from 'lucide-react';

const SwipeableCard = ({ word, onSwipeLeft, onSwipeRight, isTop, zIndex }) => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const handleTouchStart = (e) => {
        if (!isTop) return;
        // avoid dragging if they tap on a button inside card-actions
        if (e.target.closest('button') || e.target.closest('.action-btn')) return;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setStartPos({ x: clientX, y: clientY });
        setDragging(true);
    };

    const handleTouchMove = (e) => {
        if (!dragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setOffset({
            x: clientX - startPos.x,
            y: clientY - startPos.y
        });
    };

    const handleTouchEnd = () => {
        if (!dragging) return;
        setDragging(false);
        if (offset.x > 100) {
            onSwipeRight();
        } else if (offset.x < -100) {
            onSwipeLeft();
        } else {
            setOffset({ x: 0, y: 0 }); // snap back
        }
    };

    const rotate = offset.x * 0.05;
    
    // Scale down cards behind the top one
    const calcScale = isTop ? 1 : 1 - (Math.abs(zIndex) * 0.05);
    const translateY = isTop ? offset.y : offset.y + (Math.abs(zIndex) * 15);
    
    return (
        <div
            style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, 
                height: '360px',
                zIndex: zIndex,
                transform: `translateX(${offset.x}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${calcScale})`,
                transition: dragging ? 'none' : 'transform 0.3s ease-out',
                opacity: isTop ? 1 : (zIndex >= -3 ? 1 - (Math.abs(zIndex) * 0.2) : 0),
                pointerEvents: isTop ? 'auto' : 'none',
                touchAction: 'none' // Prevent default scroll when swiping
            }}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <WordCard word={word} />
            
            {/* Tinder style overlay tags */}
            {isTop && Math.abs(offset.x) > 30 && (
                <div style={{
                    position: 'absolute',
                    top: '30px',
                    left: offset.x > 0 ? '30px' : 'auto',
                    right: offset.x < 0 ? '30px' : 'auto',
                    border: `4px solid ${offset.x > 0 ? '#10b981' : '#ef4444'}`,
                    color: offset.x > 0 ? '#10b981' : '#ef4444',
                    background: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    padding: '5px 15px',
                    borderRadius: '12px',
                    transform: `rotate(${offset.x > 0 ? '-15deg' : '15deg'})`,
                    opacity: Math.min(Math.abs(offset.x) / 100, 1),
                    zIndex: 20,
                    pointerEvents: 'none',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                    {offset.x > 0 ? 'EZBERLENDİ' : 'GEÇ'}
                </div>
            )}
        </div>
    );
};

const WordList = ({ words, activeFilter }) => {
    const { markMemorized } = useWords();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Reset when filter or list source completely changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [activeFilter, words.length]);

    const emptyMessages = {
        all: "Henüz kelime eklenmemiş veya eklenecek kelime kalmamış!",
        favorites: "Henüz favori kelimeniz yok. Yıldız ikonuna basarak ekleyebilirsiniz!",
        study: "Çalışma listeniz boş. Tekrar etmek istediğiniz kelimeleri buraya ekleyin!",
        memorized: "Henüz hiç kelime ezberlemedin. Sağa kaydırarak kelimeleri buraya gönderebilirsin!"
    };

    if (words.length === 0) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)', height: '50vh'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📚</div>
                <h3 style={{ marginBottom: '10px' }}>Listeniz Boş</h3>
                <p style={{ maxWidth: '280px' }}>{emptyMessages[activeFilter]}</p>
            </div>
        );
    }

    if (currentIndex >= words.length) {
        return (
             <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', height: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                 <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
                 <h2 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Harikasın!</h2>
                 <p>Bu destenin sonuna geldin. Sayfayı yenileyerek listeyi baştan çalışabilirsin.</p>
                 <button onClick={() => setCurrentIndex(0)} className="btn btn-primary" style={{ marginTop: '20px', alignSelf: 'center' }}>Baştan Başla</button>
             </div>
        );
    }

    const onSwipeLeft = () => {
        if (activeFilter === 'memorized') {
            // Ezberlenenler sekmesinde sola kaydırma "ezberden çıkar" anlamına gelir
            markMemorized(words[currentIndex].id, false);
        }
        setCurrentIndex(prev => prev + 1);
    };

    const onSwipeRight = () => {
        if (activeFilter !== 'memorized') {
            markMemorized(words[currentIndex].id, true);
        }
        setCurrentIndex(prev => prev + 1);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
            <div style={{ position: 'relative', height: '380px', width: '100%', margin: '0 auto' }}>
                {words.map((word, index) => {
                    if (index < currentIndex) return null; // already swiped
                    if (index > currentIndex + 3) return null; // too far behind

                    const isTop = index === currentIndex;
                    const zIndex = -(index - currentIndex);

                    return (
                        <SwipeableCard
                            key={word.id}
                            word={word}
                            isTop={isTop}
                            zIndex={zIndex}
                            onSwipeLeft={onSwipeLeft}
                            onSwipeRight={onSwipeRight}
                        />
                    );
                }).reverse() // Top card rendered last safely
                }
            </div>

            {/* Bottom Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '10px' }}>
                 <button onClick={onSwipeLeft} style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'white', color: '#ef4444', border: 'none', boxShadow: '0 8px 15px rgba(239, 68, 68, 0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                     <X size={36} strokeWidth={3} />
                 </button>
                 <button onClick={onSwipeRight} style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'white', color: '#10b981', border: 'none', boxShadow: '0 8px 15px rgba(16, 185, 129, 0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                     <Check size={36} strokeWidth={3} />
                 </button>
            </div>
            
            <div className="progress-container">
                <div className="progress-text">
                    {currentIndex + 1} / {words.length}
                </div>
                <div className="progress-bar-bg" style={{ width: '150px' }}>
                    <div className="progress-bar-fill" style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default WordList;
