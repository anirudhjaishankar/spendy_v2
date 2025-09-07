import React, { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

export interface SingleTransactionFormData {
  name: string;
  amount: number;
  from: string;
  to: string;
  type: "income" | "expense";
  category: string;
  transactionDate: Date;
  notes: string;
  tags: string[];
}

interface SingleTransactionFormProps {
  onSubmit?: (data: SingleTransactionFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<SingleTransactionFormData>;
}

export function SingleTransactionForm({ onSubmit, onCancel, initialData }: SingleTransactionFormProps) {
  const [formData, setFormData] = useState<SingleTransactionFormData>({
    name: initialData?.name || "",
    amount: initialData?.amount || 0,
    from: initialData?.from || "",
    to: initialData?.to || "",
    type: initialData?.type || "expense",
    category: initialData?.category || "",
    transactionDate: initialData?.transactionDate || new Date(),
    notes: initialData?.notes || "",
    tags: initialData?.tags || [],
  });

  const [tagInput, setTagInput] = useState("");

  const handleInputChange = (field: keyof SingleTransactionFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        handleInputChange("tags", [...formData.tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      amount: 0,
      from: "",
      to: "",
      type: "expense",
      category: "",
      transactionDate: new Date(),
      notes: "",
      tags: [],
    });
    setTagInput("");
  };

  const categories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Personal Care",
    "Gifts & Donations",
    "Investments",
    "Business",
    "Other",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Transaction Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Transaction Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter transaction name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            autoComplete="off"
            required
          />
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount || ""}
            onChange={(e) =>
              handleInputChange("amount", parseFloat(e.target.value) || 0)
            }
            autoComplete="off"
            required
          />
        </div>

        {/* Transaction Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Transaction Type</Label>
          <Select
            name="type"
            value={formData.type}
            onValueChange={(value: "income" | "expense") =>
              handleInputChange("type", value)
            }
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select transaction type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            name="category"
            value={formData.category}
            onValueChange={(value) => handleInputChange("category", value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* From */}
        <div className="space-y-2">
          <Label htmlFor="from">From Account/Source</Label>
          <Input
            id="from"
            name="from"
            type="text"
            placeholder="Source account or person"
            value={formData.from}
            onChange={(e) => handleInputChange("from", e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* To */}
        <div className="space-y-2">
          <Label htmlFor="to">To Account/Destination</Label>
          <Input
            id="to"
            name="to"
            type="text"
            placeholder="Destination account or person"
            value={formData.to}
            onChange={(e) => handleInputChange("to", e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* Transaction Date */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="transactionDate">Transaction Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="transactionDate"
                variant="outline"
                className="w-full md:w-auto justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.transactionDate ? (
                  format(formData.transactionDate, "PPP")
                ) : (
                  <span>Select transaction date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.transactionDate}
                onSelect={(date) =>
                  handleInputChange("transactionDate", date || new Date())
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          name="notes"
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          placeholder="Add any additional notes about this transaction..."
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          type="text"
          placeholder="Type a tag and press Enter to add"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          autoComplete="off"
        />
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <div
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="order-2 sm:order-1"
        >
          Reset Form
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="order-3 sm:order-2"
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          className="order-1 sm:order-3"
        >
          Save Transaction
        </Button>
      </div>
    </form>
  );
}