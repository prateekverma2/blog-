import React from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BlogCardProps } from "@/app/utils/types";

interface UserBlogCardProps {
  blog: BlogCardProps;
}

const UserBlogCard: React.FC<UserBlogCardProps> = ({ blog }) => {
  const { title, content, createdAt, id, imageURL } = blog;
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const words = content.split(/\s+/).slice(0, 10).join(" ");
  const preview = words.length < content.length ? `${words}...` : words;

  return (
    <Link href={`/blog/${id}`} className="block h-full">
      <Card className="h-full overflow-hidden border border-white/10 bg-[#070707] rounded transition-all duration-300 hover:bg-[#121111] hover:shadow-md hover:scale-105">
      {imageURL && (
          <div className="w-full h-40 overflow-hidden">
            <img 
              src={imageURL} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader className="p-4 pb-0">
          <h3 className="text-xl font-bold font-header text-white line-clamp-3">
            {title}
          </h3>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="text-base text-gray-300 line-clamp-2">
            <Markdown remarkPlugins={[remarkGfm]}>{preview}</Markdown>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <span className="text-sm text-gray-400">{formattedDate}</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default UserBlogCard;
