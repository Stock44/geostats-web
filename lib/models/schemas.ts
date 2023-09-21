import { z } from "zod";
import { pipe } from "next/dist/build/webpack/config/utils";

export const idSchema = z.bigint().or(z.number()).or(z.string());

export type Id = z.infer<typeof idSchema>;

export const phoneSchema = z
  .string()
  .trim()
  .regex(/\+?\d+/)
  .refine((value: string) => /[^+\d ]/.exec(value) == null, {
    message:
      "phone number must only contain numbers, optionally prepended with a plus sign",
  })
  .transform((value) => value.replace(/[^+\d]/g, ""))
  .pipe(z.string().max(16));

export const pointSchema = z
  .tuple([z.number(), z.number()])
  .transform(([x, y]) => `(${x}, ${y})`);
