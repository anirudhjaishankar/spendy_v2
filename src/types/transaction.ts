export interface Transaction {
  id: string;
  name: string;
  amount: number;
  account: string;
  type: "income" | "expense";
  category: string;
  transactionDate: Date;
  notes: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionFormData = Omit<Transaction, "id" | "createdAt" | "updatedAt">;

export type TransactionType = "income" | "expense";