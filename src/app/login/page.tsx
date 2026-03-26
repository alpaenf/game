import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  async function loginAction(formData: FormData) {
    "use server";
    
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    if (!email || !password) {
      redirect(`/login?error=${encodeURIComponent("Email dan Password wajib diisi.")}`);
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    redirect("/dashboard");
  }

  // we can get error passed in the query param through a component or parse it here,
  // but to keep page simple as server component, we read from search params if passed (in next.js 15 page component it is await params)
  // Let's refactor this to pure client interaction for simplicity or keep action but void.


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text-main relative px-4">
      <Link 
        href="/" 
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-text-main transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Landing Page
      </Link>

      <div className="w-full max-w-sm p-8 bg-surface rounded-xl border border-gray-200 dark:border-gray-200 dark:border-gray-800 shadow-sm z-10">
        <div className="mb-8 flex flex-col items-start">
          <Image src="/logo.png" alt="AlfaenGame Logo" width={180} height={40} className="w-auto h-8 mb-4" priority />
          <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to your workspace</p>
        </div>

        <form action={loginAction} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-widest font-medium" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded-md bg-background focus:bg-surface border-gray-300 dark:border-gray-700 focus:border-gray-500 focus:ring-0 outline-none text-sm transition-all"
              placeholder="admin@alfaen.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-widest font-medium" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md bg-background focus:bg-surface border-gray-300 dark:border-gray-700 focus:border-gray-500 focus:ring-0 outline-none text-sm transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-sm font-medium text-text-main bg-gray-100/10 hover:bg-gray-100/20 border border-gray-100/10 rounded-md transition-colors"
          >
            Continue to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}