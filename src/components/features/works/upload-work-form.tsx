"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import Image from "next/image";

const schema = z.object({
  title: z.string().min(1, "標題為必填").max(60, "標題最多 60 字"),
  category: z.enum(["planning", "marketing", "product", "course", "sales", "other"]),
  description: z.string().min(10, "描述至少 10 字").max(500, "描述最多 500 字"),
});

type FormData = z.infer<typeof schema>;

const categoryOptions = [
  { value: "planning", label: "企劃" },
  { value: "marketing", label: "行銷" },
  { value: "product", label: "產品設計" },
  { value: "course", label: "課程設計" },
  { value: "sales", label: "銷售文案" },
  { value: "other", label: "其他" },
];

interface Props {
  onSuccess?: () => void;
}

export function UploadWorkForm({ onSuccess }: Props) {
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: "planning" },
  });

  const descLength = watch("description")?.length || 0;

  function addTag(e: React.KeyboardEvent) {
    if (e.key === "Enter" && tagInput.trim() && tags.length < 5) {
      e.preventDefault();
      const tag = tagInput.trim();
      if (!tags.includes(tag)) setTags([...tags, tag]);
      setTagInput("");
    }
  }

  async function onSubmit(data: FormData) {
    if (!imageUrl) {
      toast.error("請先上傳作品圖片");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, imageUrl, tags }),
      });

      if (res.ok) {
        toast.success("作品已送出審核，通過後將公開顯示！");
        onSuccess?.();
      } else {
        const err = await res.json();
        toast.error(err.error || "上傳失敗");
      }
    } catch {
      toast.error("上傳失敗，請稍後再試");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">作品標題 *</Label>
        <Input
          id="title"
          placeholder="例如「用創新思維重設計 IG 策略」"
          {...register("title")}
        />
        {errors.title && <p className="text-xs text-red">{errors.title.message}</p>}
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label htmlFor="category">作品分類 *</Label>
        <select
          id="category"
          {...register("category")}
          className="flex h-10 w-full rounded-lg border border-bd bg-white px-3 py-2 text-sm text-t1 focus:outline-none focus:ring-2 focus:ring-ind"
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">
          作品描述 * <span className="text-t3 font-normal ml-1">({descLength}/500)</span>
        </Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="說明你如何應用創新思維與 AI，做出這個成果..."
          {...register("description")}
        />
        {errors.description && <p className="text-xs text-red">{errors.description.message}</p>}
      </div>

      {/* Image Upload */}
      <div className="space-y-1.5">
        <Label>作品圖片 *</Label>
        {imageUrl ? (
          <div className="relative">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-bg2">
              <Image src={imageUrl} alt="作品圖片" fill className="object-cover" />
            </div>
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-t2 hover:text-red"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-bd rounded-lg p-6 text-center">
            <UploadButton<OurFileRouter, "workImage">
              endpoint="workImage"
              onClientUploadComplete={(res) => {
                if (res?.[0]?.url) setImageUrl(res[0].url);
              }}
              onUploadError={(err) => { toast.error(err.message); }}
              appearance={{
                button: "bg-ind text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-ind-dk",
                allowedContent: "text-t3 text-xs",
              }}
            />
            <p className="text-xs text-t3 mt-2">支援 JPG / PNG / WebP，最大 4MB</p>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <Label>標籤（選填，最多 5 個）</Label>
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={addTag}
          placeholder="輸入標籤後按 Enter 新增"
          disabled={tags.length >= 5}
        />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs bg-ind-bg text-ind rounded-full px-2.5 py-1">
                #{tag}
                <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" disabled={submitting} className="w-full gap-2">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        送出作品（審核後公開）
      </Button>
    </form>
  );
}
