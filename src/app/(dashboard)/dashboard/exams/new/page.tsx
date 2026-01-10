"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createExam } from "@/lib/actions/exams";
import { examSchema, brazilianStateEnum } from "@/lib/schemas/exam";
import type { ExamInput, DocumentItem } from "@/lib/schemas/exam";

const BRAZILIAN_STATES = brazilianStateEnum.options;

const STATUS_LABELS = {
  waiting: "Aguardando Edital",
  registered: "Inscrito",
  taken: "Prova Realizada",
  approved: "Aprovado",
  rejected: "Não Aprovado",
};

const DEFAULT_DOCUMENTS = [
  "RG",
  "CPF",
  "Comprovante de Residência",
  "Comprovante de Pagamento",
  "Diploma",
  "Certidão de Nascimento/Casamento",
  "Título de Eleitor",
  "Certificado de Reservista",
  "Foto 3x4",
  "Laudo Médico (se aplicável)",
];

export default function NewExamPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [documents, setDocuments] = useState<DocumentItem[]>(
    DEFAULT_DOCUMENTS.slice(0, 5).map((name) => ({ name, isCompleted: false }))
  );
  const [newDocument, setNewDocument] = useState("");

  // Use react-hook-form with Zod validation (NO useState for form data!)
  const form = useForm<ExamInput>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: "",
      publicBody: "",
      position: "",
      examBoard: "",
      city: "",
      state: null,
      status: "waiting",
      registrationOpen: "",
      registrationDeadline: "",
      paymentDeadline: "",
      examDate: "",
      resultsDate: "",
      documents: [],
    },
  });

  const handleAddDocument = () => {
    if (newDocument.trim() && !documents.some((d) => d.name === newDocument.trim())) {
      setDocuments((prev) => [
        ...prev,
        { name: newDocument.trim(), isCompleted: false },
      ]);
      setNewDocument("");
    }
  };

  const handleRemoveDocument = (docName: string) => {
    setDocuments((prev) => prev.filter((d) => d.name !== docName));
  };

  const onSubmit = async (data: ExamInput) => {
    startTransition(async () => {
      try {
        // Add documents to the data
        const examData = {
          ...data,
          documents,
        };

        const result = await createExam(examData);

        if (result?.error) {
          toast.error(result.error);

          // Handle field-specific errors
          if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([field, errors]) => {
              if (errors && errors.length > 0) {
                form.setError(field as any, {
                  type: "manual",
                  message: errors[0],
                });
              }
            });
          }
        }
        // If successful, createExam redirects to /dashboard/exams
      } catch (error) {
        toast.error("Erro inesperado. Tente novamente.");
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/exams"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para lista
        </Link>
        <h1 className="font-display text-3xl font-bold">Novo Concurso</h1>
        <p className="text-muted-foreground mt-1">
          Adicione as informações do concurso que você vai participar
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <h2 className="font-display font-semibold text-lg">
            Informações Básicas
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="name">Nome do Concurso *</Label>
              <Input
                id="name"
                placeholder="Ex: Analista Judiciário - TRF 3ª Região"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="publicBody">Órgão *</Label>
              <Input
                id="publicBody"
                placeholder="Ex: TRF 3ª Região"
                {...form.register("publicBody")}
              />
              {form.formState.errors.publicBody && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.publicBody.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Cargo *</Label>
              <Input
                id="position"
                placeholder="Ex: Analista Judiciário"
                {...form.register("position")}
              />
              {form.formState.errors.position && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.position.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="examBoard">Banca</Label>
              <Input
                id="examBoard"
                placeholder="Ex: FCC, CESPE"
                {...form.register("examBoard")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) => form.setValue("status", value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                placeholder="Ex: São Paulo"
                {...form.register("city")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Select
                value={form.watch("state") || ""}
                onValueChange={(value) => form.setValue("state", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <h2 className="font-display font-semibold text-lg">
            Datas Importantes
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registrationOpen">Abertura das Inscrições</Label>
              <Input
                id="registrationOpen"
                type="date"
                {...form.register("registrationOpen")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationDeadline">
                Encerramento das Inscrições
              </Label>
              <Input
                id="registrationDeadline"
                type="date"
                {...form.register("registrationDeadline")}
              />
              {form.formState.errors.registrationDeadline && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.registrationDeadline.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDeadline">Prazo de Pagamento</Label>
              <Input
                id="paymentDeadline"
                type="date"
                {...form.register("paymentDeadline")}
              />
              {form.formState.errors.paymentDeadline && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.paymentDeadline.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="examDate">Data da Prova</Label>
              <Input id="examDate" type="date" {...form.register("examDate")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resultsDate">Data do Resultado</Label>
              <Input
                id="resultsDate"
                type="date"
                {...form.register("resultsDate")}
              />
            </div>
          </div>
        </div>

        {/* Documents Checklist */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <h2 className="font-display font-semibold text-lg">
            Documentos Necessários
          </h2>

          <div className="flex gap-2">
            <Input
              placeholder="Adicionar documento..."
              value={newDocument}
              onChange={(e) => setNewDocument(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddDocument())
              }
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddDocument}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {documents.map((doc) => (
              <div
                key={doc.name}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm"
              >
                <span>{doc.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(doc.name)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Sugestões:{" "}
            {DEFAULT_DOCUMENTS.filter((d) => !documents.some((doc) => doc.name === d))
              .slice(0, 3)
              .join(", ")}
            {DEFAULT_DOCUMENTS.filter((d) => !documents.some((doc) => doc.name === d)).length >
              3 && "..."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard/exams">
            <Button type="button" variant="outline" size="lg">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" variant="hero" size="lg" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Salvando...
              </span>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Concurso
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
