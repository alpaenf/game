"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Gamepad2,
  LayoutDashboard,
  Box,
  History,
  Settings,
  LogOut,
  CreditCard,
  Users,
  Menu,
  X
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface SidebarProps {
  role: string;
  userName: string;
}

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      allowedRoles: ["admin", "kasir"],
    },
    {
      name: "Produk",
      href: "/produk",
      icon: Box,
      allowedRoles: ["admin", "kasir"], // Kasir diizinkan melihat produk
    },
    {
      name: "Pengguna",
      href: "/kasir",
      icon: Users,
      allowedRoles: ["admin"],
    },
    {
      name: "Riwayat",
      href: "/riwayat",
      icon: History,
      allowedRoles: ["admin", "kasir"], // Kasir diizinkan melihat riwayat
    },
    {
      name: "Pengaturan",
      href: "/pengaturan",
      icon: Settings,
      allowedRoles: ["admin"],
    },
  ];

  return (
    <>
      {/* --- MOBILE TOP HEADER --- */}
      <header className="md:hidden flex items-center justify-between px-4 h-16 bg-surface border-b border-white/10 dark:border-gray-200 dark:border-gray-200 dark:border-gray-800 fixed top-0 w-full z-40">
        <Link href="/dashboard" className="flex items-center">
          <Image src="/logo.png" alt="AlfaenGame Logo" width={120} height={28} className="w-auto h-6" priority />
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-300 dark:border-gray-700 bg-background flex items-center justify-center text-xs font-medium text-text-main">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 md:w-64 bg-surface border-r border-white/10 dark:border-gray-200 dark:border-gray-200 dark:border-gray-800 flex-col hidden md:flex transition-all duration-300">
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-white/10 dark:border-gray-200 dark:border-gray-200 dark:border-gray-800 px-6">
          <Link href="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="AlfaenGame Logo" width={140} height={32} className="w-auto h-7" priority />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => {
            if (!item.allowedRoles.includes(role)) return null;

            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gray-200 dark:bg-gray-100/10 text-gray-900 dark:text-gray-900 dark:text-gray-100"
                    : "text-gray-600 dark:text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-100/5 hover:text-gray-900 dark:hover:text-gray-700 dark:text-gray-300"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-gray-900 dark:text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-500 dark:text-gray-400")} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="border-t border-white/10 dark:border-gray-200 dark:border-gray-200 dark:border-gray-800 p-4 pb-8">
          <div className="flex items-center gap-3 mb-4 px-2 overflow-hidden">
            <div className="w-8 h-8 shrink-0 rounded border border-gray-300 dark:border-gray-300 dark:border-gray-700 bg-background flex items-center justify-center text-text-main font-medium text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-text-main truncate" title={userName}>{userName}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">{role}</span>
            </div>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-md transition-all font-medium"
          >
            <LogOut className="w-4 h-4 shrink-0" /> Keluar
          </button>
        </div>
      </aside>

      {/* --- MORE MENU POPUP (MOBILE) --- */}
      {showMoreMenu && (
        <div className="md:hidden fixed inset-0 z-[45] bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowMoreMenu(false)}>
          <div 
            className="absolute bottom-[5rem] right-4 w-48 bg-surface border border-gray-200 dark:border-gray-300 dark:border-gray-700/50 rounded-2xl shadow-2xl p-2 mb-2 animate-in slide-in-from-bottom-4 fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems
              .filter((i) => !["Dashboard", "Produk", "Riwayat", "Pengguna"].includes(i.name) && i.allowedRoles.includes(role))
              .map((item) => {
               const Icon = item.icon;
               const isActive = pathname.startsWith(item.href);
               return (
                 <Link
                   key={item.href}
                   href={item.href}
                   onClick={() => setShowMoreMenu(false)}
                   className={cn(
                     "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors",
                     isActive ? "bg-primary/10 text-primary" : "text-gray-700 dark:text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-text-main hover:bg-gray-100 dark:hover:bg-gray-200/50 dark:bg-gray-200/ dark:bg-gray-800/"
                   )}
                 >
                   <Icon className="w-5 h-5" />
                   {item.name}
                 </Link>
               );
            })}
            
            {role === 'admin' && <div className="h-px bg-gray-200 dark:bg-gray-200 dark:bg-gray-800 my-1 mx-2" />}
            
            <button
               onClick={handleLogout}
               className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400"
            >
               <LogOut className="w-5 h-5" />
               Keluar
            </button>
          </div>
        </div>
      )}

      {/* --- MOBILE BOTTOM NAVBAR --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-white/10 dark:border-gray-200 dark:border-gray-200 dark:border-gray-800 flex justify-around items-center h-[4.5rem] px-1 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        {["Produk", "Riwayat", "Dashboard", "Pengguna"]
          .map((name) => navItems.find((i) => i.name === name)!)
          .filter((item) => item?.allowedRoles.includes(role))
          .map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          // Efek bounce khusus untuk ikon tengah (Dashboard)
          const isMiddle = item.name === "Dashboard";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all",
                isActive ? "text-primary" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300"
              )}
            >
              {isMiddle ? (
                 <>
                   <div className="absolute -top-5 w-[3.25rem] h-[3.25rem] bg-surface rounded-full border-t border-gray-200 dark:border-gray-200 dark:border-gray-800 animate-bounce shadow-[0_-5px_15px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center">
                     <div className="w-10 h-10 bg-primary/20 border-2 border-primary rounded-full flex items-center justify-center text-primary shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                        <Icon className="w-[1.125rem] h-[1.125rem]" />
                     </div>
                   </div>
                   <span className="text-[10px] font-medium tracking-tight mt-6 z-30 text-text-main">{item.name}</span>
                 </>
              ) : (
                 <>
                   <Icon className="w-[22px] h-[22px]" />
                   <span className="text-[10px] font-medium tracking-tight mb-1">{item.name}</span>
                 </>
              )}
              {isActive && !isMiddle && <div className="absolute bottom-1 w-6 h-0.5 bg-primary rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]" />}
            </Link>
          );
        })}
        
        {/* Tombol Lainnya */}
        <button
           onClick={() => setShowMoreMenu(!showMoreMenu)}
           className={cn(
             "relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all",
             showMoreMenu ? "text-primary" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300"
           )}
        >
           <Menu className="w-[22px] h-[22px]" />
           <span className="text-[10px] font-medium tracking-tight mb-1">Lainnya</span>
        </button>
      </nav>
    </>
  );
}