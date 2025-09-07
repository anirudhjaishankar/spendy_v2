import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Transaction, TransactionFormData } from "@/types/transaction";
import { TransactionsDataTable } from "@/components/transactions-data-table";
import { TransactionsDialog } from "@/components/transactions-dialog";

export default function TransactionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleTransactionSubmit = (data: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    console.log("Transaction added:", newTransaction);
  };

  return (
    <div className="px-4 lg:px-6">
      <div className="flex justify-between items-center py-2">
        <h2 className="text-3xl font-bold">Transactions</h2>
        <Button onClick={() => setIsDialogOpen(true)}>Add Transaction</Button>
      </div>
      <Separator />

      {/* Transactions Data Table */}
      <div className="mt-6">
        <TransactionsDataTable data={transactions} />
      </div>

      <TransactionsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onTransactionSubmit={handleTransactionSubmit}
      />
    </div>
  );
}
