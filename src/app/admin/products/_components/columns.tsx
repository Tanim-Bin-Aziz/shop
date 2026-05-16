"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types/index";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

interface Actions {
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function getColumns({
  onEdit,
  onDelete,
}: Actions): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "image_url",
      header: "Image",
      enableSorting: false,
      cell: ({ row }) => {
        const url = row.getValue<string | null>("image_url");
        return url ? (
          <div className="relative h-10 w-10 rounded-md overflow-hidden border">
            <Image
              src={url}
              alt={row.getValue("name")}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
            N/A
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const cat = row.getValue<string | null>("category");
        return cat ? (
          <Badge variant="secondary">{cat}</Badge>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          ৳{Number(row.getValue("price")).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue<number>("stock");
        return (
          <Badge
            variant={
              stock === 0 ? "destructive" : stock < 10 ? "outline" : "default"
            }
          >
            {stock}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onEdit(product)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(product)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];
}
