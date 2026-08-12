export type ViewType = 
  | 'dashboard'
  | 'cashflow'
  | 'budget'
  | 'savings'
  | 'calculator'
  | 'academy'
  | 'bills'
  | 'auth';

export interface Transaction {
  id: string;
  date: string; // ISO or formatted date "YYYY-MM-DD" or "Hari ini, 09:41"
  time?: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetDescription: string;
  targetAmount: number;
  currentAmount: number;
  categoryIcon: string;
  estimatedDate: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string; // "YYYY-MM-DD" or day number
  category: string;
  reminderEnabled: boolean;
  isPaid: boolean;
  paidDate?: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  limit: number;
  type: 'needs' | 'wants' | 'savings';
  icon: string;
  status: 'Aman' | 'Mendekati Batas' | 'Terlampaui';
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  readTime: string;
  author: string;
  category: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  heroImage: string;
  level?: string;
  sections?: {
    heading: string;
    body: string;
    bulletPoints?: string[];
    quote?: string;
  }[];
}

export interface UserProfile {
  name: string;
  title: string;
  level: string;
  email: string;
  avatarUrl: string;
  isLoggedIn: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
  title: string;
  level: string;
  createdAt: string;
}
