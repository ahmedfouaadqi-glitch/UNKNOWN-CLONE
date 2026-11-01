"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
export function DeleteContent({ locale, type, id, compact = false }: { locale: Locale; type: "post" | "comment"; id: string; compact?: boolean }) {
  const ar = locale === "ar";
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function remove() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, id, token }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Deletion failed");
      setMessage(ar ? "تم الحذف." : "Content deleted.");
      if (type === "post") window.location.href = `/${locale}`;
      else window.location.reload();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Error"); }
    finally { setBusy(false); }
  }
  return <div style={{ marginTop: compact ? 0 : 22 }}><button className="report-link" aria-expanded={open} aria-controls={`delete-panel-${id}`} onClick={() => setOpen((value) => !value)}>{ar ? "هل كتبت هذه المشاركة؟ احذفها برمزك الخاص." : "Did you write this? Delete it with your private code."}</button>{open && <div className="report-panel" id={`delete-panel-${id}`}><label className="field-label" htmlFor={`delete-${id}`}>{ar ? "رمز الحذف" : "Deletion code"}</label><input id={`delete-${id}`} className="text-input" value={token} onChange={(e) => setToken(e.target.value)} /><button className="secondary-button" style={{ marginTop: 12 }} disabled={busy || token.length < 30} onClick={remove}>{ar ? "حذف المحتوى" : "Delete content"}</button>{message && <p className="form-message">{message}</p>}</div>}</div>;
}
