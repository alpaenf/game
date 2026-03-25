import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Gamepad2, Timer, ShieldCheck, Zap, BarChart3, Users, ChevronRight, Receipt, CheckCircle2, Rocket } from "lucide-react";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 relative overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1200px] pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite_reverse]" />
      </div>

      {/* Grid Pattern using pure CSS */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
          <Gamepad2 className="w-8 h-8 text-primary" /> 
          Alfaen<span className="text-gray-400 font-light">Game</span>
        </div>
        <div className="flex gap-4">
          {session ? (
            <Link 
              href="/dashboard" 
              className="px-6 py-2.5 bg-primary text-black font-semibold rounded-full hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-105 active:scale-95"
            >
              Ke Dashboard
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Masuk / Login
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32 max-w-5xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-bounce shadow-[0_0_15px_rgba(34,197,94,0.2)]">
          <Zap className="w-4 h-4 fill-primary" /> Versi V2.0 Tersedia Sekarang!
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Sistem Billing <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">
            Rental PlayStation
          </span> Modern
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
          Tinggalkan pencatatan manual. Kelola tarif, inventaris produk, pantau riwayat & kasir, serta lihat laporan keuangan Anda dalam satu dasbor cerdas.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href={session ? "/dashboard" : "/login"}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-primary text-black text-lg font-bold rounded-full hover:bg-green-500 transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] hover:-translate-y-1"
          >
            Mulai Gunakan Gratis
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#fitur"
            className="flex items-center justify-center px-8 py-4 bg-gray-900 border border-gray-700 text-white text-lg font-medium rounded-full hover:bg-gray-800 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            Pelajari Fitur
          </a>
        </div>
      </main>

      {/* Floating 3D/SVG Mockup Illustration (Abstract) */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-32">
         {/* Perspective Wrapper */}
         <div className="relative rounded-[2rem] border border-gray-800/80 bg-gray-900/50 backdrop-blur-xl p-3 md:p-5 shadow-2xl overflow-hidden ring-1 ring-white/10 [transform:perspective(1200px)_rotateX(5deg)] hover:[transform:perspective(1200px)_rotateX(0deg)] transition-all duration-700 hover:shadow-[0_20px_50px_rgba(34,197,94,0.15)] animate-in slide-in-from-bottom-12 fade-in duration-[1500ms]">
            
            {/* Window header */}
            <div className="flex items-center gap-2 mb-4 px-4 pb-4 border-b border-gray-800/50">
               <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors"></div>
               <div className="w-3 h-3 rounded-full bg-primary/80 hover:bg-green-400 transition-colors"></div>
            </div>
            
            {/* Dashboard SVG Wireframe - Glowing elements */}
            <svg width="100%" height="auto" viewBox="0 0 1000 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-gray-800 block">
               {/* Sidebar */}
               <rect x="20" y="20" width="200" height="360" rx="12" fill="#111111" stroke="currentColor" strokeWidth="2" />
               <rect x="40" y="50" width="160" height="24" rx="4" fill="#22c55e" fillOpacity="0.15" />
               <path d="M48 62 H80" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
               <rect x="40" y="90" width="160" height="24" rx="4" fill="#1a1a1a" />
               <rect x="40" y="130" width="160" height="24" rx="4" fill="#1a1a1a" />
               <rect x="40" y="170" width="160" height="24" rx="4" fill="#1a1a1a" />
               
               {/* Main content grids */}
               <rect x="250" y="20" width="220" height="150" rx="12" fill="#161616" stroke="currentColor" strokeWidth="2" />
               <circle cx="360" cy="80" r="30" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="4" className="animate-[pulse_3s_ease-in-out_infinite]" />
               <path d="M360 80 L360 60" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
               <rect x="280" y="130" width="100" height="12" rx="4" fill="#333333" />
               
               <rect x="490" y="20" width="220" height="150" rx="12" fill="#161616" stroke="currentColor" strokeWidth="2" />
               <rect x="520" y="74" width="120" height="12" rx="4" fill="#333333" />
               <rect x="520" y="130" width="80" height="12" rx="4" fill="#444444" />
               
               <rect x="730" y="20" width="220" height="150" rx="12" fill="#161616" stroke="currentColor" strokeWidth="2" />
               <path d="M760 110 L800 60 L850 90 L900 40" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="animate-[pulse_4s_ease-in-out_infinite]" />
               
               {/* Transaksi Aktif list */}
               <rect x="250" y="190" width="700" height="190" rx="12" fill="#111111" stroke="currentColor" strokeWidth="2" />
               <rect x="280" y="220" width="150" height="16" rx="4" fill="#333333" />
               <rect x="280" y="260" width="640" height="40" rx="6" fill="#1a1a1a" />
               <circle cx="900" cy="280" r="8" fill="#22c55e" />
               <rect x="280" y="310" width="640" height="40" rx="6" fill="#1a1a1a" />
               <circle cx="900" cy="330" r="8" fill="#333333" />
            </svg>

            {/* Overlay Gradient to make it fade cleanly */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[rgba(10,10,10,0.1)] z-10 pointer-events-none rounded-[2rem]" />
         </div>
      </div>

      {/* Features Bento Grid */}
      <section id="fitur" className="relative z-10 bg-black/40 border-y border-gray-800/50 backdrop-blur-lg py-32">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 tracking-tight">Kekuatan di Tangan Anda</h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16 text-lg">
               Sistem komprehensif yang dirancang spesifik untuk mendukung operasional lapangan rental PlayStation secara optimal.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {/* Feature 1 */}
               <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 hover:border-primary/50 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] group hover:-translate-y-1 cursor-default">
                  <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Timer className="w-7 h-7 text-primary group-hover:animate-[spin_4s_linear_infinite]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Timer Otomatis & Presisi</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                     Tanpa tebak-tebakan. Billing dihitung absolut secara *real-time* ke satuan detik dan dikalkulasikan ke harga yang selalu berjalan dinamis.
                  </p>
               </div>

               {/* Feature 2 */}
               <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 hover:border-purple-500/50 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] group hover:-translate-y-1 cursor-default">
                  <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Users className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Batasan Akses Kasir</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                     Multi-role System. Fitur penghapusan riwayat terkunci untuk kasir. Berikan akses aman tanpa takut uang terhapus atau dikorupsi staf.
                  </p>
               </div>

               {/* Feature 3 */}
               <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] group hover:-translate-y-1 cursor-default">
                  <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <ShieldCheck className="w-7 h-7 text-blue-400 group-hover:animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Cloud Database Valid</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                     Didukung infrastruktur Supabase Cloud. Data Anda tersimpan kuat meminimalisasir insiden buku nota yang hilang.
                  </p>
               </div>

               {/* Feature 4: Lg spans 2 cols */}
               <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 md:col-span-2 hover:border-orange-500/50 transition-all hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] group relative overflow-hidden hover:-translate-y-1 cursor-default">
                  <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 duration-700">
                     <BarChart3 className="w-64 h-64 text-orange-500" />
                  </div>
                  <div className="relative z-10 w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Receipt className="w-7 h-7 text-orange-400" />
                  </div>
                  <h3 className="relative z-10 text-xl font-bold mb-3 text-white">Gabungan Produk F&B Pada Struk</h3>
                  <p className="relative z-10 text-gray-400 leading-relaxed text-sm max-w-lg">
                     Punya jualan Indomie, Kopi, atau makanan ringan? Sistem ini memungkinkan Anda membuat daftar Menu Produk dan menambahkannya langsung ke dalam Tagihan yang sama. Semua tergabung dalam satu kalkulasi.
                  </p>
               </div>

                {/* Feature 5 */}
                <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 hover:border-green-500/50 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] group relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-emerald-900/10 hover:-translate-y-1 cursor-default">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik00MCAwaC0xTTEwIDBIMUMwIDEweiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPg==')] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10 w-14 h-14 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                     <Gamepad2 className="w-7 h-7 text-green-400 group-hover:animate-bounce" />
                  </div>
                  <h3 className="relative z-10 text-xl font-bold mb-3 text-white">Full Mobile Responsive</h3>
                  <p className="relative z-10 text-gray-400 leading-relaxed text-sm">
                     Antarmuka responsif dengan formasi Bottom Navbar di HP. Kasir Anda cukup klik layar smartphone untuk menjalankan billing dengan nyaman.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* How to Use Section */}
      <section className="relative z-10 py-32 bg-[#020202]">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
               <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Cara Penggunaan Cukup 3 Langkah</h2>
               <p className="text-gray-400 text-lg">
                  Sistem dibuat sangat sederhana agar mudah dipahami kasir baru sekalipun.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
               {/* Decorative line connecting steps (desktop only) */}
               <div className="hidden md:block absolute top-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10" />

               {/* Step 1 */}
               <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 text-center relative hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center text-2xl font-black text-white mx-auto mb-6 shadow-xl">1</div>
                  <h3 className="text-xl font-bold mb-3 text-white">Setup Unit PS & Harga</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                     Masuk ke menu Pengaturan, tambahkan unit TV/PS Anda dan atur tarif sewa per jamnya.
                  </p>
               </div>

               {/* Step 2 */}
               <div className="bg-[#0a0a0a] border border-primary/30 rounded-3xl p-8 text-center relative hover:-translate-y-2 transition-transform duration-300 shadow-[0_0_30px_rgba(34,197,94,0.05)]">
                  <div className="w-16 h-16 bg-primary/20 border border-primary/40 rounded-full flex items-center justify-center text-2xl font-black text-primary mx-auto mb-6 shadow-[0_0_15px_rgba(34,197,94,0.3)]">2</div>
                  <h3 className="text-xl font-bold mb-3 text-white">Mulai Transaksi</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                     Di Dashboard, langsung klik "Mulai Main" pada unit PS yang kosong. Timer Billing akan otomatis berjalan.
                  </p>
               </div>

               {/* Step 3 */}
               <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 text-center relative hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center text-2xl font-black text-white mx-auto mb-6 shadow-xl">3</div>
                  <h3 className="text-xl font-bold mb-3 text-white">Selesai & Bayar</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                     Klik Selesai saat customer stop bermain. Sistem akan menjumlah tagihan, dan Anda siap mencetak atau mengirim struk ke WhatsApp.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Investasi Cerdas untuk Bisnis Anda</h2>
            <p className="text-gray-400 text-lg">
              Satu harga, akses penuh ke semua fitur tanpa biaya tersembunyi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 hover:border-gray-600 transition-all flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Demo / Starter</h3>
              <p className="text-gray-400 mb-6">Cocok untuk mencoba sistem</p>
              <div className="text-4xl font-extrabold mb-8">Rp 0 <span className="text-lg text-gray-500 font-normal">/selamanya</span></div>
              
              <ul className="space-y-4 mb-8 flex-1 text-gray-300">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-500" /> Max 5 Unit PS</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-500" /> Max 20 Transaksi per hari</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-gray-500" /> Fitur Kasir Standar</li>
              </ul>
              <Link 
                href="/login" 
                className="w-full py-4 rounded-xl border border-gray-700 font-bold hover:bg-gray-800 transition-all flex justify-center text-gray-300"
              >
                Coba Sekarang
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-b from-[#0f1f14] to-[#0a0a0a] border border-primary/40 rounded-3xl p-8 relative flex flex-col shadow-[0_0_40px_rgba(34,197,94,0.1)] transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black font-bold px-4 py-1 rounded-full text-sm">
                PALING POPULER
              </div>
              <h3 className="text-2xl font-bold mb-2 text-primary">Pro Unlimited</h3>
              <p className="text-gray-400 mb-6">Untuk rental yang serius berkembang</p>
              <div className="text-4xl font-extrabold mb-8 text-white">Rp 99.000 <span className="text-lg text-gray-500 font-normal">/bulan</span></div>
              
              <ul className="space-y-4 mb-8 flex-1 text-gray-200">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span className="font-semibold text-white">Unlimited</span> Unit PS</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> <span className="font-semibold text-white">Unlimited</span> Transaksi</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Laporan Keuangan Detail</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Integrasi Menu F&B</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Prioritas Support 24/7</li>
              </ul>
              <Link 
                href="/login" 
                className="w-full py-4 rounded-xl bg-primary text-black font-bold hover:bg-green-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
              >
                Mulai Berlangganan <Rocket className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main CTA Section */}
      <section className="relative z-10 py-24 mb-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-r from-green-900/40 via-primary/20 to-green-900/40 border border-primary/30 rounded-[2.5rem] p-12 text-center backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik00MCAwaC0xTTEwIDBIMUMwIDEweiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPg==')] opacity-20 pointer-events-none" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">
              Siap Mengubah Cara Anda <br className="hidden md:block" />Mengelola Rental PS?
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto relative z-10 font-medium">
              Ribuan pembukuan transaksi manual telah tergantikan. Bergabunglah sekarang dan rasakan kemudahan mengontrol pemasukan Anda.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link 
                href="/login" 
                className="px-10 py-4 bg-primary text-black font-bold text-lg rounded-full hover:bg-green-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(34,197,94,0.4)]"
              >
                Buat Akun Gratis Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/80 bg-[#020202] py-12">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
              <Gamepad2 className="w-6 h-6 text-gray-600" /> 
              <span className="text-gray-600">Alfaen<span className="font-light">Game</span></span>
            </div>
            <p className="text-gray-500 text-sm font-medium">
              Made for PlayStation Rentals. © {new Date().getFullYear()}
            </p>
         </div>
      </footer>
    </div>
  );
}
