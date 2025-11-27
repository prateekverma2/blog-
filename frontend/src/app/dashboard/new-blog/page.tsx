"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PostPreview from "@/components/Preview";
import axios from "axios";
import { SERVER_ADDR } from "@/app/utils/atom";
import Cookies from "js-cookie";
import { logoutUser } from "@/app/utils/atom";
import { UploadButton } from "@/app/utils/uploadthing";
import toast, { Toaster } from 'react-hot-toast';


export default function BlogEditor() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageURL,setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      toast.error("title and content are required")
      return;
    }
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      if(!token) {
        logoutUser();
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      await axios.post(
        `${SERVER_ADDR}/api/posts/create`,
        { title: title.trim(), content: content.trim(),imageUrl : imageURL || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Post published successfully!");
      router.push("/dashboard");
    } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
            toast.error("session timeout please login again")
            logoutUser();
            router.push("/login");
        } else {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mt-20 mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Write a New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Input
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold"
          />
          {!imageURL ? <UploadButton endpoint="imageUploader" 
            onClientUploadComplete = {(res) => {
              console.log("Upload complete",res);
              setImageUrl(res[0].ufsUrl)
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
            className="m-4 ut-button:bg-[#0e0d0d] ut-button:border ut-button:border-1 ut-button:hover:opacity-80"
          /> : <h1>File Uploaded</h1> }
        </div>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <Textarea
              placeholder="Write your post content here... (Markdown supported)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] font-mono"
            />
          </TabsContent>
          <TabsContent value="preview">
            <PostPreview title={title} content={content}/>
          </TabsContent>
        </Tabs>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" className="min-w-[100px]" disabled={isLoading}>
            {isLoading ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </form>
    </div>
  );
}
