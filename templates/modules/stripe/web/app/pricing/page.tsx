import { PricingTable } from "@/components/features/billing/PricingTable";
import { Navbar } from "@/components/layout/Navbar";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center py-24">
        <PricingTable />
      </main>
    </>
  );
}
