"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadProductImage } from "@/lib/supabase/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  value?: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max file size is 5MB");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      onChange(url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative h-44 w-full rounded-lg overflow-hidden border bg-muted">
          <Image
            src={value}
            alt="Product preview"
            fill
            className="object-contain p-2"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-background border rounded-full p-1 shadow-sm hover:bg-muted transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          className={cn(
            "h-44 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
            uploading
              ? "opacity-60 cursor-wait"
              : "hover:border-primary/50 hover:bg-muted/40",
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <ImageIcon className="h-7 w-7 text-muted-foreground" />
              <p className="text-sm font-medium">Click to upload</p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP · max 5MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {!value && (
        <>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or enter URL</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <Input
            placeholder="https://example.com/image.jpg"
            onChange={(e) => onChange(e.target.value)}
          />
        </>
      )}
    </div>
  );
}
