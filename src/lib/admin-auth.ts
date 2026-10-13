import { createSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getAdminContext() {
  const configured = hasSupabaseConfig();
  if (!configured) return { configured: false as const, supabase: null, userEmail: "modo demonstração" };
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase!.auth.getUser();
  if (!user?.email) redirect("/admin/login");
  const { data: allowlisted } = await supabase!.from("admin_users").select("email").ilike("email", user.email).maybeSingle();
  if (!allowlisted) {
    await supabase!.auth.signOut();
    redirect("/admin/login?unauthorized=1");
  }
  return { configured: true as const, supabase: supabase!, userEmail: user.email };
}
