import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface Post {
  title: string;
  wordCount: number;
  id: string;
  imageUrl?: string;
  content : string
}

interface BlogCardProps {
  post: Post;
}

function stripMarkdown(markdown : string) {
  return markdown
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images ![alt](url)
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1") // Convert links [text](url) → text
    .replace(/(`{1,3}).*?\1/g, "") // Remove inline & block code (`code` or ```code```)
    .replace(/#{1,6}\s*/g, "") // Remove headers (#, ##, ###, etc.)
    .replace(/>\s?/g, "") // Remove blockquotes (>)
    .replace(/-{3,}/g, "") // Remove horizontal rules (---)
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold (**bold** → bold)
    .replace(/\*([^*]+)\*/g, "$1") // Remove italic (*italic* → italic)
    .replace(/_([^_]+)_/g, "$1") // Remove underscore italic (_italic_ → italic)
    .replace(/~{2}([^~]+)~{2}/g, "$1") // Remove strikethrough (~~text~~ → text)
    .replace(/\n{2,}/g, "\n") // Remove multiple new lines
    .replace(/`{1,3}[^`]+`{1,3}/g, "") // Remove inline code
    .replace(/[*-]\s+/g, "") // Remove list markers (- or *)
    .trim() // Remove extra spaces
}


const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const readTime = Math.ceil(post.wordCount / 200);
  const truncatedContent = stripMarkdown(post.content).slice(0,30) + (post.content.length > 30 ? '...' : '');

  return (
    <Link href={`/blog/${post.id}`} className="block h-full">
      <Card className="h-full overflow-hidden border border-white/10 bg-black hover:bg-[#121111] transition-all duration-300 hover:shadow-md hover:scale-105">
        {post.imageUrl && (
          <div className="w-full h-40 overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <CardHeader className="p-4 pb-0">
          <h3 className="text-xl font-bold font-header text-white line-clamp-2">{post.title}</h3>
        </CardHeader>
        
        <CardContent className="p-4 pt-2">
            {truncatedContent}
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            <span>{readTime} min read</span>
          </div>
          
          <Badge variant="outline" className="text-xs bg-transparent border-white/20 text-white/70">
            Article
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default BlogCard;