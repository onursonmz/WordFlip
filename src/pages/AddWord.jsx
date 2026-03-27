import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Sparkles, Loader2, Key } from 'lucide-react';
import { useWords } from '../context/WordContext';
import { fetchWordDetailsWithAI } from '../utils/ai';

const AddWord = () => {
    const navigate = useNavigate();
    const { addWord, words } = useWords();
    const [formData, setFormData] = useState({
        englishWord: '',
        wordType: 'noun',
        pronunciation: '',
        exampleSentenceEn: '',
        turkishMeaning: '',
        exampleSentenceTr: ''
    });
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showKeyInput, setShowKeyInput] = useState(false);

    // Anahtarı LocalStorage'da saklayalım
    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setApiKey(savedKey);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveKey = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        setShowKeyInput(false);
    };

    const handleAIAutoFill = async () => {
        if (!formData.englishWord) {
            setError('Lütfen önce bir İngilizce kelime yazın.');
            return;
        }
        if (!apiKey) {
            setShowKeyInput(true);
            setError('Lütfen bir Gemini API Key girin.');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const aiData = await fetchWordDetailsWithAI(formData.englishWord, apiKey);
            setFormData(aiData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.englishWord || !formData.turkishMeaning) {
            setError('İngilizce kelime ve Türkçe anlam alanları zorunludur.');
            return;
        }

        const isDuplicate = words?.some(w => w.englishWord.toLowerCase().trim() === formData.englishWord.toLowerCase().trim());
        if (isDuplicate) {
            setError('Bu kelime zaten kütüphanenizde bulunuyor!');
            return;
        }

        addWord(formData);
        navigate('/');
    };

    return (
        <div className="animate-fade-in">
            <div className="view-header">
                <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ padding: '8px' }}>
                    <ChevronLeft size={24} />
                </button>
                <h2 className="view-title">Yeni Kelime</h2>
            </div>

            <div className="container" style={{ marginBottom: '20px' }}>
                <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    style={{ fontSize: '0.8rem', gap: '4px' }}
                >
                    <Key size={14} />
                    API Anahtarı Ayarları
                </button>

                {showKeyInput && (
                    <div className="animate-fade-in" style={{ marginTop: '10px', background: '#f1f5f9', padding: '15px', borderRadius: '12px' }}>
                        <label style={{ fontSize: '0.8rem' }}>Gemini API Key</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="password"
                                className="input-field"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="AI desteği için anahtar girin..."
                            />
                            <button className="btn btn-primary" onClick={handleSaveKey}>Kaydet</button>
                        </div>
                        <p style={{ fontSize: '0.7rem', marginTop: '8px', color: 'var(--text-muted)' }}>
                            Ücretsiz anahtar almak için: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">Google AI Studio</a>
                        </p>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="container" style={{ paddingBottom: '40px' }}>
                {error && (
                    <div style={{ background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 500 }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'grid', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <label>İngilizce Kelime *</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                name="englishWord"
                                className="input-field"
                                placeholder="Örn: Serendipity"
                                value={formData.englishWord}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className={`btn ${isLoading ? 'btn-ghost' : 'btn-primary'}`}
                                onClick={handleAIAutoFill}
                                disabled={isLoading}
                                style={{ padding: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                            </button>
                        </div>
                    </div>

                    <div style={{ height: '1px', background: 'var(--border)', opacity: 0.5 }}></div>

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
                            placeholder="Örn: /ˌserənˈdipədē/"
                            value={formData.pronunciation}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>İngilizce Örnek Cümle</label>
                        <textarea
                            name="exampleSentenceEn"
                            className="input-field"
                            placeholder="Cümle içinde kullanımı..."
                            rows="2"
                            value={formData.exampleSentenceEn}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div style={{ height: '1px', background: 'var(--border)', margin: '5px 0' }}></div>

                    <div>
                        <label>Türkçe Anlam *</label>
                        <input
                            type="text"
                            name="turkishMeaning"
                            className="input-field"
                            placeholder="Örn: Beklenmedik anda gelen şans"
                            value={formData.turkishMeaning}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Türkçe Örnek Cümle</label>
                        <textarea
                            name="exampleSentenceTr"
                            className="input-field"
                            placeholder="Cümlenin çevirisi..."
                            rows="2"
                            value={formData.exampleSentenceTr}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', padding: '16px' }}>
                        <Save size={20} />
                        Kelimeyi Kaydet
                    </button>
                </div>
            </form>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default AddWord;
