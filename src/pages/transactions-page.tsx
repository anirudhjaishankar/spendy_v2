import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DatePickerWithRange } from "@/components/date-range-picker";
import {
  SingleTransactionForm,
  type SingleTransactionFormData,
} from "@/components/ui/transaction-form";
import { Transaction, TransactionFormData } from "@/types/transaction";
import { TransactionsDataTable } from "@/components/transactions-data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";

export default function TransactionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleFormSubmit = (data: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    console.log("Transaction added:", newTransaction);
    setIsDialogOpen(false);
  };

  const handleFormCancel = () => {
    setIsDialogOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleBulkUpload = () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile.name);
      // TODO: Handle file upload (e.g., parse CSV and send to backend)
      setSelectedFile(null);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="px-4 lg:px-6">
      <div className="flex justify-between items-center py-2">
        <h2 className="text-3xl font-bold">Transactions</h2>
        <Button onClick={() => setIsDialogOpen(true)}>Add Transaction</Button>
      </div>
      <Separator />
      <div className="flex w-full py-2 mt-1 justify-end">
        <DatePickerWithRange />
      </div>

      {/* Transactions Data Table */}
      <div className="mt-6">
        <TransactionsDataTable data={transactions} />
      </div>

      {/* Transaction Dialog with Tabs */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Choose to add a single transaction or upload multiple
              transactions.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="single" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Single Transaction</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="mt-4">
              <SingleTransactionForm
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </TabsContent>

            <TabsContent value="bulk" className="mt-4">
              <div className="space-y-6 p-6">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload Transactions File</Label>
                  <p className="text-sm text-muted-foreground">
                    Upload a CSV or Excel file containing multiple transactions.
                    Supported formats: .csv, .xlsx, .xls
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />

                  {selectedFile && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm">
                        Selected file:{" "}
                        <span className="font-medium">{selectedFile.name}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Size: {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleFormCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleBulkUpload}
                      disabled={!selectedFile}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Transactions
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* <DataTable data={data} /> */}
    </div>
  );
}
