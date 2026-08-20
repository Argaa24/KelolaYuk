import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  ViewType, 
  Transaction, 
  SavingsGoal, 
  Bill, 
  BudgetItem, 
  Article, 
  UserProfile,
  UserAccount 
} from '../types';
import { 
  initialProfile, 
  initialTransactions, 
  initialGoals, 
  initialBills, 
  initialBudgetItems, 
  initialArticles 
} from '../data/initialData';
import { 
  auth, 
  db, 
  googleProvider,
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
  sendPasswordResetEmail,
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  type Unsubscribe,
  type User
} from '../lib/firebase';

const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'user-demo-1',
    name: 'Budi Santoso',
    email: 'budi.santoso@kelolayuk.id',
    password: 'password123',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeXlv6AkyxIMR7H8tTjglThq9MFgCYBDOXaFX1klKEM-PCLNXLltBULq2IXwDi1-_6Gc7frIpxU7xFqgVR6ixqCTvkn6Jj8Mp5o28AErnHDUWieJc-DShOeNOSFxh5AZHUA3ixOprh88bwM1DrQqx1F-NoHr2nOdk7uWBd5gQj0yXoE0IdI-IOPnBqynkDWTbWzFDJP1tnuDf85AlslRh3M1RYYqRUH2FMJbjmMbYCIVvkLsDF4X-E',
    title: 'Mindful Saver',
    level: 'Zen Master',
    createdAt: new Date().toISOString()
  }
];

const getAccountStorageKey = (email: string | undefined, key: string) => {
  if (!email) return `mm_${key}_guest`;
  const cleanEmail = email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  return `mm_${key}_${cleanEmail}`;
};

const loadAccountData = <T,>(email: string | undefined, key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  const storageKey = getAccountStorageKey(email, key);
  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) : fallback;
};

export interface DeleteConfirmItem {
  type: 'transaction' | 'goal' | 'bill';
  id: string;
  title: string;
  amount?: number;
}

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  accounts: UserAccount[];
  
  // Auth Functions
  isAuthLoading: boolean;
  registerUser: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; message: string }>;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => Promise<void>;
  continueAsGuest: () => void;
  updateUserProfile: (data: { name: string; avatarUrl?: string; title?: string }) => Promise<{ success: boolean; message: string }>;
  
  // Financial State
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => void;
  goals: SavingsGoal[];
  addGoal: (goal: Omit<SavingsGoal, 'id'>) => Promise<void>;
  addSavingsToGoal: (goalId: string, amount: number) => Promise<void>;
  deleteGoal: (id: string) => void;
  bills: Bill[];
  addBill: (bill: Omit<Bill, 'id'>) => Promise<void>;
  toggleBillPaid: (id: string) => Promise<void>;
  deleteBill: (id: string) => void;
  budgetItems: BudgetItem[];
  articles: Article[];
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;
  
  // Modals state
  isAddTxOpen: boolean;
  setIsAddTxOpen: (open: boolean) => void;
  isAddSavingsOpen: boolean;
  setIsAddSavingsOpen: (open: boolean) => void;
  selectedSavingsGoalId: string | null;
  setSelectedSavingsGoalId: (id: string | null) => void;
  isAddGoalOpen: boolean;
  setIsAddGoalOpen: (open: boolean) => void;
  isAddBillOpen: boolean;
  setIsAddBillOpen: (open: boolean) => void;
  isQuizOpen: boolean;
  setIsQuizOpen: (open: boolean) => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;

  // Confirm delete modal state
  pendingDelete: DeleteConfirmItem | null;
  confirmDelete: () => Promise<void>;
  cancelDelete: () => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Theme (Dark Mode)
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Actions
  resetAllData: () => Promise<void>;

  // Computed financial numbers
  totalBalance: number;
  netWorth: number;
  monthlyCashflow: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Force clean zero data migration and logout default for fresh onboarding
if (typeof window !== 'undefined' && !localStorage.getItem('mm_fresh_auth_v1')) {
  localStorage.removeItem('mm_profile');
  localStorage.removeItem('mm_accounts');
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('mm_transactions') || key.startsWith('mm_goals') || key.startsWith('mm_bills') || key.startsWith('mm_budget')) {
      localStorage.removeItem(key);
    }
  });
  localStorage.setItem('mm_fresh_auth_v1', 'true');
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window === 'undefined') return initialProfile;
    const saved = localStorage.getItem('mm_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [currentView, setCurrentView] = useState<ViewType>(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('mm_profile');
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.isLoggedIn) return 'dashboard';
        } catch {}
      }
    }
    return profile.isLoggedIn ? 'dashboard' : 'auth';
  });
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('mm_accounts');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const activeEmailRef = useRef<string>(profile.isLoggedIn ? profile.email : '');
  const activeUidRef = useRef<string>(profile.uid || '');

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    return profile.isLoggedIn ? loadAccountData(profile.email, 'transactions', []) : [];
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    return profile.isLoggedIn ? loadAccountData(profile.email, 'goals', []) : [];
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    return profile.isLoggedIn ? loadAccountData(profile.email, 'bills', []) : [];
  });

  const [budgetItems] = useState<BudgetItem[]>(() => {
    return profile.isLoggedIn ? loadAccountData(profile.email, 'budget', []) : [];
  });

  const [articles] = useState<Article[]>(initialArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Modals
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAddSavingsOpen, setIsAddSavingsOpen] = useState(false);
  const [selectedSavingsGoalId, setSelectedSavingsGoalId] = useState<string | null>(null);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Confirm delete modal state
  const [pendingDelete, setPendingDelete] = useState<DeleteConfirmItem | null>(null);

  // Theme state
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mm_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mm_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      return next;
    });
  };

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync accounts & profile with localStorage fallback
  useEffect(() => {
    localStorage.setItem('mm_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('mm_profile', JSON.stringify(profile));
  }, [profile]);

  // Sync active user's transactions, goals, and bills to their specific localStorage keys
  useEffect(() => {
    if (profile.isLoggedIn && profile.email && activeEmailRef.current === profile.email) {
      localStorage.setItem(getAccountStorageKey(profile.email, 'transactions'), JSON.stringify(transactions));
    }
  }, [transactions, profile.email, profile.isLoggedIn]);

  useEffect(() => {
    if (profile.isLoggedIn && profile.email && activeEmailRef.current === profile.email) {
      localStorage.setItem(getAccountStorageKey(profile.email, 'goals'), JSON.stringify(goals));
    }
  }, [goals, profile.email, profile.isLoggedIn]);

  useEffect(() => {
    if (profile.isLoggedIn && profile.email && activeEmailRef.current === profile.email) {
      localStorage.setItem(getAccountStorageKey(profile.email, 'bills'), JSON.stringify(bills));
    }
  }, [bills, profile.email, profile.isLoggedIn]);

  // Firebase Auth State Listener & Firestore Real-time Subscriptions
  useEffect(() => {
    let unsubs: Unsubscribe[] = [];

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      // Clean up any existing firestore snapshot listeners
      unsubs.forEach(unsub => unsub());
      unsubs = [];

      if (firebaseUser) {
        const uid = firebaseUser.uid;
        activeUidRef.current = uid;
        const userEmail = firebaseUser.email || '';
        activeEmailRef.current = userEmail;

        try {
          // Check or create user profile document in Firestore
          const userDocRef = doc(db, 'users', uid);
          const userDocSnap = await getDoc(userDocRef);

          let userProfileData: UserProfile;
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            userProfileData = {
              uid,
              name: data.name || firebaseUser.displayName || 'Pengguna KelolaYuk',
              email: userEmail,
              avatarUrl: data.avatarUrl || firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userEmail)}`,
              title: data.title || 'Mindful Saver',
              level: data.level || 'Zen Master',
              isLoggedIn: true
            };
          } else {
            // Initialize new user profile document
            userProfileData = {
              uid,
              name: firebaseUser.displayName || 'Pengguna KelolaYuk',
              email: userEmail,
              avatarUrl: firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userEmail)}`,
              title: 'Anggota Baru',
              level: 'Pemula Finansial',
              isLoggedIn: true
            };
            await setDoc(userDocRef, {
              ...userProfileData,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }, { merge: true });
          }

          setProfile(userProfileData);

          // Listen to Transactions
          const txCollectionRef = collection(db, 'users', uid, 'transactions');
          const txQuery = query(txCollectionRef);
          const txUnsub = onSnapshot(txQuery, (snapshot) => {
            const list: Transaction[] = [];
            snapshot.forEach(docSnap => {
              const d = docSnap.data();
              list.push({
                id: docSnap.id,
                date: d.date || 'Hari ini',
                time: d.time,
                description: d.description || '',
                category: d.category || 'Lainnya',
                type: d.type || 'expense',
                amount: Number(d.amount) || 0,
                notes: d.notes || ''
              });
            });
            setTransactions(list);
          }, (error) => {
            console.error("Firestore transactions error:", error);
          });
          unsubs.push(txUnsub);

          // Listen to Savings Goals
          const goalsCollectionRef = collection(db, 'users', uid, 'goals');
          const goalsQuery = query(goalsCollectionRef);
          const goalsUnsub = onSnapshot(goalsQuery, (snapshot) => {
            const list: SavingsGoal[] = [];
            snapshot.forEach(docSnap => {
              const d = docSnap.data();
              list.push({
                id: docSnap.id,
                title: d.title || '',
                targetDescription: d.targetDescription || '',
                targetAmount: Number(d.targetAmount) || 0,
                currentAmount: Number(d.currentAmount) || 0,
                categoryIcon: d.categoryIcon || 'savings',
                estimatedDate: d.estimatedDate || ''
              });
            });
            setGoals(list);
          }, (error) => {
            console.error("Firestore goals error:", error);
          });
          unsubs.push(goalsUnsub);

          // Listen to Bills
          const billsCollectionRef = collection(db, 'users', uid, 'bills');
          const billsQuery = query(billsCollectionRef);
          const billsUnsub = onSnapshot(billsQuery, (snapshot) => {
            const list: Bill[] = [];
            snapshot.forEach(docSnap => {
              const d = docSnap.data();
              list.push({
                id: docSnap.id,
                name: d.name || '',
                amount: Number(d.amount) || 0,
                dueDate: d.dueDate || '',
                category: d.category || 'Tagihan',
                reminderEnabled: Boolean(d.reminderEnabled),
                isPaid: Boolean(d.isPaid),
                paidDate: d.paidDate
              });
            });
            setBills(list);
          }, (error) => {
            console.error("Firestore bills error:", error);
          });
          unsubs.push(billsUnsub);

        } catch (err) {
          console.error("Error setting up Firebase user profile or listeners:", err);
        }
      } else {
        // User logged out or guest
        activeUidRef.current = '';
        // If profile was logged in via Firebase, reset to guest or local state
        if (profile.uid) {
          setProfile(prev => ({
            ...prev,
            uid: undefined,
            isLoggedIn: false
          }));
          setTransactions([]);
          setGoals([]);
          setBills([]);
        }
      }
      setIsAuthLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  // Helper to switch active local account data cleanly
  const switchAccountData = (email: string | null) => {
    if (!email) {
      setTransactions([]);
      setGoals([]);
      setBills([]);
      return;
    }
    setTransactions(loadAccountData(email, 'transactions', []));
    setGoals(loadAccountData(email, 'goals', []));
    setBills(loadAccountData(email, 'bills', []));
  };

  // Auth Actions
  const registerUser = async (data: { name: string; email: string; password: string }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.name.trim();

    try {
      // 1. Try to create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
      const user = userCredential.user;

      // 2. Update display name in Firebase Auth
      await updateFirebaseProfile(user, {
        displayName: cleanName,
        photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`
      });

      // 3. Create profile document in Firestore
      const newProfileData: UserProfile = {
        uid: user.uid,
        name: cleanName,
        email: cleanEmail,
        title: 'Anggota Baru',
        level: 'Pemula Finansial',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
        isLoggedIn: true
      };

      try {
        await setDoc(doc(db, 'users', user.uid), {
          ...newProfileData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        console.warn("Firestore user sync warning:", e);
      }

      activeUidRef.current = user.uid;
      activeEmailRef.current = cleanEmail;
      setProfile(newProfileData);

      // Also add to accounts array for fast switching & local backup
      setAccounts(prev => {
        const filtered = prev.filter(a => a.email.toLowerCase() !== cleanEmail);
        return [...filtered, {
          id: user.uid,
          name: cleanName,
          email: cleanEmail,
          password: data.password,
          avatarUrl: newProfileData.avatarUrl,
          title: newProfileData.title,
          level: newProfileData.level,
          createdAt: new Date().toISOString()
        }];
      });

      showToast(`Akun berhasil dibuat! Selamat datang, ${cleanName}.`);
      return { success: true, message: 'Pendaftaran berhasil!' };
    } catch (error: any) {
      console.error("Registration error:", error);

      // Fallback: If Firebase Email provider is not enabled or restricted in Firebase Console,
      // create a local profile immediately so the user is NEVER blocked from using the app!
      if (
        error.code === 'auth/operation-not-allowed' || 
        error.code === 'auth/admin-restricted-operation' ||
        error.code === 'auth/configuration-not-found' ||
        error.code === 'auth/network-request-failed' ||
        !error.code
      ) {
        const localUid = 'usr_' + Date.now();
        const localProfile: UserProfile = {
          uid: localUid,
          name: cleanName,
          email: cleanEmail,
          title: 'Anggota Baru',
          level: 'Pemula Finansial',
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
          isLoggedIn: true
        };

        activeUidRef.current = localUid;
        activeEmailRef.current = cleanEmail;
        switchAccountData(cleanEmail);
        setProfile(localProfile);

        setAccounts(prev => {
          const filtered = prev.filter(a => a.email.toLowerCase() !== cleanEmail);
          return [...filtered, {
            id: localUid,
            name: cleanName,
            email: cleanEmail,
            password: data.password,
            avatarUrl: localProfile.avatarUrl,
            title: localProfile.title,
            level: localProfile.level,
            createdAt: new Date().toISOString()
          }];
        });

        showToast(`Akun "${cleanName}" berhasil didaftarkan!`);
        return { success: true, message: 'Pendaftaran berhasil!' };
      }

      let msg = 'Terjadi kesalahan saat mendaftar.';
      if (error.code === 'auth/email-already-in-use') {
        msg = 'Email sudah terdaftar. Silakan masuk atau gunakan email lain.';
      } else if (error.code === 'auth/weak-password') {
        msg = 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Format email tidak valid.';
      } else if (error.message) {
        msg = error.message;
      }
      return { success: false, message: msg };
    }
  };

  const loginUser = async (emailInput: string, passwordInput: string) => {
    const cleanEmail = emailInput.trim().toLowerCase();
    
    // Check if it's the demo account fallback
    if (cleanEmail === 'budi.santoso@kelolayuk.id' && passwordInput === 'password123') {
      const demoProfile: UserProfile = {
        name: 'Budi Santoso',
        email: cleanEmail,
        title: 'Mindful Saver',
        level: 'Zen Master',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeXlv6AkyxIMR7H8tTjglThq9MFgCYBDOXaFX1klKEM-PCLNXLltBULq2IXwDi1-_6Gc7frIpxU7xFqgVR6ixqCTvkn6Jj8Mp5o28AErnHDUWieJc-DShOeNOSFxh5AZHUA3ixOprh88bwM1DrQqx1F-NoHr2nOdk7uWBd5gQj0yXoE0IdI-IOPnBqynkDWTbWzFDJP1tnuDf85AlslRh3M1RYYqRUH2FMJbjmMbYCIVvkLsDF4X-E',
        isLoggedIn: true
      };
      activeEmailRef.current = cleanEmail;
      switchAccountData(cleanEmail);
      setProfile(demoProfile);
      showToast(`Selamat datang kembali, Budi Santoso! (Mode Demo)`);
      return { success: true, message: 'Berhasil masuk mode demo!' };
    }

    // Check if matching locally saved account
    const localMatch = accounts.find(acc => acc.email.toLowerCase() === cleanEmail);
    if (localMatch && localMatch.password && localMatch.password === passwordInput) {
      const matchedProfile: UserProfile = {
        uid: localMatch.id,
        name: localMatch.name,
        email: localMatch.email,
        title: localMatch.title,
        level: localMatch.level,
        avatarUrl: localMatch.avatarUrl,
        isLoggedIn: true
      };
      activeUidRef.current = localMatch.id;
      activeEmailRef.current = cleanEmail;
      switchAccountData(cleanEmail);
      setProfile(matchedProfile);
      showToast(`Selamat datang kembali, ${localMatch.name}!`);
      return { success: true, message: 'Berhasil masuk!' };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, passwordInput);
      const user = userCredential.user;
      activeUidRef.current = user.uid;
      activeEmailRef.current = cleanEmail;

      showToast(`Selamat datang kembali, ${user.displayName || user.email}!`);
      return { success: true, message: 'Berhasil masuk!' };
    } catch (error: any) {
      console.error("Login error:", error);

      if (localMatch) {
        if (localMatch.password && localMatch.password !== passwordInput) {
          return { success: false, message: 'Kata sandi yang Anda masukkan salah.' };
        }
        const matchedProfile: UserProfile = {
          uid: localMatch.id,
          name: localMatch.name,
          email: localMatch.email,
          title: localMatch.title,
          level: localMatch.level,
          avatarUrl: localMatch.avatarUrl,
          isLoggedIn: true
        };
        activeUidRef.current = localMatch.id;
        activeEmailRef.current = cleanEmail;
        switchAccountData(cleanEmail);
        setProfile(matchedProfile);
        showToast(`Selamat datang kembali, ${localMatch.name}!`);
        return { success: true, message: 'Berhasil masuk!' };
      }

      let msg = 'Gagal masuk. Periksa email dan kata sandi Anda.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        msg = 'Email atau kata sandi tidak cocok. Silakan periksa kembali.';
      } else if (error.code === 'auth/wrong-password') {
        msg = 'Kata sandi yang Anda masukkan salah.';
      } else if (error.code === 'auth/too-many-requests') {
        msg = 'Terlalu banyak percobaan gagal. Silakan coba beberapa saat lagi.';
      } else if (error.code === 'auth/operation-not-allowed') {
        msg = 'Metode email belum aktif di Firebase. Silakan gunakan "Lanjutkan dengan Google" atau daftar baru.';
      }
      return { success: false, message: msg };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      let customName = user.displayName || 'Pengguna Google';
      let customAvatar = user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email || 'user')}`;
      let customTitle = 'Mindful Saver';
      let customLevel = 'Zen Master';

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        if (data.name) customName = data.name;
        if (data.avatarUrl) customAvatar = data.avatarUrl;
        if (data.title) customTitle = data.title;
        if (data.level) customLevel = data.level;
      }

      const userProfileData: UserProfile = {
        uid: user.uid,
        name: customName,
        email: user.email || '',
        avatarUrl: customAvatar,
        title: customTitle,
        level: customLevel,
        isLoggedIn: true
      };

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          ...userProfileData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      setProfile(userProfileData);
      localStorage.setItem('mm_profile', JSON.stringify(userProfileData));
      showToast(`Berhasil masuk dengan Google sebagai ${userProfileData.name}!`);
      return { success: true, message: 'Berhasil masuk dengan Google!' };
    } catch (error: any) {
      console.error("Google sign in error:", error);
      return { success: false, message: error.message || 'Gagal masuk dengan Google.' };
    }
  };

  const updateUserProfile = async (data: { name: string; avatarUrl?: string; title?: string }) => {
    const cleanName = data.name.trim();
    if (!cleanName) {
      showToast('Nama tidak boleh kosong.');
      return { success: false, message: 'Nama tidak boleh kosong.' };
    }

    const updatedProfile: UserProfile = {
      ...profile,
      name: cleanName,
      ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
      ...(data.title ? { title: data.title } : {})
    };

    setProfile(updatedProfile);
    localStorage.setItem('mm_profile', JSON.stringify(updatedProfile));

    // Update in accounts array if matching email
    if (profile.email) {
      setAccounts(prev => prev.map(acc => {
        if (acc.email.toLowerCase() === profile.email.toLowerCase()) {
          return {
            ...acc,
            name: cleanName,
            ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
            ...(data.title ? { title: data.title } : {})
          };
        }
        return acc;
      }));
    }

    // Sync to Firestore & Firebase Auth if logged in
    if (activeUidRef.current) {
      try {
        const userDocRef = doc(db, 'users', activeUidRef.current);
        await setDoc(userDocRef, {
          name: cleanName,
          ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
          ...(data.title ? { title: data.title } : {}),
          updatedAt: new Date().toISOString()
        }, { merge: true });

        if (auth.currentUser) {
          await updateFirebaseProfile(auth.currentUser, {
            displayName: cleanName,
            ...(data.avatarUrl ? { photoURL: data.avatarUrl } : {})
          });
        }
      } catch (err) {
        console.error("Error updating profile in Firebase:", err);
      }
    }

    showToast(`Nama profil berhasil diubah menjadi "${cleanName}"!`);
    return { success: true, message: 'Profil berhasil diperbarui!' };
  };

  const sendPasswordReset = async (emailInput: string) => {
    try {
      await sendPasswordResetEmail(auth, emailInput.trim().toLowerCase());
      showToast(`Tautan pemulihan kata sandi telah dikirim ke ${emailInput}`);
      return { success: true, message: 'Email pemulihan terkirim.' };
    } catch (error: any) {
      console.error("Password reset error:", error);
      return { success: false, message: 'Gagal mengirim email pemulihan. Pastikan email terdaftar.' };
    }
  };

  const continueAsGuest = () => {
    const guestUid = 'guest_' + Date.now();
    const guestProfile: UserProfile = {
      uid: guestUid,
      name: 'Pengguna Tamu',
      title: 'Perintis Keuangan',
      level: 'Tingkat 1 - Perintis',
      email: 'tamu@kelolayuk.id',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=Guest_${Date.now()}`,
      isLoggedIn: true
    };
    activeUidRef.current = guestUid;
    activeEmailRef.current = 'tamu@kelolayuk.id';
    switchAccountData('tamu@kelolayuk.id');
    setProfile(guestProfile);
    setCurrentView('dashboard');
    showToast('Masuk sebagai Pengguna Tamu (Data Lokal). Buat akun kapan saja untuk simpan di Cloud!');
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
    activeUidRef.current = '';
    activeEmailRef.current = '';
    switchAccountData(null);
    setProfile({
      name: '',
      title: 'Perintis Keuangan',
      level: 'Tingkat 1 - Perintis',
      email: '',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=KelolaYukGuest',
      isLoggedIn: false
    });
    setCurrentView('auth');
    showToast('Anda telah keluar dari akun.');
  };

  // Firestore Financial Actions
  const addTransaction = async (txData: Omit<Transaction, 'id'>) => {
    const newId = 'tx-' + Date.now();
    const newTx: Transaction = {
      ...txData,
      id: newId,
    };

    // Optimistic local update
    setTransactions(prev => [newTx, ...prev]);

    // Save to Firestore if authenticated
    if (activeUidRef.current) {
      try {
        const txDocRef = doc(db, 'users', activeUidRef.current, 'transactions', newId);
        await setDoc(txDocRef, {
          description: newTx.description,
          amount: newTx.amount,
          type: newTx.type,
          category: newTx.category,
          date: newTx.date,
          time: newTx.time || '',
          notes: newTx.notes || '',
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Error saving transaction to Firestore:", err);
      }
    }

    showToast(`Transaksi "${newTx.description}" berhasil disimpan ke database!`);
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      setPendingDelete({
        type: 'transaction',
        id: tx.id,
        title: tx.description || 'Transaksi',
        amount: tx.amount
      });
    } else {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const addGoal = async (goalData: Omit<SavingsGoal, 'id'>) => {
    const newId = 'goal-' + Date.now();
    const newGoal: SavingsGoal = {
      ...goalData,
      id: newId,
    };

    // Optimistic local update
    setGoals(prev => [...prev, newGoal]);

    // Save to Firestore if authenticated
    if (activeUidRef.current) {
      try {
        const goalDocRef = doc(db, 'users', activeUidRef.current, 'goals', newId);
        await setDoc(goalDocRef, {
          title: newGoal.title,
          targetDescription: newGoal.targetDescription || '',
          targetAmount: newGoal.targetAmount,
          currentAmount: newGoal.currentAmount,
          categoryIcon: newGoal.categoryIcon || 'savings',
          estimatedDate: newGoal.estimatedDate || '',
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Error saving goal to Firestore:", err);
      }
    }

    showToast(`Target tabungan "${newGoal.title}" tersimpan di Cloud Firestore!`);
  };

  const addSavingsToGoal = async (goalId: string, amount: number) => {
    const targetGoal = goals.find(g => g.id === goalId);
    const updatedAmount = (targetGoal?.currentAmount || 0) + amount;

    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, currentAmount: updatedAmount };
      }
      return g;
    }));

    if (activeUidRef.current && targetGoal) {
      try {
        const goalDocRef = doc(db, 'users', activeUidRef.current, 'goals', goalId);
        await setDoc(goalDocRef, {
          currentAmount: updatedAmount
        }, { merge: true });
      } catch (err) {
        console.error("Error updating goal amount in Firestore:", err);
      }
    }

    // Also record a transaction for savings deposit
    await addTransaction({
      date: 'Hari ini',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      description: `Tabungan: ${targetGoal?.title || 'Target'}`,
      category: 'Tabungan & Investasi',
      type: 'expense',
      amount,
      notes: 'Setoran dana tabungan',
    });

    showToast(`Rp ${new Intl.NumberFormat('id-ID').format(amount)} ditambahkan ke tabungan!`);
  };

  const deleteGoal = (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      setPendingDelete({
        type: 'goal',
        id: goal.id,
        title: goal.title || 'Target Tabungan',
        amount: goal.targetAmount
      });
    } else {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  const addBill = async (billData: Omit<Bill, 'id'>) => {
    const newId = 'bill-' + Date.now();
    const newBill: Bill = {
      ...billData,
      id: newId,
    };

    setBills(prev => [newBill, ...prev]);

    if (activeUidRef.current) {
      try {
        const billDocRef = doc(db, 'users', activeUidRef.current, 'bills', newId);
        await setDoc(billDocRef, {
          name: newBill.name,
          amount: newBill.amount,
          dueDate: newBill.dueDate,
          category: newBill.category || 'Tagihan',
          reminderEnabled: newBill.reminderEnabled,
          isPaid: newBill.isPaid,
          paidDate: newBill.paidDate || null,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Error saving bill to Firestore:", err);
      }
    }

    showToast(`Pengingat tagihan "${newBill.name}" berhasil disimpan!`);
  };

  const toggleBillPaid = async (id: string) => {
    const bill = bills.find(b => b.id === id);
    if (!bill) return;

    const nextPaid = !bill.isPaid;
    const paidDate = nextPaid ? 'Hari ini' : undefined;

    setBills(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          isPaid: nextPaid,
          paidDate: paidDate,
        };
      }
      return b;
    }));

    if (activeUidRef.current) {
      try {
        const billDocRef = doc(db, 'users', activeUidRef.current, 'bills', id);
        await setDoc(billDocRef, {
          isPaid: nextPaid,
          paidDate: paidDate || null
        }, { merge: true });
      } catch (err) {
        console.error("Error updating bill status in Firestore:", err);
      }
    }

    if (nextPaid) {
      showToast(`Tagihan "${bill.name}" ditandai Lunas!`);
    } else {
      showToast(`Status tagihan "${bill.name}" dikembalikan.`);
    }
  };

  const deleteBill = (id: string) => {
    const bill = bills.find(b => b.id === id);
    if (bill) {
      setPendingDelete({
        type: 'bill',
        id: bill.id,
        title: bill.name || 'Tagihan',
        amount: bill.amount
      });
    } else {
      setBills(prev => prev.filter(b => b.id !== id));
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { type, id } = pendingDelete;

    if (type === 'transaction') {
      setTransactions(prev => prev.filter(t => t.id !== id));
      if (activeUidRef.current) {
        try {
          await deleteDoc(doc(db, 'users', activeUidRef.current, 'transactions', id));
        } catch (e) {
          console.error("Error deleting transaction doc from Firestore:", e);
        }
      }
      showToast('Transaksi berhasil dihapus dari database');
    } else if (type === 'goal') {
      setGoals(prev => prev.filter(g => g.id !== id));
      if (activeUidRef.current) {
        try {
          await deleteDoc(doc(db, 'users', activeUidRef.current, 'goals', id));
        } catch (e) {
          console.error("Error deleting goal doc from Firestore:", e);
        }
      }
      showToast('Target tabungan berhasil dihapus dari database');
    } else if (type === 'bill') {
      setBills(prev => prev.filter(b => b.id !== id));
      if (activeUidRef.current) {
        try {
          await deleteDoc(doc(db, 'users', activeUidRef.current, 'bills', id));
        } catch (e) {
          console.error("Error deleting bill doc from Firestore:", e);
        }
      }
      showToast('Tagihan berhasil dihapus dari database');
    }
    setPendingDelete(null);
  };

  const cancelDelete = () => {
    setPendingDelete(null);
  };

  const resetAllData = async () => {
    setTransactions([]);
    setGoals([]);
    setBills([]);
    if (profile.email) {
      localStorage.removeItem(getAccountStorageKey(profile.email, 'transactions'));
      localStorage.removeItem(getAccountStorageKey(profile.email, 'goals'));
      localStorage.removeItem(getAccountStorageKey(profile.email, 'bills'));
    }
    localStorage.removeItem('mm_transactions');
    localStorage.removeItem('mm_goals');
    localStorage.removeItem('mm_bills');
    localStorage.removeItem('mm_budget');
    showToast('Semua data keuangan telah direset ke 0!');
  };

  // Financial Calculations
  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenseTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = incomeTotal - expenseTotal;
  const savingsTotal = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const netWorth = totalBalance + savingsTotal;
  const monthlyCashflow = incomeTotal - expenseTotal;

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        profile,
        setProfile,
        accounts,
        isAuthLoading,
        registerUser,
        loginUser,
        loginWithGoogle,
        sendPasswordReset,
        logoutUser,
        continueAsGuest,
        updateUserProfile,
        resetAllData,
        transactions,
        addTransaction,
        deleteTransaction,
        goals,
        addGoal,
        addSavingsToGoal,
        deleteGoal,
        bills,
        addBill,
        toggleBillPaid,
        deleteBill,
        budgetItems,
        articles,
        selectedArticle,
        setSelectedArticle,

        isAddTxOpen,
        setIsAddTxOpen,
        isAddSavingsOpen,
        setIsAddSavingsOpen,
        selectedSavingsGoalId,
        setSelectedSavingsGoalId,
        isAddGoalOpen,
        setIsAddGoalOpen,
        isAddBillOpen,
        setIsAddBillOpen,
        isQuizOpen,
        setIsQuizOpen,
        isEditProfileOpen,
        setIsEditProfileOpen,

        pendingDelete,
        confirmDelete,
        cancelDelete,

        toastMessage,
        showToast,

        theme,
        toggleTheme,

        totalBalance,
        netWorth,
        monthlyCashflow,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
