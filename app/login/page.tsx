// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/AuthContext";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(identifier, password);
      router.push("/"); // Redirect to feed upon successful login
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : undefined;
      setError(message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#0d0d0f] border-[#2a0808] text-zinc-100 shadow-2xl shadow-red-950/20">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-red-600">
            FrustratedBox
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            Log in to vent, view raw feeds, and engage.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-xs rounded bg-red-950/60 border border-red-800 text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-xs text-zinc-300">
                Email Address or Username
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder="devbro or devbro@gmail.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="bg-[#141416] border-zinc-800 focus-visible:ring-red-700 text-zinc-100 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs text-zinc-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#141416] border-zinc-800 focus-visible:ring-red-700 text-zinc-100 text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-800 hover:bg-red-700 text-white font-medium transition cursor-pointer"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-zinc-800/60 pt-4">
          <p className="text-xs text-zinc-400">
            New here?{" "}
            <Link href="/register" className="text-red-500 hover:underline">
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
