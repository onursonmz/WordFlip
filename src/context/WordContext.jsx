import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getWords, saveWords } from '../utils/storage';

const WordContext = createContext();

export const useWords = () => {
    const context = useContext(WordContext);
    if (!context) {
        throw new Error('useWords must be used within a WordProvider');
    }
    return context;
};

export const WordProvider = ({ children }) => {
    // Initialize state directly from LocalStorage to avoid initial mount wipe
    const [words, setWords] = useState(() => getWords());
    const [isInitialized, setIsInitialized] = useState(false);

    // Save words to LocalStorage whenever they change, but skip the very first load
    useEffect(() => {
        if (isInitialized) {
            saveWords(words);
        } else {
            setIsInitialized(true);
        }
    }, [words, isInitialized]);

    const addWord = (wordData) => {
        const newWord = {
            ...wordData,
            id: uuidv4(),
            isFavorite: false,
            isInStudyList: false,
            createdAt: new Date().toISOString(),
        };
        setWords((prev) => [newWord, ...prev]);
    };

    const updateWord = (id, updatedData) => {
        setWords((prev) =>
            prev.map((word) => (word.id === id ? { ...word, ...updatedData } : word))
        );
    };

    const deleteWord = (id) => {
        setWords((prev) => prev.filter((word) => word.id !== id));
    };

    const toggleFavorite = (id) => {
        setWords((prev) =>
            prev.map((word) =>
                word.id === id ? { ...word, isFavorite: !word.isFavorite } : word
            )
        );
    };

    const toggleStudyList = (id) => {
        setWords((prev) =>
            prev.map((word) =>
                word.id === id ? { ...word, isInStudyList: !word.isInStudyList } : word
            )
        );
    };

    return (
        <WordContext.Provider
            value={{
                words,
                addWord,
                updateWord,
                deleteWord,
                toggleFavorite,
                toggleStudyList,
            }}
        >
            {children}
        </WordContext.Provider>
    );
};
