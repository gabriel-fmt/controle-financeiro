"use client";

import { clearQuizResultsAction } from "@/app/admin/actions";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

function DeleteButton({ confirmed }: { confirmed: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={!confirmed || pending}>
      <Trash2 size={16} />
      {pending ? "Apagando participações…" : "Apagar todas as participações"}
    </button>
  );
}

export function ClearResultsForm() {
  const [confirmation, setConfirmation] = useState("");
  const confirmed = confirmation === "APAGAR TESTES";

  return (
    <section className="maintenance-panel" aria-labelledby="maintenance-title">
      <div className="maintenance-heading">
        <span><AlertTriangle size={19} /></span>
        <div>
          <h2 id="maintenance-title">Limpar participações de teste</h2>
          <p>Remove nomes, respostas, resultados e tentativas. As questões e os usuários administrativos serão mantidos.</p>
        </div>
      </div>
      <form action={clearQuizResultsAction} className="clear-results-form">
        <label htmlFor="confirmation">
          Para confirmar, digite <b>APAGAR TESTES</b>
        </label>
        <div>
          <input
            id="confirmation"
            name="confirmation"
            type="text"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            placeholder="APAGAR TESTES"
            aria-describedby="clear-results-warning"
          />
          <DeleteButton confirmed={confirmed} />
        </div>
        <small id="clear-results-warning">Esta ação é permanente e não pode ser desfeita pelo painel.</small>
      </form>
    </section>
  );
}
