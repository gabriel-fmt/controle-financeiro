"use client";

import { loginAction, type LoginState } from "@/app/admin/actions";
import { LockKeyhole, LoaderCircle } from "lucide-react";
import { useActionState } from "react";

export function AdminLoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, undefined);
  return (
    <form action={action} className="admin-login-form">
      <label>
        E-mail
        <input name="email" type="email" autoComplete="email" placeholder="admin@exemplo.com" required />
      </label>
      <label>
        Senha
        <input name="password" type="password" autoComplete="current-password" placeholder="••••••••" minLength={6} required />
      </label>
      {state?.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? <LoaderCircle className="spin" size={19} /> : <LockKeyhole size={19} />}
        {pending ? "Entrando..." : "Entrar no painel"}
      </button>
    </form>
  );
}
