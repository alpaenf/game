import TransactionDetailClient from "@/features/transactions/components/TransactionDetailClient";

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <div className="w-full h-full">
      <TransactionDetailClient txId={id} />
    </div>
  );
}
