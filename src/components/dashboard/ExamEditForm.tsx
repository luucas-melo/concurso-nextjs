"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X, Trash2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { updateExam, deleteExam } from "@/lib/actions/exams";
import { examSchema, brazilianStateEnum } from "@/lib/schemas/exam";
import type { ExamInput, DocumentItem } from "@/lib/schemas/exam";
import type { Exam } from "@/types/exam";
import * as z from "zod";
import { ExamStatus } from "@prisma/client";
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
];

interface ExamEditFormProps {
  exam: Exam;
}

// Helper to format Date to YYYY-MM-DD string for date input
// function formatDateForInput(date: Date | null | undefined): string {
//   if (!date) return "";
//   const d = new Date(date);
//   if (isNaN(d.getTime())) return "";
//   return d.toISOString().split("T")[0];
// }

export default function ExamEditForm({ exam }: ExamEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>(
    Array.isArray(exam.documents) ? exam.documents : []
  );
  const [newDocument, setNewDocument] = useState("");

  // Use react-hook-form with Zod validation
  const form = useForm<Exam>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: exam.name || "",
      publicBody: exam.publicBody || "",
      position: exam.position || "",
      examBoard: exam.examBoard || "",
      city: exam.city || "",
      state: exam.state || null,
      status: (exam.status as ExamStatus) || "waiting",
      registrationOpen: exam?.registrationOpen,
      registrationDeadline: exam?.registrationDeadline,
      paymentDeadline: exam?.paymentDeadline,
      examDate: exam?.examDate,
      resultsDate: exam?.resultsDate,
      documents: [],
    },
  });

  const handleAddDocument = () => {
    if (
      newDocument.trim() &&
      !documents.some((d) => d.name === newDocument.trim())
    ) {
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
        const examData = {
          ...data,
          documents,
        };

        const result = await updateExam(exam.id, examData);

        if (result?.error) {
          toast.error(result.error);

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
        } else {
          toast.success("Concurso atualizado com sucesso!");
        }
      } catch (error) {
        toast.error("Erro inesperado. Tente novamente.");
      }
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteExam(exam.id);

      if (result?.error) {
        toast.error(result.error);
        setIsDeleting(false);
      } else {
        toast.success("Concurso excluído com sucesso!");
        router.push("/dashboard/exams");
      }
    } catch (error) {
      toast.error("Erro ao excluir concurso.");
      setIsDeleting(false);
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Editar Concurso</h1>
            <p className="text-muted-foreground mt-1">
              Atualize as informações do concurso
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="lg">
                <Trash2 className="w-5 h-5" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir concurso?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. O concurso será
                  permanentemente removido.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDeadline">Prazo de Pagamento</Label>
              <Input
                id="paymentDeadline"
                type="date"
                {...form.register("paymentDeadline")}
              />
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
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
