import type { Answers, Field } from "@/data/questions";

type Props = {
  field: Field;
  value: string | string[] | undefined;
  error?: string | undefined;
  onChange: (value: string | string[]) => void;
  autoFocus?: boolean | undefined;
};

const SCALE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function FieldInput({ field, value, error, onChange, autoFocus }: Props) {
  const id = `field-${field.id}`;
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block font-display text-[1.4rem] leading-snug tracking-[-0.01em] text-foreground sm:text-[1.6rem]"
      >
        {field.label}
        {field.optionalNote ? (
          <span className="ml-3 align-middle label-eyebrow text-muted-foreground">
            {field.optionalNote}
          </span>
        ) : null}
      </label>
      {field.hint ? (
        <p className="mt-2 text-sm font-light text-muted-foreground">{field.hint}</p>
      ) : null}

      <div className="mt-4">
        {field.type === "text" || field.type === "number" ? (
          <input
            id={id}
            type={field.type === "number" ? "number" : "text"}
            inputMode={field.type === "number" ? "numeric" : "text"}
            className="field-line"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={describedBy}
            aria-invalid={!!error}
            autoFocus={autoFocus}
            autoComplete="off"
          />
        ) : null}

        {field.type === "textarea" || field.type === "longtext" ? (
          <textarea
            id={id}
            rows={field.type === "longtext" ? 6 : 3}
            className="field-line resize-none leading-relaxed"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={describedBy}
            aria-invalid={!!error}
            autoFocus={autoFocus}
          />
        ) : null}

        {field.type === "scale" ? (
          <div
            role="radiogroup"
            aria-label={field.label}
            aria-describedby={describedBy}
            className="flex flex-wrap gap-x-1 gap-y-2 sm:gap-x-2"
          >
            {SCALE.map((n) => {
              const active = value === String(n);
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange(String(n))}
                  className={[
                    "h-12 w-[calc((100%-1.5rem)/6)] max-w-14 border text-sm transition-all duration-300 sm:h-14",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-hairline text-muted-foreground hover:border-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {n}
                </button>
              );
            })}
          </div>
        ) : null}

        {field.type === "multi" || field.type === "single" ? (
          <div
            role={field.type === "single" ? "radiogroup" : "group"}
            aria-label={field.label}
            aria-describedby={describedBy}
            className="grid gap-px border-t border-hairline"
          >
            {field.options?.map((option) => {
              const active =
                field.type === "single"
                  ? value === option
                  : Array.isArray(value) && value.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  role={field.type === "single" ? "radio" : "checkbox"}
                  aria-checked={active}
                  onClick={() => {
                    if (field.type === "single") {
                      onChange(option);
                      return;
                    }
                    const current = Array.isArray(value) ? value : [];
                    onChange(
                      current.includes(option)
                        ? current.filter((o) => o !== option)
                        : [...current, option],
                    );
                  }}
                  className={[
                    "group flex items-center gap-4 border-b border-hairline py-3.5 text-left text-[0.98rem] font-light transition-colors duration-300",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "h-[7px] w-[7px] shrink-0 rotate-45 border transition-all duration-300",
                      active
                        ? "border-primary bg-primary"
                        : "border-hairline group-hover:border-foreground",
                    ].join(" ")}
                  />
                  {option}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {error ? (
        <p id={`${id}-error`} className="mt-3 label-eyebrow text-primary">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function isFieldAnswered(field: Field, answers: Answers): boolean {
  const v = answers[field.id];
  if (Array.isArray(v)) return v.length > 0;
  return typeof v === "string" && v.trim().length > 0;
}
