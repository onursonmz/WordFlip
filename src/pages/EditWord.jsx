import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, Trash2 } from 'lucide-react';
import { useWords } from '../context/WordContext';

const EditWord = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { words, updateWord, deleteWord } = useWords();

    const [formData, setFormData] = useState({
        englishWord: '',
        wordType: 'noun',
        pronunciation: '',
        exampleSentenceEn: '',
        turkishMeaning: '',
        exampleSentenceTr: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const wordToEdit = words.find(w => w.id === id);
        if (wordToEdit) {
            setFormData({
                englishWord: wordToEdit.englishWord || '',
                wordType: wordToEdit.wordType || 'noun',
                pronunciation: wordToEdit.pronunciation || '',
                exampleSentenceEn: wordToEdit.exampleSentenceEn || '',
                turkishMeaning: wordToEdit.turkishMeaning || '',
                exampleSentenceTr: wordToEdit.exampleSentenceTr || ''
            });
        } else {
            navigate('/');
        }
    }, [id, words, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.englishWord || !formData.turkishMeaning) {
            setError('İngilizce kelime ve Türkçe anlam alanları zorunludur.');
            return;
        }
        updateWord(id, formData);
        navigate('/');
    };

    const handleDelete = () => {
        if (window.confirm('Bu kelimeyi kalıcı olarak silmek istediğinize emin misiniz?')) {
            deleteWord(id);
            navigate('/');
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="view-header">
                <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ padding: '8px' }}>
                    <ChevronLeft size={24} />
                </button>
                <h2 className="view-title">Kelimeyi Düzenle</h2>
            </div>

            <form onSubmit={handleSubmit} className="container" style={{ paddingBottom: '40px' }}>
                {error && (
                    <div style={{ background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 500 }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'grid', gap: '20px' }}>
                    <div>
                        <label>İngilizce Kelime *</label>
                        <input
                            type="text"
                            name="englishWord"
                            className="input-field"
                            value={formData.englishWord}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Kelime Türü</label>
                        <select
                            name="wordType"
                            className="input-field"
                            value={formData.wordType}
                            onChange={handleChange}
                        >
                            <option value="noun">Noun (İsim)</option>
                            <option value="verb">Verb (Fiil)</option>
                            <option value="adjective">Adjective (Sıfat)</option>
                            <option value="adverb">Adverb (Zarf)</option>
                            <option value="phrase">Phrase (Kalıp)</option>
                        </select>
                    </div>

                    <div>
                        <label>Okunuş (Phonetic)</label>
                        <input
                            type="text"
                            name="pronunciation"
                            className="input-field"
                            value={formData.pronunciation}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>İngilizce Örnek Cümle</label>
                        <textarea
                            name="exampleSentenceEn"
                            className="input-field"
                            rows="3"
                            value={formData.exampleSentenceEn}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div style={{ height: '1px', background: 'var(--border)', margin: '10px 0' }}></div>

                    <div>
                        <label>Türkçe Anlam *</label>
                        <input
                            type="text"
                            name="turkishMeaning"
                            className="input-field"
                            value={formData.turkishMeaning}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Türkçe Örnek Cümle</label>
                        <textarea
                            name="exampleSentenceTr"
                            className="input-field"
                            rows="3"
                            value={formData.exampleSentenceTr}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                        <button type="button" onClick={handleDelete} className="btn" style={{ flex: 1, padding: '16px', color: '#ef4444', background: '#fee2e2', border: 'none', borderRadius: '12px' }}>
                            <Trash2 size={20} />
                            Sil
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '16px' }}>
                            <Save size={20} />
                            Değişiklikleri Kaydet
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditWord;
