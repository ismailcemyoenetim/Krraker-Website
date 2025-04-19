import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, firestore } from '../services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  signInAnonymously,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  nickname: string;
  setNickname: (name: string) => void;
  login: (nickname: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Store user nickname in Firestore
  useEffect(() => {
    const storeUserData = async () => {
      if (currentUser && nickname) {
        await updateProfile(currentUser, { displayName: nickname });
        
        const userRef = doc(firestore, 'users', currentUser.uid);
        await setDoc(userRef, {
          nickname,
          lastActive: new Date().toISOString(),
        }, { merge: true });
      }
    };

    if (currentUser && nickname) {
      storeUserData();
    }
  }, [currentUser, nickname]);

  // Login anonymously with a nickname
  const login = async (nickname: string) => {
    try {
      await signInAnonymously(auth);
      setNickname(nickname);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    loading,
    nickname,
    setNickname,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 