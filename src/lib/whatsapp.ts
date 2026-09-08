import { STEPS, visibleFields, type Answers } from "@/data/questions";

/** Número de WhatsApp que recebe os diagnósticos (formato internacional, só dígitos). */
export const WHATSAPP_NUMBER = "5579999201224";

function valueToText(value: string | string[] | undefined): string {
  if (!value) return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return value.trim() || "—";
}

export function buildDiagnosisMessage(answers: Answers): string {
  const lines: string[] = [];
  lines.push("✨ IMERSÃO QUE TRANSFORMA");
  lines.push("DIAGNÓSTICO INICIAL");
  lines.push("");
  lines.push(`Nome: ${valueToText(answers['nome'])}`);
  lines.push(`Idade: ${valueToText(answers['idade'])}`);

  for (const step of STEPS) {
    lines.push("");
    lines.push(`${String(step.n).padStart(2, "0")}. ${step.title.toUpperCase()}`);
    for (const field of visibleFields(step, answers)) {
      if (field.id === "nome" || field.id === "idade") continue;
      lines.push("");
      lines.push(field.label);
      lines.push(valueToText(answers[field.id]));
    }
  }

  return lines.join("\n");
}

export function buildWhatsAppUrl(answers: Answers): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildDiagnosisMessage(answers),
  )}`;
}
