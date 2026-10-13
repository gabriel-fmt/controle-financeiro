import { logoutAction } from "@/app/admin/actions";
import { ClearResultsForm } from "@/components/clear-results-form";
import { getAdminContext } from "@/lib/admin-auth";
import { participantKey } from "@/lib/participant";
import { quizQuestions } from "@/quiz-config/questions";
import { BarChart3, BookOpenCheck, CircleAlert, Filter, LogOut, Medal, Repeat2, Search, Settings2, UsersRound, WalletCards, X } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Row = {
  id: string; participant_first_name: string; participant_last_name: string;
  participant_key: string; device_key: string; attempt_number: number;
  result: "verde" | "amarelo" | "vermelho"; score: number; max_score: number;
  green_count: number; yellow_count: number; red_count: number; duration_seconds: number; completed_at: string;
};

const demoRows: Row[] = [
  { id: "demo-4", participant_first_name: "Ana", participant_last_name: "Souza", participant_key: "ana souza", device_key: "device-ana", attempt_number: 2, result: "verde", score: 30, max_score: 32, green_count: 14, yellow_count: 2, red_count: 0, duration_seconds: 246, completed_at: new Date(Date.now() - 60_000).toISOString() },
  { id: "demo-3", participant_first_name: "Carla", participant_last_name: "Mendes", participant_key: "carla mendes", device_key: "device-shared", attempt_number: 1, result: "vermelho", score: 12, max_score: 32, green_count: 4, yellow_count: 4, red_count: 8, duration_seconds: 198, completed_at: new Date(Date.now() - 120_000).toISOString() },
  { id: "demo-2", participant_first_name: "Bruno", participant_last_name: "Lima", participant_key: "bruno lima", device_key: "device-shared", attempt_number: 1, result: "amarelo", score: 23, max_score: 32, green_count: 9, yellow_count: 5, red_count: 2, duration_seconds: 312, completed_at: new Date(Date.now() - 180_000).toISOString() },
  { id: "demo-1", participant_first_name: "Ana", participant_last_name: "Souza", participant_key: "ana souza", device_key: "device-ana", attempt_number: 1, result: "amarelo", score: 22, max_score: 32, green_count: 8, yellow_count: 6, red_count: 2, duration_seconds: 286, completed_at: new Date(Date.now() - 240_000).toISOString() },
];

type AdminSearchParams = Promise<{
  q?: string | string[];
  result?: string | string[];
  attempt?: string | string[];
  reset?: string | string[];
  deleted?: string | string[];
}>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPage({ searchParams }: { searchParams: AdminSearchParams }) {
  const query = await searchParams;
  const nameFilter = (firstParam(query.q) ?? "").trim().toLocaleLowerCase("pt-BR");
  const requestedResult = firstParam(query.result);
  const resultFilter = requestedResult === "verde" || requestedResult === "amarelo" || requestedResult === "vermelho" ? requestedResult : "todos";
  const requestedAttempt = firstParam(query.attempt);
  const attemptFilter = requestedAttempt === "todas" || requestedAttempt === "repeticoes" ? requestedAttempt : "primeira";
  const resetStatus = firstParam(query.reset);
  const deletedCount = Number.parseInt(firstParam(query.deleted) ?? "0", 10) || 0;

  const { configured, supabase, userEmail } = await getAdminContext();
  let rows = demoRows;
  let questionCount = quizQuestions.length;
  if (configured) {
    const [{ data: results }, { count }] = await Promise.all([
      supabase.from("quiz_results").select("id, participant_first_name, participant_last_name, participant_key, device_key, attempt_number, result, score, max_score, green_count, yellow_count, red_count, duration_seconds, completed_at").order("completed_at", { ascending: false }).limit(200),
      supabase.from("quiz_questions").select("id", { count: "exact", head: true }).eq("active", true),
    ]);
    rows = (results as Row[] | null) ?? [];
    questionCount = count ?? 0;
  }

  const attemptsByParticipant = new Map<string, number>();
  const participantsByDevice = new Map<string, Set<string>>();
  rows.forEach((row) => {
    const key = row.participant_key || participantKey(row.participant_first_name, row.participant_last_name);
    attemptsByParticipant.set(key, Math.max(attemptsByParticipant.get(key) ?? 0, row.attempt_number || 1));
    const deviceParticipants = participantsByDevice.get(row.device_key) ?? new Set<string>();
    deviceParticipants.add(key);
    participantsByDevice.set(row.device_key, deviceParticipants);
  });
  const filteredRows = rows.filter((row) => {
    const fullName = `${row.participant_first_name} ${row.participant_last_name}`.toLocaleLowerCase("pt-BR");
    const matchesName = !nameFilter || fullName.includes(nameFilter);
    const matchesResult = resultFilter === "todos" || row.result === resultFilter;
    const matchesAttempt = attemptFilter === "todas" || (attemptFilter === "primeira" ? row.attempt_number === 1 : row.attempt_number > 1);
    return matchesName && matchesResult && matchesAttempt;
  });
  const filteredTotal = filteredRows.length;
  const filteredCounts = {
    verde: filteredRows.filter((row) => row.result === "verde").length,
    amarelo: filteredRows.filter((row) => row.result === "amarelo").length,
    vermelho: filteredRows.filter((row) => row.result === "vermelho").length,
  };
  const filteredAvgScore = filteredTotal ? Math.round(filteredRows.reduce((sum, row) => sum + (row.score / row.max_score) * 100, 0) / filteredTotal) : 0;
  const filteredParticipantKeys = new Set(filteredRows.map((row) => row.participant_key || participantKey(row.participant_first_name, row.participant_last_name)));
  const uniqueParticipants = filteredParticipantKeys.size;
  const hasCustomFilters = Boolean(nameFilter) || resultFilter !== "todos" || attemptFilter !== "primeira";

  return <main className="admin-shell dashboard-shell">
    <header className="dashboard-header">
      <Link href="/" className="admin-brand"><span className="brand-mark small"><WalletCards size={22} /></span><span>Seu dinheiro<br /><b>no controle</b></span></Link>
      <div className="admin-user"><span>{userEmail}</span>{configured && <form action={logoutAction}><button className="icon-button" aria-label="Sair"><LogOut size={19} /></button></form>}</div>
    </header>
    <section className="dashboard-content">
      {!configured && <div className="setup-banner"><CircleAlert size={20} /><div><b>Dados de demonstração</b><p>Configure o Supabase para proteger o painel e salvar participantes, respostas e alterações nas questões.</p></div></div>}
      {resetStatus === "success" && <div className="success-banner"><CircleAlert size={18} /><span>{deletedCount} {deletedCount === 1 ? "participação removida" : "participações removidas"}. As questões foram mantidas.</span></div>}
      {resetStatus && resetStatus !== "success" && <div className="question-error"><CircleAlert size={18} /><span>{resetStatus === "invalid" ? "Digite exatamente APAGAR TESTES para confirmar." : "Não foi possível limpar as participações. Tente novamente."}</span></div>}
      <div className="dashboard-title"><div><p className="admin-kicker"><BarChart3 size={16} /> Visão geral</p><h1>Resultados dos participantes</h1></div><Link className="manage-questions" href="/admin/questions"><Settings2 size={17} /> Gerenciar questões</Link></div>
      <section className="admin-filters" aria-labelledby="filter-title">
        <div className="filter-heading"><div><span className="filter-icon"><Filter size={18} /></span><div><h2 id="filter-title">Filtrar resultados</h2><p>A primeira tentativa válida aparece por padrão para facilitar a premiação.</p></div></div>{hasCustomFilters && <Link href="/admin" className="clear-filters"><X size={15} /> Limpar filtros</Link>}</div>
        <form method="get" className="filter-form">
          <label className="filter-search"><span>Participante</span><div><Search size={16} /><input key={firstParam(query.q) ?? ""} name="q" type="search" defaultValue={firstParam(query.q) ?? ""} placeholder="Buscar por nome ou sobrenome" /></div></label>
          <label><span>Resultado</span><select key={resultFilter} name="result" defaultValue={resultFilter}><option value="todos">Todos os resultados</option><option value="verde">Verde</option><option value="amarelo">Amarelo</option><option value="vermelho">Vermelho</option></select></label>
          <label><span>Tentativa</span><select key={attemptFilter} name="attempt" defaultValue={attemptFilter}><option value="primeira">Somente 1ª válida</option><option value="todas">Todas as tentativas</option><option value="repeticoes">Somente repetições</option></select></label>
          <button type="submit"><Filter size={16} /> Aplicar filtros</button>
        </form>
        <nav className="attempt-quick-filters" aria-label="Filtros rápidos de tentativa">
          <Link className={attemptFilter === "primeira" ? "active" : ""} href={{ pathname: "/admin", query: { ...(nameFilter ? { q: firstParam(query.q) } : {}), ...(resultFilter !== "todos" ? { result: resultFilter } : {}), attempt: "primeira" } }}>1ª tentativa válida</Link>
          <Link className={attemptFilter === "todas" ? "active" : ""} href={{ pathname: "/admin", query: { ...(nameFilter ? { q: firstParam(query.q) } : {}), ...(resultFilter !== "todos" ? { result: resultFilter } : {}), attempt: "todas" } }}>Todas</Link>
          <Link className={attemptFilter === "repeticoes" ? "active" : ""} href={{ pathname: "/admin", query: { ...(nameFilter ? { q: firstParam(query.q) } : {}), ...(resultFilter !== "todos" ? { result: resultFilter } : {}), attempt: "repeticoes" } }}>Repetições</Link>
        </nav>
      </section>
      <div className="metric-grid">
        <article className="metric-card"><UsersRound /><span>Participantes únicos</span><strong>{uniqueParticipants}</strong></article>
        <article className="metric-card"><Repeat2 /><span>Resultados exibidos</span><strong>{filteredTotal}</strong></article>
        <article className="metric-card"><Medal /><span>Pontuação média</span><strong>{filteredAvgScore}%</strong></article>
        <article className="metric-card"><BookOpenCheck /><span>Questões ativas</span><strong>{questionCount}</strong></article>
      </div>
      <section className="result-distribution">
        <div className="panel-heading"><div><h2>Distribuição de resultados</h2><p>Classificação calculada sobre os resultados exibidos pelos filtros.</p></div></div>
        <div className="distribution-list">{(["verde", "amarelo", "vermelho"] as const).map((color) => {
          const labels = { verde: "Verde — decisão consciente", amarelo: "Amarelo — atenção", vermelho: "Vermelho — decisão arriscada" };
          const pct = filteredTotal ? Math.round((filteredCounts[color] / filteredTotal) * 100) : 0;
          return <div className={`distribution-row ${color}`} key={color}><div><span>{labels[color]}</span><b>{filteredCounts[color]} · {pct}%</b></div><div className="distribution-track"><i style={{ width: `${pct}%` }} /></div></div>;
        })}</div>
      </section>
      <section className="recent-panel">
        <div className="panel-heading"><div><h2>Participações recentes</h2><p>{filteredTotal} {filteredTotal === 1 ? "resultado encontrado" : "resultados encontrados"}. A primeira tentativa é a única válida para premiação.</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>Participante</th><th>Tentativa</th><th>Resultado</th><th>Pontuação</th><th>Verdes</th><th>Amarelas</th><th>Vermelhas</th><th>Duração</th></tr></thead><tbody>{filteredRows.slice(0, 50).map((row) => {
          const key = row.participant_key || participantKey(row.participant_first_name, row.participant_last_name);
          const attemptTotal = attemptsByParticipant.get(key) ?? 1;
          const sharedDevice = (participantsByDevice.get(row.device_key)?.size ?? 0) > 1;
          return <tr key={row.id}><td className="participant-name"><span>{row.participant_first_name} {row.participant_last_name}</span><small>{attemptTotal} {attemptTotal === 1 ? "tentativa" : "tentativas"}{sharedDevice ? " · verificar aparelho" : ""}</small></td><td><span className={`attempt-tag ${row.attempt_number === 1 ? "valid" : "repeat"}`}>{row.attempt_number}ª de {attemptTotal}<small>{row.attempt_number === 1 ? "válida para premiação" : "repetição"}</small></span></td><td><span className={`status-tag ${row.result}`}>{row.result}</span></td><td><b>{row.score}/{row.max_score}</b></td><td>{row.green_count}</td><td>{row.yellow_count}</td><td>{row.red_count}</td><td>{Math.floor(row.duration_seconds / 60)}m {row.duration_seconds % 60}s</td></tr>;
        })}{filteredRows.length === 0 && <tr><td colSpan={8}><div className="empty-filter-state"><Search size={20} /><b>Nenhum resultado encontrado</b><span>Altere ou limpe os filtros para visualizar outras participações.</span></div></td></tr>}</tbody></table></div>
      </section>
      {configured && <ClearResultsForm />}
    </section>
  </main>;
}
