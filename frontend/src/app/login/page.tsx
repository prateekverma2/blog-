"use client";
export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { SERVER_ADDR } from "../utils/atom";
import { isLoggedInAtom,userIdAtom,usernameAtom } from "../utils/atom";
import { useAtom } from "jotai";
import axios,{AxiosError} from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [,setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [,setUserId] = useAtom(userIdAtom);
  const [,setUsername] = useAtom(usernameAtom);
  const router = useRouter();
  const redirectTo =  "/dashboard";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("handle submit called");
    e.preventDefault();
    setError("");
  
    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const { data } = await axios.post(`${SERVER_ADDR}/api/auth/login`, { email, password });
      
      Cookies.set("token", data.token, { expires: 1, secure: true, sameSite: "Strict" });
      Cookies.set("userId", data.userId, { expires: 1, secure: true, sameSite: "Strict" });
      Cookies.set("username", data.email, { expires: 1, secure: true, sameSite: "Strict" });
      setUserId(data.userId);
      setUsername(data.email);
      setIsLoggedIn(true);
      toast.success("Login successful!");
      router.replace(redirectTo);
      
    } catch (error: unknown) {
          setError(((error as AxiosError).response?.data as { error: string })?.error || "Signup failed");
          toast.error("login error")
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Suspense fallback={<h1>Loading ...</h1>}>
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 bg-[#070707] border-[1px] border-opacity-20 border-white shadow rounded animate-in fade-in-0 text-slate-200">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-1">
            <Label htmlFor="login-email" className="text-white">
              Email
            </Label>
            <Input
              id="login-email"
              type="email"
              placeholder="acme@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border-[2px] border-white border-opacity-100 text-white"
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="login-password" className="text-white">
              Password
            </Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border-[2px] border-white border-opacity-100 text-white"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="underline text-slate-200">
            Sign Up
          </a>
        </p>
      </div>
    </div>
    </Suspense>
  );
}