"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { SERVER_ADDR } from "@/app/utils/atom";
import UserBlogCard from "./UserBlogCard";
import { BlogCardProps } from "@/app/utils/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/app/utils/atom";
import useRequireAuth from "@/app/utils/useRequireAuth";
import toast from "react-hot-toast";

export default function Dashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogCardProps[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useRequireAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      const userId = Cookies.get("userId");
      if (!userId) {
        logoutUser();
        router.push("/login");
        return;
      }

      try {
        const { data } = await axios.get(`${SERVER_ADDR}/api/posts/posts?author=${userId}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        console.log(data);
        if(data.length === 0){
          setPosts([]);
          return;
        }
        setPosts(data);
      } catch (err: Error | unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          toast.error("session timeout please login again")
          logoutUser();
          router.push("/login"); 
        } else {
          setError("Failed to fetch posts.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [router]);



  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-[#070707] px-4">
      <div className="w-full max-w-3xl p-10 bg-[#070707] shadow-lg rounded-lg animate-in fade-in-0 text-slate-200">
        <h2 className="text-3xl font-bold text-center mb-8">Dashboard</h2>
        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-sm text-center">{error}</p>
        ) : posts && posts.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Your Blogs</h3>
              <Link href="/dashboard/new-blog">
                <Button className="bg-black hover:bg-[#262626] text-white">
                  Write A New Blog
                </Button>
              </Link>
            </div>
            <div className="space-y-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <Link href={`blog/${post.id}`} key = {post.id}>
                    <UserBlogCard blog={post}/>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-400 text-lg mb-4">No posts found.</p>
            <Link href="/dashboard/new-blog" className="text-slate-200 hover:text-slate-400 underline text-lg">
              Write one 
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
