import { getKasirProfiles } from "@/features/kasir/services/kasirService";
import KasirClient from "@/features/kasir/components/KasirClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Pengguna - AlfaenGame",
};

export default async function KasirPage() {
  const profiles = await getKasirProfiles();

  return <KasirClient initialProfiles={profiles} />;
}
