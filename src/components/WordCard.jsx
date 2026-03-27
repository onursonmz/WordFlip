import React, { useState } from 'react';
import { Heart, Edit3, Trash2, Volume2, Bookmark } from 'lucide-react';
import { useWords } from '../context/WordContext';
import { useNavigate } from 'react-router-dom';

const WordCard = ({ word }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const { toggleFavorite, toggleStudyList, deleteWord } = useWords();
    const navigate = useNavigate();

    const handleCardClick = (e) => {
        if (e.target.closest('.card-actions')) return;
        setIsFlipped(!isFlipped);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        navigate(`/edit/${word.id}`);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Bu kelimeyi silmek istediğinize emin misiniz?')) {
            deleteWord(word.id);
        }
    };

    const handleFavorite = (e) => {
        e.stopPropagation();
        toggleFavorite(word.id);
    };

    const handleStudyList = (e) => {
        e.stopPropagation();
        toggleStudyList(word.id);
    };

    return (
        <div className={`card-container ${isFlipped ? 'is-flipped' : ''}`} onClick={handleCardClick} style={{ height: '100%' }}>
            <div className="card-inner">
                {/* Front Side */}
                <div className="card-front" style={{ border: `3px solid ${word.addedByColor || 'var(--border)'}` }}>
                    <div className="card-header">
                        <span className="word-type">{word.wordType}</span>
                        <div className="card-actions">
                            <button
                                className={`action-btn study ${word.isInStudyList ? 'active' : ''}`}
                                onClick={handleStudyList}
                                title="Çalışma Listesi"
                            >
                                <Bookmark size={20} fill={word.isInStudyList ? 'currentColor' : 'none'} />
                            </button>
                            <button
                                className={`action-btn ${word.isFavorite ? 'favorite' : ''}`}
                                onClick={handleFavorite}
                                title="Favori"
                            >
                                <Heart size={20} fill={word.isFavorite ? 'currentColor' : 'none'} />
                            </button>
                        </div>
                    </div>

                    <div className="card-body">
                        <h2 className="english-word">{word.englishWord}</h2>
                        <div className="pronunciation">
                            <Volume2 size={16} />
                            <span>{word.pronunciation}</span>
                        </div>
                        <p className="example-sentence">"{word.exampleSentenceEn}"</p>
                    </div>

                    <div className="card-footer" style={{ position: 'relative' }}>
                        <span className="hint">Öğrenmek için dokun</span>
                        {word.addedByName && (
                            <div style={{ position: 'absolute', bottom: '-10px', right: '-15px', background: word.addedByColor || 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                {word.addedByName.split(' ')[0]}
                            </div>
                        )}
                    </div>
                </div>

                {/* Back Side */}
                <div className="card-back" style={{ border: `3px solid ${word.addedByColor || 'var(--border)'}` }}>
                    <div className="card-header">
                        <span className="word-type-tr">{word.wordType === 'noun' ? 'isim' : word.wordType === 'verb' ? 'fiil' : word.wordType === 'adjective' ? 'sıfat' : word.wordType === 'adverb' ? 'zarf' : 'kalıp'}</span>
                        <div className="card-actions">
                            <button className="action-btn edit" onClick={handleEdit}><Edit3 size={18} /></button>
                            <button className="action-btn delete" onClick={handleDelete}><Trash2 size={18} /></button>
                        </div>
                    </div>

                    <div className="card-body">
                        <h2 className="turkish-meaning">{word.turkishMeaning}</h2>
                        <p className="example-sentence-tr">{word.exampleSentenceTr}</p>
                    </div>

                    <div className="card-footer" style={{ position: 'relative' }}>
                        <span className="hint">Geri dönmek için dokun</span>
                        {word.addedByName && (
                            <div style={{ position: 'absolute', bottom: '-10px', right: '-15px', background: word.addedByColor || 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                {word.addedByName.split(' ')[0]}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WordCard;
