import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SingleTransactionForm,
  type SingleTransactionFormData,
} from "@/components/ui/transaction-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";
import { TransactionFormData } from "@/types/transaction";

interface TransactionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionSubmit: (data: TransactionFormData) => void;
}

export function TransactionsDialog({
  open,
  onOpenChange,
  onTransactionSubmit,
}: TransactionsDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFormSubmit = (data: SingleTransactionFormData) => {
    onTransactionSubmit(data);
    onOpenChange(false);
  };

  const handleFormCancel = () => {
    onOpenChange(false);
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
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Choose to add a single transaction or upload multiple transactions.
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
  );
}