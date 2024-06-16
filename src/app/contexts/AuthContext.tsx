'use client';



import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, User } from 'firebase/auth';
import { auth } from '../firebase';

type AuthContextType = {
  user: User | null;
  googleSignIn: () => void;
  logOut: () => void;
};

type UserDataContextType = {
  email: string;
  username: string;
  description: string;
  photoURL: string;
  uid: string;
  createdAt: string;
  lastLogin: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};


const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within an UserDataContextProvider');
  }
  return context;
}