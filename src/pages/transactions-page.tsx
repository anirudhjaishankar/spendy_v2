import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Transaction, TransactionFormData } from "@/types/transaction";
import { TransactionsDataTable } from "@/components/transactions-data-table";
import { TransactionsDialog } from "@/components/transactions-dialog";
import { useTransactionStore } from "@/store/transaction-store";

export default function TransactionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addTransaction } = useTransactionStore();

  const handleTransactionSubmit = (data: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addTransaction(newTransaction);
    
    // Log the entire store state after adding transaction
    console.log("Transaction added - Store state:", useTransactionStore.getState());
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
        <TransactionsDataTable />
      </div>

      <TransactionsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onTransactionSubmit={handleTransactionSubmit}
      />
    </div>
  );
}
