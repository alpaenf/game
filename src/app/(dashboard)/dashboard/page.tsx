import PSGrid from "@/features/ps-units/components/PSGrid";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">Monitor Area PS</h1>
          <p className="text-gray-600 dark:text-gray-400">Pusat kontrol stasiun PlayStation dengan real-time timer.</p>
        </div>
      </div>
      
      <PSGrid />
    </div>
  );
}