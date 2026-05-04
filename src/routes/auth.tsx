import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const search = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Sign in | BuildHub" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [signin, setSignin] = useState({ email: "", password: "" });
  const [signup, setSignup] = useState({ email: "", password: "", name: "" });

  useEffect(() => {
    if (user) navigate({ to: redirect ?? "/", replace: true });
  }, [user, redirect, navigate]);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: signin.email, password: signin.password });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Welcome back!");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: signup.email,
      password: signup.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: signup.name },
      },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Account created! You can sign in now.");
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
        <div className="mb-8 text-center">
          <Link to="/" className="text-2xl font-black uppercase tracking-tight">
            BUILD<span className="text-primary">HUB</span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to track orders & checkout faster</p>
        </div>
        <Tabs defaultValue="signin" className="rounded-lg border border-border bg-card p-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSignin} className="space-y-4 pt-4">
              <div className="space-y-2"><Label>Email</Label><Input type="email" required value={signin.email} onChange={(e) => setSignin({ ...signin, email: e.target.value })} /></div>
              <div className="space-y-2"><Label>Password</Label><Input type="password" required value={signin.password} onChange={(e) => setSignin({ ...signin, password: e.target.value })} /></div>
              <Button type="submit" disabled={loading} className="h-11 w-full bg-primary font-bold uppercase tracking-wider">{loading ? "Signing in…" : "Sign In"}</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 pt-4">
              <div className="space-y-2"><Label>Full name</Label><Input required value={signup.name} onChange={(e) => setSignup({ ...signup, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" required value={signup.email} onChange={(e) => setSignup({ ...signup, email: e.target.value })} /></div>
              <div className="space-y-2"><Label>Password (min 6 chars)</Label><Input type="password" minLength={6} required value={signup.password} onChange={(e) => setSignup({ ...signup, password: e.target.value })} /></div>
              <Button type="submit" disabled={loading} className="h-11 w-full bg-primary font-bold uppercase tracking-wider">{loading ? "Creating…" : "Create Account"}</Button>
            </form>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
