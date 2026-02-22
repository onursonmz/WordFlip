import React, { useState } from 'react';
import Header from '../components/Header';
import WordList from '../components/WordList';
import FAB from '../components/FAB';
import { useWords } from '../context/WordContext';

const Home = () => {
    const { words } = useWords();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all'); // all, favorites, study

    const filteredWords = words.filter(word => {
        const matchesSearch = word.englishWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
            word.turkishMeaning.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

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
            <WordList words={filteredWords} activeFilter={activeFilter} />
            <FAB />
        </main>
    );
};

export default Home;
