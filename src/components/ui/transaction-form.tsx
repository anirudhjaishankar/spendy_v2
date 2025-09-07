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
import { TransactionFormData } from "@/types/transaction";

export type { TransactionFormData as SingleTransactionFormData } from "@/types/transaction";

interface SingleTransactionFormProps {
  onSubmit?: (data: TransactionFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<TransactionFormData>;
}

export function SingleTransactionForm({ onSubmit, onCancel, initialData }: SingleTransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    name: initialData?.name || "",
    amount: initialData?.amount || 0,
    account: initialData?.account || "",
    type: initialData?.type || "expense",
    category: initialData?.category || "",
    transactionDate: initialData?.transactionDate || new Date(),
    notes: initialData?.notes || "",
    tags: initialData?.tags || [],
  });

  const [tagInput, setTagInput] = useState("");
  const [categoryInput, setCategoryInput] = useState(initialData?.category || "");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categories, setCategories] = useState([
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
  ]);

  const handleInputChange = (field: keyof TransactionFormData, value: string | number | Date | string[]) => {
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

  const handleCategoryInputChange = (value: string) => {
    setCategoryInput(value);
    setShowCategoryDropdown(value.length > 0);
  };

  const handleCategorySelect = (category: string) => {
    handleInputChange("category", category);
    setCategoryInput(category);
    setShowCategoryDropdown(false);
  };

  const handleCreateCategory = (newCategory: string) => {
    const trimmedCategory = newCategory.trim();
    if (trimmedCategory && !categories.includes(trimmedCategory)) {
      setCategories(prev => [...prev, trimmedCategory]);
    }
    handleInputChange("category", trimmedCategory);
    setCategoryInput(trimmedCategory);
    setShowCategoryDropdown(false);
  };

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(categoryInput.toLowerCase())
  );

  const exactMatch = categories.find(category => 
    category.toLowerCase() === categoryInput.toLowerCase()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      amount: 0,
      account: "",
      type: "expense",
      category: "",
      transactionDate: new Date(),
      notes: "",
      tags: [],
    });
    setTagInput("");
    setCategoryInput("");
    setShowCategoryDropdown(false);
  };

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

        {/* Category - Autocomplete Input */}
        <div className="space-y-2 relative">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            type="text"
            placeholder="Type or select a category"
            value={categoryInput}
            onChange={(e) => handleCategoryInputChange(e.target.value)}
            onFocus={() => setShowCategoryDropdown(categoryInput.length > 0)}
            onBlur={() => {
              // Delay hiding dropdown to allow clicking on options
              setTimeout(() => setShowCategoryDropdown(false), 200);
            }}
            autoComplete="off"
          />
          
          {/* Dropdown with suggestions and create option */}
          {showCategoryDropdown && (
            <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-auto">
              {filteredCategories.length > 0 && (
                <>
                  {filteredCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-muted focus:bg-muted focus:outline-none text-foreground"
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category}
                    </button>
                  ))}
                </>
              )}
              
              {/* Create new category option */}
              {categoryInput.trim() && !exactMatch && (
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left hover:bg-primary/10 focus:bg-primary/10 focus:outline-none text-primary border-t border-border"
                  onClick={() => handleCreateCategory(categoryInput)}
                >
                  Create "{categoryInput}"
                </button>
              )}
              
              {/* No results message */}
              {filteredCategories.length === 0 && !categoryInput.trim() && (
                <div className="px-3 py-2 text-muted-foreground text-sm">
                  Start typing to see suggestions
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account - Dynamic label based on transaction type */}
        <div className="space-y-2">
          <Label htmlFor="account">
            {formData.type === "expense" ? "To" : "From"}
          </Label>
          <Input
            id="account"
            name="account"
            type="text"
            placeholder={
              formData.type === "expense" 
                ? "Where the money went (account, person, etc.)" 
                : "Where the money came from (account, person, etc.)"
            }
            value={formData.account}
            onChange={(e) => handleInputChange("account", e.target.value)}
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