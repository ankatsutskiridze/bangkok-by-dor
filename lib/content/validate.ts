import { z } from "zod";

/**
 * Content validation — P3-03.
 *
 * `docs/TECHNICAL.md` §3: "Content is validated with a Zod schema at
 * build/fetch time. Invalid content **fails loudly** — it must never render a
 * half-empty recommendation page."
 *
 * The temptation this file exists to remove is the quiet fallback: skip the
 * broken entry, render the fields that parsed, log a warning nobody reads. On a
 * paid guide that ships a page a buyer has already paid for and finds hollow,
 * which costs more than a failed build ever does.
 */

export class ContentValidationError extends Error {
  constructor(
    readonly kind: string,
    readonly identifier: string,
    readonly issues: string,
  ) {
    super(
      `Invalid ${kind} "${identifier}":\n${issues}\n\n` +
        `Content is validated at build time on purpose (docs/TECHNICAL.md §3). ` +
        `Fix the content — do not relax the schema to make this pass.`,
    );
    this.name = "ContentValidationError";
  }
}

/**
 * Parses one entry, or throws with the field-level detail.
 *
 * `identifier` is whatever names the entry to a human — a slug, a filename, a
 * CMS document id. An error that says only "validation failed" sends someone
 * hunting through a hundred entries.
 */
export function parseContent<T>(
  schema: z.ZodType<T>,
  value: unknown,
  kind: string,
  identifier: string,
): T {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new ContentValidationError(kind, identifier, z.prettifyError(result.error));
  }

  return result.data;
}

/**
 * Parses a whole collection and reports **every** broken entry at once.
 *
 * Failing on the first one turns fixing a content import into a dozen
 * build-fix-build cycles. Someone seeding fifty places wants the whole list.
 */
export function parseCollection<T>(
  schema: z.ZodType<T>,
  values: readonly unknown[],
  kind: string,
  identify: (value: unknown, index: number) => string,
): T[] {
  const parsed: T[] = [];
  const failures: string[] = [];

  values.forEach((value, index) => {
    const result = schema.safeParse(value);
    if (result.success) {
      parsed.push(result.data);
    } else {
      failures.push(
        `${identify(value, index)}\n${indent(z.prettifyError(result.error))}`,
      );
    }
  });

  if (failures.length > 0) {
    throw new ContentValidationError(
      `${kind} collection`,
      `${failures.length} of ${values.length} entries`,
      failures.join("\n\n"),
    );
  }

  return parsed;
}

function indent(text: string): string {
  return text
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
}
