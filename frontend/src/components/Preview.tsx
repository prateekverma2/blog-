"use client";

import { formatDistance } from "date-fns";
import { Separator } from "@radix-ui/react-separator";
import remarkGfm from "remark-gfm";
import React from "react";
import Markdown from "react-markdown";

interface PostPreviewProps {
  title: string;
  content: string;
}

export default function PostPreview({ title, content }: PostPreviewProps) {
  const readTime = Math.ceil(content.split(" ").length / 200);
  const timeAgo = formatDistance(new Date(), new Date(), { addSuffix: true });
  
  return (
    <div className="rounded-lg border p-5">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold">{title || "Untitled Post"}</h3>
        <div className="flex items-center space-x-2 h-5">
          <span className="text-gray-400 text-sm">{timeAgo}</span>
          <Separator orientation="vertical" />
          <span className="text-gray-400 text-sm">{readTime} min read</span>
        </div>
      </div>    
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-5">
        <Markdown
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </Markdown>
      </div>
    </div>
  );
}
