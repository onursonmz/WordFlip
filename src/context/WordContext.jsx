import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const WordContext = createContext();

export const useWords = () => {
    const context = useContext(WordContext);
    if (!context) {
        throw new Error('useWords must be used within a WordProvider');
    }
    return context;
};

export function WordProvider({ children }) {
    const [words, setWords] = useState([]);
    const [currentMode, setCurrentMode] = useState('personal'); // 'personal' or 'group'
    const { user, userData } = useAuth();
    const [loadingWords, setLoadingWords] = useState(true);

    const getLocalWords = () => {
        return JSON.parse(localStorage.getItem('wordflip_guest_words') || '[]');
    };

    const saveLocalWords = (newWords) => {
        localStorage.setItem('wordflip_guest_words', JSON.stringify(newWords));
        
        // Stabil rastgelelik için bir kez shuffle edilebilir veya doğrudan array state'ı güncellenir.
        // Hızlı render bozulmasını önlemek için sadece array'i set ediyoruz.
        // Kullanıcı rastgele istese de her update'de yerlerinin değişmemesi gerekir, 
        // bu yüzden sıralamayı lokal olarak da sabit tutmak önemlidir. 
        setWords([...newWords].sort(() => Math.random() - 0.5));
    };

    useEffect(() => {
        if (!user || !userData) {
            setWords([]);
            setLoadingWords(false);
            return;
        }

        if (user.isGuest) {
            setLoadingWords(true);
            saveLocalWords(getLocalWords());
            setLoadingWords(false);
            return;
        }

        let targetGroupId = user.uid; // "personal" mode uses their own uid
        if (currentMode === 'group' && userData.friendGroupId) {
            targetGroupId = userData.friendGroupId;
        }

        setLoadingWords(true);
        const wordsRef = collection(db, 'words');
        const q = query(wordsRef, where('groupId', '==', targetGroupId));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedWords = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Kullanıcının isteği üzerine kelimeleri karıştırarak gösteriyoruz.
            // Fakat her onSnapshot da kartlar zıplamasın diye stabil bir algoritma yerine basit bir shuffle.
            for (let i = fetchedWords.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [fetchedWords[i], fetchedWords[j]] = [fetchedWords[j], fetchedWords[i]];
            }

            setWords(fetchedWords);
            setLoadingWords(false);
        }, (error) => {
            console.error('Error fetching words from Firestore:', error);
            setLoadingWords(false);
        });

        return () => unsubscribe();
    }, [user, userData?.friendGroupId, currentMode]);

    const addWord = async (wordData) => {
        if (!user) return;

        const newEntry = {
            ...wordData,
            isFavorite: false,
            isInStudyList: false,
            isMemorized: false,
            addedByName: userData.displayName,
            addedByColor: userData.color
        };

        if (user.isGuest) {
            const localWords = getLocalWords();
            localWords.push({
                ...newEntry,
                id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
                createdAt: new Date().toISOString()
            });
            saveLocalWords(localWords);
            return;
        }

        let targetGroupId = user.uid;
        if (currentMode === 'group' && userData?.friendGroupId) {
            targetGroupId = userData.friendGroupId;
        }

        try {
            await addDoc(collection(db, 'words'), {
                ...newEntry,
                createdAt: serverTimestamp(),
                groupId: targetGroupId,
                addedBy: user.uid,
            });
        } catch (error) {
            console.error('Error adding word:', error);
        }
    };

    const updateWord = async (id, updatedData) => {
        if (user?.isGuest) {
            let localWords = getLocalWords();
            localWords = localWords.map(w => w.id === id ? { ...w, ...updatedData } : w);
            localStorage.setItem('wordflip_guest_words', JSON.stringify(localWords));
            
            // Re-shuffling every update breaks Swiping currentIndex.
            // So we just update the specific item in the CURRENT IN-MEMORY state 
            // without fully re-shuffling the deck to preserve index order!
            setWords(prev => prev.map(w => w.id === id ? { ...w, ...updatedData } : w));
            return;
        }

        try {
            const wordRef = doc(db, 'words', id);
            await updateDoc(wordRef, updatedData);
        } catch (error) {
            console.error('Error updating word:', error);
        }
    };

    const deleteWord = async (id) => {
        if (user?.isGuest) {
            let localWords = getLocalWords();
            localWords = localWords.filter(w => w.id !== id);
            localStorage.setItem('wordflip_guest_words', JSON.stringify(localWords));
            setWords(prev => prev.filter(w => w.id !== id));
            return;
        }

        try {
            await deleteDoc(doc(db, 'words', id));
        } catch (error) {
            console.error('Error deleting word:', error);
        }
    };

    const toggleFavorite = async (id) => {
        const word = words.find(w => w.id === id);
        if (word) {
            await updateWord(id, { isFavorite: !word.isFavorite });
        }
    };

    const toggleStudyList = async (id) => {
        const word = words.find(w => w.id === id);
        if (word) {
            await updateWord(id, { isInStudyList: !word.isInStudyList });
        }
    };

    const markMemorized = async (id, status = true) => {
        const word = words.find(w => w.id === id);
        if (word) {
            await updateWord(id, { isMemorized: status });
        }
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
                markMemorized,
                loadingWords,
                currentMode,
                setCurrentMode
            }}
        >
            {children}
        </WordContext.Provider>
    );
}
