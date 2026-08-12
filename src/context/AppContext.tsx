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

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  accounts: UserAccount[];
  registerUser: (data: { name: string; email: string; password: string }) => { success: boolean; message: string };
  loginUser: (email: string, password: string) => { success: boolean; message: string };
  logoutUser: () => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  goals: SavingsGoal[];
  addGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  addSavingsToGoal: (goalId: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  bills: Bill[];
  addBill: (bill: Omit<Bill, 'id'>) => void;
  toggleBillPaid: (id: string) => void;
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

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Actions
  resetAllData: () => void;

  // Computed financial numbers
  totalBalance: number;
  netWorth: number;
  monthlyCashflow: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Force clean zero data migration for legacy localStorage
if (typeof window !== 'undefined' && !localStorage.getItem('mm_fresh_zero_v1')) {
  localStorage.removeItem('mm_transactions');
  localStorage.removeItem('mm_goals');
  localStorage.removeItem('mm_bills');
  localStorage.removeItem('mm_budget');
  localStorage.setItem('mm_fresh_zero_v1', 'true');
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('mm_accounts');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mm_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const activeEmailRef = useRef<string>(profile.isLoggedIn ? profile.email : '');

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

  // Helper to switch active account data cleanly
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

  // Modals
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAddSavingsOpen, setIsAddSavingsOpen] = useState(false);
  const [selectedSavingsGoalId, setSelectedSavingsGoalId] = useState<string | null>(null);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync accounts & profile with localStorage
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

  // Auth Actions
  const registerUser = (data: { name: string; email: string; password: string }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.' };
    }

    const newAcc: UserAccount = {
      id: 'usr-' + Date.now(),
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name.trim())}`,
      title: 'Anggota Baru',
      level: 'Pemula Finansial',
      createdAt: new Date().toISOString()
    };

    setAccounts(prev => [...prev, newAcc]);

    // Auto log in after registration with fresh empty data
    const newProfile: UserProfile = {
      name: newAcc.name,
      email: newAcc.email,
      title: newAcc.title,
      level: newAcc.level,
      avatarUrl: newAcc.avatarUrl,
      isLoggedIn: true
    };

    activeEmailRef.current = newAcc.email;
    switchAccountData(newAcc.email);
    setProfile(newProfile);

    showToast(`Akun berhasil dibuat! Selamat datang, ${newAcc.name}.`);
    return { success: true, message: 'Pendaftaran berhasil!' };
  };

  const loginUser = (emailInput: string, passwordInput: string) => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const target = accounts.find(a => a.email.toLowerCase() === cleanEmail);

    if (!target) {
      return { success: false, message: 'Akun dengan email ini tidak ditemukan. Silakan daftar terlebih dahulu.' };
    }

    if (target.password !== passwordInput) {
      return { success: false, message: 'Kata sandi yang Anda masukkan salah.' };
    }

    const newProfile: UserProfile = {
      name: target.name,
      email: target.email,
      title: target.title || 'Mindful Saver',
      level: target.level || 'Zen Master',
      avatarUrl: target.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeXlv6AkyxIMR7H8tTjglThq9MFgCYBDOXaFX1klKEM-PCLNXLltBULq2IXwDi1-_6Gc7frIpxU7xFqgVR6ixqCTvkn6Jj8Mp5o28AErnHDUWieJc-DShOeNOSFxh5AZHUA3ixOprh88bwM1DrQqx1F-NoHr2nOdk7uWBd5gQj0yXoE0IdI-IOPnBqynkDWTbWzFDJP1tnuDf85AlslRh3M1RYYqRUH2FMJbjmMbYCIVvkLsDF4X-E',
      isLoggedIn: true
    };

    activeEmailRef.current = target.email;
    switchAccountData(target.email);
    setProfile(newProfile);

    showToast(`Selamat datang kembali, ${target.name}!`);
    return { success: true, message: 'Berhasil masuk!' };
  };

  const logoutUser = () => {
    activeEmailRef.current = '';
    switchAccountData(null);
    setProfile(prev => ({
      ...prev,
      isLoggedIn: false
    }));
    showToast('Anda telah keluar dari akun.');
  };

  // Actions
  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: 'tx-' + Date.now(),
    };
    setTransactions(prev => [newTx, ...prev]);
    showToast(`Transaksi "${newTx.description}" berhasil disimpan!`);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast('Transaksi dihapus');
  };

  const addGoal = (goalData: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: 'goal-' + Date.now(),
    };
    setGoals(prev => [...prev, newGoal]);
    showToast(`Target tabungan "${newGoal.title}" berhasil dibuat!`);
  };

  const addSavingsToGoal = (goalId: string, amount: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, currentAmount: g.currentAmount + amount };
      }
      return g;
    }));
    // Also record a transaction for savings deposit
    const targetGoal = goals.find(g => g.id === goalId);
    addTransaction({
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
    setGoals(prev => prev.filter(g => g.id !== id));
    showToast('Target tabungan dihapus');
  };

  const addBill = (billData: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...billData,
      id: 'bill-' + Date.now(),
    };
    setBills(prev => [newBill, ...prev]);
    showToast(`Tagihan "${newBill.name}" berhasil ditambahkan!`);
  };

  const toggleBillPaid = (id: string) => {
    setBills(prev => prev.map(b => {
      if (b.id === id) {
        const nextPaid = !b.isPaid;
        if (nextPaid) {
          showToast(`Tagihan "${b.name}" ditandai Lunas!`);
        }
        return {
          ...b,
          isPaid: nextPaid,
          paidDate: nextPaid ? 'Hari ini' : undefined,
        };
      }
      return b;
    }));
  };

  const deleteBill = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id));
    showToast('Tagihan dihapus');
  };

  const resetAllData = () => {
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

  // Calculations
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
        registerUser,
        loginUser,
        logoutUser,
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

        toastMessage,
        showToast,

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
