import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export const metadata: Metadata = {
  title: "Dashboard - ConcursoTrack",
  description: "Gerencie seus concursos públicos",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get authenticated user (middleware already protects this route)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Double check authentication
  if (!user) {
    redirect("/auth");
  }

  return (
    <DashboardLayout userEmail={user.email}>
      {children}
    </DashboardLayout>
  );
}
