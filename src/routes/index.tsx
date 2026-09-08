import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import openingImage from "@/assets/opening.jpeg";
import desireImage from "@/assets/desire.jpg";
import closingImage from "@/assets/closing.jpg";
import { FieldInput, isFieldAnswered } from "@/components/imersao/FieldInput";
import {
  GhostAction,
  PrimaryAction,
  Progress,
  Wordmark,
} from "@/components/imersao/Chrome";
import { STEPS, TOTAL_STEPS, visibleFields, type Answers } from "@/data/questions";
import { buildDiagnosisMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Imersão que Transforma — Diagnóstico Inicial" },
      {
        name: "description",
        content:
          "Sua Imersão que Transforma começa aqui. Um diagnóstico inicial para preparar uma experiência individual antes do nosso encontro.",
      },
      {
        property: "og:title",
        content: "Imersão que Transforma — Diagnóstico Inicial",
      },
      {
        property: "og:description",
        content:
          "Sua Imersão que Transforma começa aqui. Não existem respostas certas, bonitas ou esperadas.",
      },
      {
        property: "og:image",
        content: "https://formularioimersao.vercel.app/og-image.jpg",
      },
      {
        property: "og:image:secure_url",
        content: "https://formularioimersao.vercel.app/og-image.jpg",
      },
      {
        property: "og:image:type",
        content: "image/jpeg",
      },
      {
        property: "og:image:width",
        content: "600",
      },
      {
        property: "og:image:height",
        content: "600",
      },
      {
        property: "og:type",
        content: "website",
      },
    ],
    links: [
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
    ],
  }),
  component: Diagnostico,
});

const STORAGE_KEY = "imersao-que-transforma:diagnostico";

type Screen = "opening" | "question" | "review" | "closing";

function Diagnostico() {
  const [screen, setScreen] = useState<Screen>("opening");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resumeOffer, setResumeOffer] = useState<{
    answers: Answers;
    stepIndex: number;
  } | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const saved = JSON.parse(raw) as {
        answers?: Answers;
        stepIndex?: number;
      };

      if (saved.answers && Object.keys(saved.answers).length > 0) {
        setResumeOffer({
          answers: saved.answers,
          stepIndex: Math.min(saved.stepIndex ?? 0, TOTAL_STEPS - 1),
        });
      }
    } catch {
      /* progresso indisponível */
    }
  }, []);

  useEffect(() => {
    if (Object.keys(answers).length === 0) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, stepIndex }),
      );
    } catch {
      /* armazenamento indisponível */
    }
  }, [answers, stepIndex]);

  const step = STEPS[stepIndex]!;
  const fields = useMemo(
    () => visibleFields(step, answers),
    [step, answers],
  );

  const setValue = useCallback((id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));

    setErrors((prev) => {
      if (!prev[id]) return prev;

      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const goTo = (screenName: Screen, index?: number) => {
    if (typeof index === "number") {
      setStepIndex(index);
    }

    setScreen(screenName);
    setErrors({});

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0 });
    }

    window.requestAnimationFrame(() => topRef.current?.focus());
  };

  const advance = () => {
    const nextErrors: Record<string, string> = {};

    for (const field of fields) {
      if (field.required && !isFieldAnswered(field, answers)) {
        nextErrors[field.id] = "Esta resposta é necessária para seguir.";
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);

      const first = document.getElementById(
        `field-${Object.keys(nextErrors)[0]}`,
      );

      first?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    if (stepIndex === TOTAL_STEPS - 1) {
      goTo("review");
      return;
    }

    goTo("question", stepIndex + 1);
  };

  const restart = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }

    setAnswers({});
    setResumeOffer(null);
    setStepIndex(0);
    setScreen("opening");
  };

  const send = () => {
    const url = buildWhatsAppUrl(answers);

    window.open(url, "_blank", "noopener,noreferrer");
    goTo("closing");
  };

  return (
    <main className="min-h-screen bg-background">
      <div
        ref={topRef}
        tabIndex={-1}
        className="sr-only"
        aria-live="polite"
      >
        {screen === "question"
          ? `Pergunta ${step.n} de ${TOTAL_STEPS}`
          : ""}
      </div>

      {resumeOffer && screen === "opening" ? (
        <ResumeBar
          onContinue={() => {
            setAnswers(resumeOffer.answers);
            setStepIndex(resumeOffer.stepIndex);
            setResumeOffer(null);
            goTo("question", resumeOffer.stepIndex);
          }}
          onRestart={restart}
        />
      ) : null}

      {screen === "opening" ? (
        <Opening onStart={() => goTo("question", 0)} />
      ) : null}

      {screen === "question" ? (
        <section className="mx-auto flex min-h-screen w-full max-w-[76rem] flex-col px-6 pt-8 pb-16 sm:px-10 lg:px-16">
          <header className="flex items-center justify-between gap-6 border-b border-hairline pb-5">
            <Wordmark muted />

            <div className="hidden w-[22rem] sm:block">
              <Progress current={step.n} total={TOTAL_STEPS} />
            </div>
          </header>

          <div className="pt-6 sm:hidden">
            <Progress current={step.n} total={TOTAL_STEPS} />
          </div>

          <div
            key={step.n}
            className="rise grid flex-1 gap-14 pt-14 lg:grid-cols-12 lg:gap-20 lg:pt-24"
          >
            <div className="lg:col-span-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-[3.4rem] leading-none text-primary sm:text-[4.5rem]">
                  {String(step.n).padStart(2, "0")}
                </span>

                <span className="label-eyebrow text-muted-foreground">
                  / {TOTAL_STEPS}
                </span>
              </div>

              {step.transition ? (
                <div className="mt-10 border-l border-primary pl-6">
                  {step.transition.map((line) => (
                    <p
                      key={line}
                      className="font-display text-[1.35rem] leading-snug italic text-foreground/80 first:mb-3"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}

              <h1 className="mt-10 font-display text-[2.3rem] leading-[1.08] tracking-[-0.02em] text-foreground sm:text-[3rem] lg:text-[3.2rem]">
                {step.title}
              </h1>

              {step.note ? (
                <p className="mt-6 max-w-md text-sm leading-relaxed font-light text-muted-foreground">
                  {step.note}
                </p>
              ) : null}

              {step.image === "desire" ? (
                <img
                  src={desireImage}
                  alt="Mãos de uma mulher em repouso, em retrato editorial em preto e branco"
                  loading="lazy"
                  width={1600}
                  height={1008}
                  className="mt-12 hidden w-full object-cover lg:block lg:aspect-[4/3]"
                />
              ) : null}
            </div>

            <div className="flex flex-col gap-14 lg:col-span-7 lg:pt-4">
              {fields.map((field, i) => (
                <FieldInput
                  key={field.id}
                  field={field}
                  value={answers[field.id]}
                  error={errors[field.id]}
                  onChange={(value) => setValue(field.id, value)}
                  autoFocus={
                    i === 0 &&
                    field.type !== "multi" &&
                    field.type !== "single"
                  }
                />
              ))}

              <div className="mt-4 flex flex-wrap items-center gap-8 border-t border-hairline pt-10">
                <PrimaryAction onClick={advance}>
                  {stepIndex === TOTAL_STEPS - 1
                    ? "Concluir"
                    : "Continuar"}
                </PrimaryAction>

                {stepIndex > 0 ? (
                  <GhostAction
                    onClick={() =>
                      goTo("question", stepIndex - 1)
                    }
                  >
                    Voltar
                  </GhostAction>
                ) : (
                  <GhostAction onClick={() => goTo("opening")}>
                    Voltar
                  </GhostAction>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {screen === "review" ? (
        <Review
          answers={answers}
          onSend={send}
          onReview={() => goTo("question", 0)}
        />
      ) : null}

      {screen === "closing" ? <Closing onSend={send} /> : null}
    </main>
  );
}

function ResumeBar({
  onContinue,
  onRestart,
}: {
  onContinue: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="veil fixed inset-x-0 bottom-0 z-20 border-t border-hairline bg-paper/95 px-6 py-4 backdrop-blur-sm sm:px-10">
      <div className="mx-auto flex max-w-[76rem] flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-light text-muted-foreground">
          Encontramos seu progresso. Deseja continuar de onde parou?
        </p>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onContinue}
            className="min-h-11 label-eyebrow text-primary underline-offset-8 hover:underline"
          >
            Continuar
          </button>

          <GhostAction onClick={onRestart}>
            Começar novamente
          </GhostAction>
        </div>
      </div>
    </div>
  );
}

function Opening({ onStart }: { onStart: () => void }) {
  return (
    <section className="veil grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="order-2 flex flex-col justify-between px-6 pt-12 pb-20 sm:px-12 lg:order-1 lg:px-20 lg:py-16">
        <header className="flex items-center justify-between">
          <Wordmark />

          <span className="label-eyebrow text-muted-foreground">
            Diagnóstico inicial
          </span>
        </header>

        <div className="max-w-xl py-16 lg:py-10">
          <div className="mb-10 h-px w-16 bg-primary" />

          <h1 className="font-display text-[2.7rem] leading-[1.04] tracking-[-0.025em] sm:text-[3.6rem] lg:text-[4rem]">
            Sua Imersão que Transforma{" "}
            <span className="italic text-primary">começa aqui.</span>
          </h1>

          <div className="mt-10 space-y-5 text-[1rem] leading-[1.85] font-light text-muted-foreground">
            <p>
              Este diagnóstico foi criado para que eu possa conhecer o momento
              que você está vivendo antes do nosso encontro e preparar uma
              experiência verdadeiramente individual para você.
            </p>

            <p className="text-foreground">
              Não existem respostas certas, bonitas ou esperadas.
            </p>

            <p>
              Quanto mais verdadeira você for, mais profundamente eu conseguirei
              compreender onde você está, o que deseja construir e quais pontos
              precisaremos olhar juntas.
            </p>

            <p>
              Algumas perguntas podem exigir mais reflexão do que outras. Não
              tenha pressa.
            </p>

            <p className="font-display text-[1.35rem] italic text-foreground">
              Esse já é o seu primeiro movimento de transformação.
            </p>
          </div>

          <div className="mt-12">
            <PrimaryAction onClick={onStart}>
              Começar diagnóstico
            </PrimaryAction>
          </div>
        </div>

        <p className="label-eyebrow text-muted-foreground">
          15 perguntas · aproximadamente 20 minutos
        </p>
      </div>

      <div className="relative order-1 min-h-[58vh] lg:order-2 lg:min-h-screen">
        <img
          src={openingImage}
          alt="Retrato editorial de uma mulher em silêncio diante da janela"
          width={1280}
          height={1600}
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}

function Review({
  answers,
  onSend,
  onReview,
}: {
  answers: Answers;
  onSend: () => void;
  onReview: () => void;
}) {
  const preview = buildDiagnosisMessage(answers);

  return (
    <section className="veil mx-auto flex min-h-screen w-full max-w-[64rem] flex-col justify-center px-6 py-24 sm:px-12">
      <div className="h-px w-16 bg-primary" />

      <h1 className="mt-10 font-display text-[2.6rem] leading-[1.06] tracking-[-0.02em] sm:text-[3.4rem]">
        Tudo pronto.
      </h1>

      <p className="mt-6 max-w-xl text-[1rem] leading-[1.85] font-light text-muted-foreground">
        Suas respostas foram organizadas. Agora vamos enviá-las para a
        preparação da sua Imersão.
      </p>

      <details className="mt-12 border-t border-hairline pt-6">
        <summary className="cursor-pointer label-eyebrow text-muted-foreground transition-colors hover:text-primary">
          Ler o que será enviado
        </summary>

        <pre className="mt-6 max-h-80 overflow-auto border-l border-hairline pl-6 text-sm leading-relaxed font-light whitespace-pre-wrap text-muted-foreground">
          {preview}
        </pre>
      </details>

      <div className="mt-14 flex flex-wrap items-center gap-8">
        <PrimaryAction onClick={onSend}>
          Enviar pelo WhatsApp
        </PrimaryAction>

        <GhostAction onClick={onReview}>
          Revisar respostas
        </GhostAction>
      </div>
    </section>
  );
}

function Closing({ onSend }: { onSend: () => void }) {
  return (
    <section className="veil grid min-h-screen lg:grid-cols-[1fr_0.9fr]">
      <div className="flex flex-col justify-center px-6 py-24 sm:px-12 lg:px-20">
        <Wordmark muted />

        <div className="mt-14 h-px w-16 bg-primary" />

        <h1 className="mt-10 max-w-xl font-display text-[2.6rem] leading-[1.06] tracking-[-0.025em] sm:text-[3.4rem]">
          Seu diagnóstico foi{" "}
          <span className="italic text-primary">concluído.</span>
        </h1>

        <div className="mt-10 max-w-xl space-y-5 text-[1rem] leading-[1.85] font-light text-muted-foreground">
          <p>Obrigada por se permitir responder com verdade.</p>

          <p>
            A partir daqui, eu assumo a responsabilidade de estudar suas
            respostas e preparar uma experiência construída para o seu momento.
          </p>

          <p>
            Não existe uma Imersão que Transforma igual à outra porque não
            existem duas mulheres vivendo exatamente a mesma história.
          </p>

          <p className="font-display text-[1.35rem] italic text-foreground">
            Nos encontramos na sua Imersão.
          </p>
        </div>

        <div className="mt-12">
          <PrimaryAction onClick={onSend}>
            Enviar meu diagnóstico pelo WhatsApp
          </PrimaryAction>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <img
          src={closingImage}
          alt="Mulher caminhando em direção à luz em um espaço minimalista"
          loading="lazy"
          width={1408}
          height={1008}
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}