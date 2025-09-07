import { Transaction } from "@/types/transaction";

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium">{transaction.name}</h4>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              transaction.type === "income"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
            }`}
          >
            {transaction.type}
          </span>
        </div>
        <div className="text-sm text-muted-foreground flex gap-4">
          <span>{transaction.category}</span>
          <span>→ {transaction.account}</span>
          <span>{transaction.transactionDate.toLocaleDateString()}</span>
        </div>
        {transaction.notes && (
          <p className="text-sm text-muted-foreground mt-1">{transaction.notes}</p>
        )}
        {transaction.tags.length > 0 && (
          <div className="flex gap-1 mt-2">
            {transaction.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="text-right">
        <div
          className={`text-lg font-semibold ${
            transaction.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
        </div>
      </div>
    </div>
  );
}