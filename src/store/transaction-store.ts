import { create } from 'zustand';
import { Transaction } from '@/types/transaction';

interface FilterState {
  dateRange: {
    from?: Date;
    to?: Date;
  };
  selectedTags: string[];
  selectedCategories: string[];
}

interface SortState {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface TransactionStore {
  // State properties
  transactions: Transaction[];
  filter: FilterState;
  sort: SortState;
  itemsCount: number;
  search: string;
  page: number;

  // Actions for transactions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Actions for filters
  setDateRange: (dateRange: { from?: Date; to?: Date }) => void;
  setSelectedTags: (tags: string[]) => void;
  setSelectedCategories: (categories: string[]) => void;
  clearFilters: () => void;

  // Actions for sorting
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  clearSort: () => void;

  // Actions for pagination and search
  setItemsCount: (count: number) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  
  // Reset all state
  resetStore: () => void;
}

const initialFilterState: FilterState = {
  dateRange: {},
  selectedTags: [],
  selectedCategories: [],
};

const initialSortState: SortState = {
  sortBy: '',
  sortOrder: 'desc',
};

export const useTransactionStore = create<TransactionStore>((set) => ({
  // Initial state
  transactions: [],
  filter: initialFilterState,
  sort: initialSortState,
  itemsCount: 25,
  search: '',
  page: 0,

  // Transaction actions
  setTransactions: (transactions) => set({ transactions }),
  
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
  
  updateTransaction: (id, updatedTransaction) =>
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...updatedTransaction, updatedAt: new Date() }
          : transaction
      ),
    })),
  
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((transaction) => transaction.id !== id),
    })),

  // Filter actions
  setDateRange: (dateRange) =>
    set((state) => ({
      filter: { ...state.filter, dateRange },
      page: 0, // Reset to first page when filtering
    })),
  
  setSelectedTags: (selectedTags) =>
    set((state) => ({
      filter: { ...state.filter, selectedTags },
      page: 0,
    })),
  
  setSelectedCategories: (selectedCategories) =>
    set((state) => ({
      filter: { ...state.filter, selectedCategories },
      page: 0,
    })),
  
  clearFilters: () =>
    set(() => ({
      filter: initialFilterState,
      page: 0,
    })),

  // Sort actions
  setSortBy: (sortBy) =>
    set((state) => ({
      sort: { ...state.sort, sortBy },
      page: 0,
    })),
  
  setSortOrder: (sortOrder) =>
    set((state) => ({
      sort: { ...state.sort, sortOrder },
      page: 0,
    })),
  
  clearSort: () =>
    set(() => ({
      sort: initialSortState,
      page: 0,
    })),

  // Pagination and search actions
  setItemsCount: (itemsCount) =>
    set(() => ({
      itemsCount,
      page: 0, // Reset to first page when changing items per page
    })),
  
  setSearch: (search) =>
    set(() => ({
      search,
      page: 0, // Reset to first page when searching
    })),
  
  setPage: (page) => set({ page }),

  // Reset all state
  resetStore: () =>
    set({
      transactions: [],
      filter: initialFilterState,
      sort: initialSortState,
      itemsCount: 25,
      search: '',
      page: 0,
    }),
}));

// Selector hooks for better performance
export const useTransactions = () => useTransactionStore((state) => state.transactions);
export const useTransactionFilters = () => useTransactionStore((state) => state.filter);
export const useTransactionSort = () => useTransactionStore((state) => state.sort);
export const useTransactionPagination = () => useTransactionStore((state) => ({
  itemsCount: state.itemsCount,
  page: state.page,
  search: state.search,
}));