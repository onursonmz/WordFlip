import React, { useState } from 'react';
import Header from '../components/Header';
import WordList from '../components/WordList';
import FAB from '../components/FAB';
import { useWords } from '../context/WordContext';
import { Loader2 } from 'lucide-react';

const Home = () => {
    const { words, loadingWords } = useWords();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all'); // all, favorites, study, memorized

    const filteredWords = words.filter(word => {
        const matchesSearch = word.englishWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
            word.turkishMeaning.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeFilter === 'memorized') return word.isMemorized;
        if (word.isMemorized) return false; // Ezberlenenler diğer listelerde görünmesin

        if (activeFilter === 'favorites') return word.isFavorite;
        if (activeFilter === 'study') return word.isInStudyList;

        return true;
    });

    return (
        <main>
            <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
            />
            {loadingWords ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--primary)' }}>
                    <Loader2 className="animate-spin" size={40} style={{ marginBottom: '10px' }} />
                    <p style={{ fontWeight: 500 }}>Kelimeler yükleniyor...</p>
                </div>
            ) : (
                <WordList words={filteredWords} activeFilter={activeFilter} />
            )}
            <FAB />
            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </main>
    );
};

export default Home;
