import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Filter, MoreHorizontal, SortAsc, SortDesc, ArrowUpDown, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types/transaction";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { useTransactions, useTransactionStore } from "@/store/transaction-store";

const createColumns = (actions: {
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  setDeleteDialog: (transaction: Transaction | null) => void;
}): ColumnDef<Transaction>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? "indeterminate"
            : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div
        className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
          row.getValue("type") === "income"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
        }`}
      >
        {row.getValue("type")}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("category")}</div>
    ),
  },
  {
    accessorKey: "account",
    header: "Account",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("account")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const type = row.getValue("type") as string;

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return (
        <div
          className={`text-right font-medium ${
            type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {type === "income" ? "+" : "-"}
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "transactionDate",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("transactionDate") as Date;
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
            >
              {tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="text-xs text-muted-foreground">
              +{tags.length - 2} more
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string;
      const truncatedNotes = notes.length > 10 ? notes.substring(0, 10) + "..." : notes;
      
      if (!notes) {
        return <span className="text-muted-foreground">—</span>;
      }
      
      if (notes.length <= 10) {
        return <span className="text-sm">{notes}</span>;
      }
      
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isHovered, setIsHovered] = React.useState(false);
      
      return (
        <Popover open={isHovered} onOpenChange={setIsHovered}>
          <PopoverTrigger asChild>
            <div
              className="text-sm cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {truncatedNotes}
            </div>
          </PopoverTrigger>
          <PopoverContent 
            className="w-80" 
            align="start"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="space-y-2">
              <h4 className="font-medium">Transaction Notes</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {notes}
              </p>
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;

      const handleDelete = () => {
        actions.setDeleteDialog(transaction);
      };

      const handleEdit = () => {
        // TODO: Implement edit functionality
        console.log('Edit transaction:', transaction.id);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit transaction
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete transaction
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function TransactionsDataTable() {
  // Get transactions, search, sort, and itemsCount state from Zustand store
  const data = useTransactions();
  const search = useTransactionStore((state) => state.search);
  const setSearch = useTransactionStore((state) => state.setSearch);
  const itemsCount = useTransactionStore((state) => state.itemsCount);
  const setItemsCount = useTransactionStore((state) => state.setItemsCount);
  const sortBy = useTransactionStore((state) => state.sort.sortBy);
  const sortOrder = useTransactionStore((state) => state.sort.sortOrder);
  const setSortBy = useTransactionStore((state) => state.setSortBy);
  const setSortOrder = useTransactionStore((state) => state.setSortOrder);
  const clearSort = useTransactionStore((state) => state.clearSort);
  
  // Get all transaction actions that might be needed in columns
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
  const updateTransaction = useTransactionStore((state) => state.updateTransaction);
  
  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = React.useState<Transaction | null>(null);

  // Create columns with all transaction actions
  // Note: All functions (deleteTransaction, updateTransaction, setDeleteDialog) are stable,
  // so we don't need useMemo here. This prevents infinite re-render loops.
  const transactionActions = {
    deleteTransaction,
    updateTransaction,
    setDeleteDialog,
  };
  const columns = createColumns(transactionActions);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  
  // Filter states (sort is now managed by store)
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [dateRange, setDateRange] = React.useState<{ from?: Date; to?: Date }>({});

  // Calculate active filter count
  const filterCount = React.useMemo(() => {
    let count = 0;
    
    // Count date range filter
    if (dateRange.from || dateRange.to) {
      count += 1;
    }
    
    // Count selected categories
    count += selectedCategories.length;
    
    // Count selected tags
    count += selectedTags.length;
    
    return count;
  }, [dateRange, selectedCategories, selectedTags]);

  // Extract unique tags and categories from data
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    data.forEach(transaction => {
      transaction.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [data]);

  const allCategories = React.useMemo(() => {
    const categories = new Set<string>();
    data.forEach(transaction => {
      categories.add(transaction.category);
    });
    return Array.from(categories).sort();
  }, [data]);

  // Apply sorting when sortBy or sortOrder changes
  React.useEffect(() => {
    if (sortBy) {
      setSorting([{ id: sortBy, desc: sortOrder === "desc" }]);
    } else {
      setSorting([]);
    }
  }, [sortBy, sortOrder]);

  // Custom filtering logic for search and filters
  const filteredData = React.useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((transaction) => {
        // Search in name
        const nameMatch = transaction.name.toLowerCase().includes(searchLower);
        
        // Search in category
        const categoryMatch = transaction.category.toLowerCase().includes(searchLower);
        
        // Search in tags
        const tagsMatch = transaction.tags.some(tag => 
          tag.toLowerCase().includes(searchLower)
        );
        
        return nameMatch || categoryMatch || tagsMatch;
      });
    }

    // Apply date range filter
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.transactionDate);
        
        if (dateRange.from && dateRange.to) {
          // Both dates selected - check if transaction is within range
          return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
        } else if (dateRange.from) {
          // Only from date selected - check if transaction is after or on from date
          return transactionDate >= dateRange.from;
        } else if (dateRange.to) {
          // Only to date selected - check if transaction is before or on to date
          return transactionDate <= dateRange.to;
        }
        
        return true;
      });
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((transaction) => 
        selectedCategories.includes(transaction.category)
      );
    }

    // Apply tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((transaction) => 
        transaction.tags.some(tag => selectedTags.includes(tag))
      );
    }

    return filtered;
  }, [data, search, dateRange, selectedCategories, selectedTags]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: itemsCount,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Sync table page size with store itemsCount
  React.useEffect(() => {
    table.setPageSize(itemsCount);
  }, [itemsCount, table]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search transactions by name, category, or tags..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
        
        <div className="flex items-center gap-2">
          {/* Sort Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                {sortOrder === "asc" ? (
                  <SortAsc className="mr-2 h-4 w-4" />
                ) : sortOrder === "desc" ? (
                  <SortDesc className="mr-2 h-4 w-4" />
                ) : (
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                )}
                {sortBy ? (
                  <span className="capitalize">
                    Sort by {sortBy === "transactionDate" ? "Date" : sortBy}
                  </span>
                ) : (
                  "Sort"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sort by</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field to sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="transactionDate">Transaction Date</SelectItem>
                      <SelectItem value="type">Type</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Order</Label>
                  <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSort}
                  className="w-full"
                >
                  Reset to Default
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Filter Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {filterCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                    {filterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date Range</Label>
                  <DatePickerWithRange 
                    from={dateRange.from}
                    to={dateRange.to}
                    setRange={setDateRange}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Categories</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {allCategories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== category));
                            }
                          }}
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {allTags.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTags([...selectedTags, tag]);
                            } else {
                              setSelectedTags(selectedTags.filter(t => t !== tag));
                            }
                          }}
                        />
                        <Label htmlFor={`tag-${tag}`} className="text-sm">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedTags([]);
                    setDateRange({});
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${itemsCount}`}
              onValueChange={(value) => {
                const newItemsCount = Number(value);
                setItemsCount(newItemsCount);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]" id="rows-per-page">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
                
                {deleteDialog && (
                  <div className="bg-muted p-3 rounded-md space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Name:</span>
                      <span className="font-medium">{deleteDialog.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Amount:</span>
                      <span className={`font-medium ${
                        deleteDialog.type === "income" 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {deleteDialog.type === "income" ? "+" : "-"}
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(deleteDialog.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Type:</span>
                      <span className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
                        deleteDialog.type === "income"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      }`}>
                        {deleteDialog.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Category:</span>
                      <span className="font-medium capitalize">{deleteDialog.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Date:</span>
                      <span className="font-medium">{deleteDialog.transactionDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deleteDialog) {
                  deleteTransaction(deleteDialog.id);
                  setDeleteDialog(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Transaction
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}