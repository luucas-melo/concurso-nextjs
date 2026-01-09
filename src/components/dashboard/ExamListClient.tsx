"use client";

import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ExamCard from "./ExamCard";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STATUS_LABELS = {
  waiting: "Aguardando",
  registered: "Inscrito",
  taken: "Realizado",
  approved: "Aprovado",
  rejected: "Reprovado",
};

interface ExamListClientProps {
  exams: any[];
}

export default function ExamListClient({ exams }: ExamListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.public_body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.position?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || exam.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "waiting", label: STATUS_LABELS.waiting },
    { value: "registered", label: STATUS_LABELS.registered },
    { value: "taken", label: STATUS_LABELS.taken },
    { value: "approved", label: STATUS_LABELS.approved },
    { value: "rejected", label: STATUS_LABELS.rejected },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Meus Concursos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os seus concursos em um só lugar
          </p>
        </div>
        <Link href="/dashboard/exams/new">
          <Button variant="hero" size="lg">
            <Plus className="w-5 h-5" />
            Novo Concurso
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, órgão ou cargo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                statusFilter === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exams Grid */}
      {filteredExams.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display font-semibold text-lg mb-2">
            Nenhum concurso encontrado
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || statusFilter !== "all"
              ? "Tente ajustar os filtros de busca"
              : "Comece adicionando seu primeiro concurso"}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <Link href="/dashboard/exams/new">
              <Button variant="hero">
                <Plus className="w-5 h-5" />
                Adicionar Concurso
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}
