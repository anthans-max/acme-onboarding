import { OnboardingSidebar } from "@/components/onboarding/sidebar";
import {
  getDocuments,
  getEquipment,
  getOrSeedEmployee,
  getSystems,
  isDocDone,
} from "@/lib/supabase/queries";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const [{ session }, systems, documents, equipment] = await Promise.all([
    getOrSeedEmployee(),
    getSystems(),
    getDocuments(),
    getEquipment(),
  ]);

  const counts = {
    systems: { total: systems.length },
    documents: { total: documents.length, done: documents.filter((d) => isDocDone(d.status)).length },
    equipment: { total: equipment.length, done: equipment.filter((e) => e.is_received).length },
  };

  return (
    <div className="lg:grid lg:grid-cols-[260px_1fr] min-h-[calc(100vh-56px)] bg-white">
      <OnboardingSidebar session={session} counts={counts} />
      <div className="w-full max-w-[760px] px-4 sm:px-8 lg:px-12 py-6 lg:py-10">{children}</div>
    </div>
  );
}
