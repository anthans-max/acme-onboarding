import { CompletionHero } from "@/components/onboarding/completion-hero";
import {
  getBuildingAccess,
  getDocuments,
  getEquipment,
  getOrSeedEmployee,
  getSystems,
} from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function CompletePage() {
  const [{ employee }, systems, documents, equipment, access] = await Promise.all([
    getOrSeedEmployee(),
    getSystems(),
    getDocuments(),
    getEquipment(),
    getBuildingAccess(),
  ]);
  return <CompletionHero employee={employee} systems={systems} documents={documents} equipment={equipment} access={access} />;
}
