"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { SERVER_ADDR } from "../utils/atom";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      await axios.post(`${SERVER_ADDR}/api/auth/signup`, { email, password , username});
      toast.success("Signup successful! Redirecting to login...");
      router.push("/login");
    } catch (error: unknown) {
      setError(((error as AxiosError).response?.data as { error: string })?.error || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 bg-[#070707] border-[1px] border-opacity-20 border-white shadow rounded animate-in fade-in-0 text-slate-200">
        <h2 className="text-2xl font-bold text-center mb-6 ">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-1">
            <Label htmlFor="signup-email" className="text-white">
              Email
            </Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border-[2px] border-white border-opacity-100 text-white"
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="signup-email" className="text-white">
              Email
            </Label>
            <Input
              id="signup-username"
              type="username"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black border-[2px] border-white border-opacity-100 text-white"
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="signup-password" className="text-white">
              Password
            </Label>
            <Input
              id="signup-password"
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
          Already have an account?{" "}
          <a href="/login" className="text-slate-200 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
