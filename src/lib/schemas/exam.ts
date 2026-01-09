import { z } from "zod";

/**
 * Exam status enum
 */
export const examStatusEnum = z.enum([
  "waiting",
  "registered",
  "taken",
  "approved",
  "rejected",
]);

/**
 * Brazilian states enum
 */
export const brazilianStateEnum = z.enum([
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
]);

/**
 * Exam form validation schema (create/update)
 */
export const examSchema = z.object({
  name: z
    .string()
    .min(1, "Nome do concurso é obrigatório")
    .max(200, "Nome deve ter no máximo 200 caracteres"),
  publicBody: z
    .string()
    .min(1, "Órgão é obrigatório")
    .max(200, "Órgão deve ter no máximo 200 caracteres"),
  position: z
    .string()
    .min(1, "Cargo é obrigatório")
    .max(200, "Cargo deve ter no máximo 200 caracteres"),
  examBoard: z
    .string()
    .max(100, "Banca deve ter no máximo 100 caracteres")
    .optional()
    .nullable(),
  city: z
    .string()
    .max(100, "Cidade deve ter no máximo 100 caracteres")
    .optional()
    .nullable(),
  state: brazilianStateEnum.optional().nullable(),
  status: examStatusEnum.default("waiting"),
  registrationOpen: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),
  registrationDeadline: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),
  paymentDeadline: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),
  examDate: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),
  resultsDate: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),
  documents: z
    .array(z.string())
    .default([]),
}).refine((data) => {
  // Validate that registration deadline is after registration open
  if (data.registrationOpen && data.registrationDeadline) {
    const open = new Date(data.registrationOpen);
    const deadline = new Date(data.registrationDeadline);
    return deadline >= open;
  }
  return true;
}, {
  message: "Data de encerramento deve ser posterior à data de abertura",
  path: ["registrationDeadline"],
}).refine((data) => {
  // Validate that payment deadline is after registration open
  if (data.registrationOpen && data.paymentDeadline) {
    const open = new Date(data.registrationOpen);
    const payment = new Date(data.paymentDeadline);
    return payment >= open;
  }
  return true;
}, {
  message: "Prazo de pagamento deve ser posterior à abertura das inscrições",
  path: ["paymentDeadline"],
});

/**
 * Document item schema for adding/removing documents
 */
export const documentSchema = z.object({
  name: z
    .string()
    .min(1, "Nome do documento é obrigatório")
    .max(200, "Nome deve ter no máximo 200 caracteres"),
  checked: z.boolean().default(false),
});

/**
 * Type inference helpers
 */
export type ExamInput = z.infer<typeof examSchema>;
export type ExamStatus = z.infer<typeof examStatusEnum>;
export type BrazilianState = z.infer<typeof brazilianStateEnum>;
export type DocumentItem = z.infer<typeof documentSchema>;
