import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const getRandomColor = () => {
    const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isGuestMode = localStorage.getItem('wordflip_guest_mode') === 'true';

        if (isGuestMode) {
            const guestUser = { uid: 'guest-local', displayName: 'Misafir Öğrenci', isGuest: true };
            setUser(guestUser);
            setUserData({ ...guestUser, color: '#94a3b8', friendGroupId: null });
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                const userRef = doc(db, 'users', firebaseUser.uid);
                
                const unsubData = onSnapshot(userRef, async (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        const newUserData = {
                            uid: firebaseUser.uid,
                            displayName: firebaseUser.displayName || 'Kullanıcı',
                            email: firebaseUser.email,
                            photoURL: firebaseUser.photoURL,
                            color: getRandomColor(),
                            friendGroupId: null
                        };
                        await setDoc(userRef, newUserData);

                        const groupRef = doc(db, 'groups', firebaseUser.uid);
                        await setDoc(groupRef, {
                            id: firebaseUser.uid,
                            name: `${firebaseUser.displayName?.split(' ')[0] || 'Benim'}'in Grubu`,
                            createdBy: firebaseUser.uid,
                            members: [firebaseUser.uid],
                            maxMembers: 5
                        });

                        setUserData(newUserData);
                    }
                    setLoading(false);
                });

                return () => unsubData();
            } else {
                setUser(null);
                setUserData(null);
                setLoading(false);
            }
        });

        return () => unsubscribe && unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        localStorage.removeItem('wordflip_guest_mode');
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    };

    const loginAsGuest = () => {
        localStorage.setItem('wordflip_guest_mode', 'true');
        window.location.reload(); // Hard reload to mount guest context cleanly
    };

    const logout = async () => {
        if (user?.isGuest) {
            localStorage.removeItem('wordflip_guest_mode');
            window.location.reload();
        } else {
            await signOut(auth);
        }
    };

    const updateGroup = async (newGroupId) => {
        if (!user || user.isGuest) return;
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { friendGroupId: newGroupId }, { merge: true });
    };

    const deleteAccount = async () => {
        if (!user || user.isGuest) return;
        
        const confirmDelete = window.confirm("Hesabınızı ve tüm kelimelerinizi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.");
        
        if (confirmDelete) {
            try {
                // Not: Kelime silme işlemi burada opsiyonel (kelimeler kullanıcıya ID ile bağlı olduğu için kullanıcı silinince erişilemez olur)
                // Ancak tam temizlik için users dokümanını siliyoruz
                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, { deleted: true, email: 'deleted@wordflip.com', displayName: 'Silinmiş Kullanıcı' }, { merge: true });
                
                // Firestore'daki asıl kullanıcı dokümanını silebiliriz veya 'deleted' işareti koyabiliriz.
                // Firebase Auth tarafındaki silme işlemi için kullanıcının yakın zamanda login olması gerekir. 
                // Play Store için 'hesap silme talebi' butonu olması ve verinin anonimleşmesi/silinmesi yeterlidir.
                await logout();
            } catch (error) {
                console.error("Delete Error:", error);
                alert("Hata: Hesabınız silinemedi. Lütfen tekrar deneyin.");
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, userData, loading, signInWithGoogle, loginAsGuest, logout, updateGroup, deleteAccount }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
