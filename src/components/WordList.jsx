import React, { useRef, useState, useEffect } from 'react';
import WordCard from './WordCard';

const WordList = ({ words, activeFilter }) => {
    const containerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Sync index when list changes
    useEffect(() => {
        setCurrentIndex(0);
        if (containerRef.current) {
            containerRef.current.scrollLeft = 0;
        }
    }, [words.length, activeFilter]);

    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollLeft, offsetWidth } = containerRef.current;
            const index = Math.round(scrollLeft / offsetWidth);
            if (index !== currentIndex) {
                setCurrentIndex(index);
            }
        }
    };
    //deneme
    const emptyMessages = {
        all: "Henüz kelime eklenmemiş. Yeni kelimeler ekleyerek başlayın!",
        favorites: "Henüz favori kelimeniz yok. Yıldız ikonuna basarak ekleyebilirsiniz!",
        study: "Çalışma listeniz boş. Tekrar etmek istediğiniz kelimeleri buraya ekleyin!"
    };

    if (words.length === 0) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                height: '60vh'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                    {activeFilter === 'favorites' ? '❤️' : activeFilter === 'study' ? '📌' : '📚'}
                </div>
                <h3 style={{ marginBottom: '10px' }}>Listeniz Boş</h3>
                <p style={{ maxWidth: '280px' }}>{emptyMessages[activeFilter]}</p>
            </div>
        );
    }

    const progressPercent = ((currentIndex + 1) / words.length) * 100;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
            <div
                ref={containerRef}
                className="swiper-container"
                onScroll={handleScroll}
            >
                {words.map((word) => (
                    <div key={word.id} className="swiper-item">
                        <WordCard word={word} />
                    </div>
                ))}
            </div>

            <div className="progress-container">
                <div className="progress-text">
                    {currentIndex + 1} / {words.length}
                </div>
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default WordList;
