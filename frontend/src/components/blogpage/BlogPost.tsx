
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CalendarIcon, Clock } from "lucide-react"
import { BlogData } from "@/app/utils/types"
import React from "react"

function getReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

interface BlogPostProps{
  blogData : BlogData
}

const BlogPost : React.FC<BlogPostProps> = ({ blogData })  => {
  if (!blogData) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
        <p className="font-medium">Failed to load blog post</p>
        <p className="text-sm mt-1">The requested article could not be found or is unavailable.</p>
      </div>
    )
  }
  const readingTime = getReadingTime(blogData.content)
  const formattedDate = new Date(blogData.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <article className="bg-card rounded-lg shadow-sm p-6 border">
      <img src={blogData.imageURL} className="mx-auto mb-8" alt="Blog Image" />
      <h1 className="text-3xl font-bold tracking-tight mb-2">{blogData.title}</h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
        <div className="flex items-center gap-1">
          <CalendarIcon size={16} />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span>{readingTime} min read</span>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <Markdown remarkPlugins={[remarkGfm]}>{blogData.content}</Markdown>
      </div>
    </article>
  )
}


export default BlogPost