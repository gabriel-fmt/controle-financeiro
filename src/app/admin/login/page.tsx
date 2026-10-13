import { AdminLoginForm } from "@/components/admin-login-form";
import { ShieldCheck, WalletCards } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="admin-shell login-shell">
      <section className="admin-login-card">
        <div className="brand-mark"><WalletCards size={27} /></div>
        <p className="admin-kicker"><ShieldCheck size={16} /> Acesso protegido</p>
        <h1>Painel do jogo</h1>
        <p className="admin-subtitle">Acompanhe resultados e respostas dos participantes.</p>
        <AdminLoginForm />
        <Link className="text-link" href="/">← Voltar para o jogo</Link>
      </section>
    </main>
  );
}
