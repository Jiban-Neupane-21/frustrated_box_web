// app/register/page.tsx
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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name: formData.name,
        username: formData.username.toLowerCase().trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      router.push("/"); // Registration सफल भएपछि सिधै होम पेजमा
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : undefined;
      setError(
        message || "Registeration failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#0d0d0f] border-[#2a0808] text-zinc-100 shadow-2xl shadow-red-950/20">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-red-600">
            Join FrustratedBox
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            Create an account to vent anonymously or with your handle.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 text-xs rounded bg-red-950/60 border border-red-800 text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs text-zinc-300">
                Display Name
              </Label>
              <Input
                id="name"
                placeholder="Rage Beast"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-[#141416] border-zinc-800 focus-visible:ring-red-700 text-zinc-100 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs text-zinc-300">
                Username
              </Label>
              <Input
                id="username"
                placeholder="rage_beast"
                value={formData.username}
                onChange={handleChange}
                required
                className="bg-[#141416] border-zinc-800 focus-visible:ring-red-700 text-zinc-100 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-zinc-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="rage@example.com"
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-[#141416] border-zinc-800 focus-visible:ring-red-700 text-zinc-100 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-xs text-zinc-300"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-[#141416] border-zinc-800 focus-visible:ring-red-700 text-zinc-100 text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-800 hover:bg-red-700 text-white font-medium transition"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-zinc-800/60 pt-4">
          <p className="text-xs text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="text-red-500 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
