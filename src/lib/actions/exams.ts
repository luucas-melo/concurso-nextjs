"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { examSchema } from "@/lib/schemas/exam";
import type { ExamInput } from "@/lib/schemas/exam";

/**
 * Create a new exam
 */
export async function createExam(data: ExamInput) {
  // Validate input with Zod
  const validatedFields = examSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Dados inválidos. Verifique os campos e tente novamente.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Você precisa estar autenticado para criar um concurso.",
    };
  }

  // Insert exam into database
  const { error } = await supabase.from("exams").insert({
    ...validatedFields.data,
    user_id: user.id,
    // Convert empty strings to null for optional fields
    exam_board: validatedFields.data.examBoard || null,
    city: validatedFields.data.city || null,
    state: validatedFields.data.state || null,
    registration_open: validatedFields.data.registrationOpen || null,
    registration_deadline: validatedFields.data.registrationDeadline || null,
    payment_deadline: validatedFields.data.paymentDeadline || null,
    exam_date: validatedFields.data.examDate || null,
    results_date: validatedFields.data.resultsDate || null,
  });

  if (error) {
    console.error("Error creating exam:", error);
    return {
      error: "Erro ao criar concurso. Tente novamente.",
    };
  }

  revalidatePath("/dashboard/exams");
  redirect("/dashboard/exams");
}

/**
 * Update an existing exam
 */
export async function updateExam(id: string, data: ExamInput) {
  // Validate input with Zod
  const validatedFields = examSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Dados inválidos. Verifique os campos e tente novamente.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Você precisa estar autenticado para atualizar um concurso.",
    };
  }

  // Update exam (RLS will ensure user can only update their own exams)
  const { error } = await supabase
    .from("exams")
    .update({
      ...validatedFields.data,
      exam_board: validatedFields.data.examBoard || null,
      city: validatedFields.data.city || null,
      state: validatedFields.data.state || null,
      registration_open: validatedFields.data.registrationOpen || null,
      registration_deadline: validatedFields.data.registrationDeadline || null,
      payment_deadline: validatedFields.data.paymentDeadline || null,
      exam_date: validatedFields.data.examDate || null,
      results_date: validatedFields.data.resultsDate || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating exam:", error);
    return {
      error: "Erro ao atualizar concurso. Tente novamente.",
    };
  }

  revalidatePath("/dashboard/exams");
  revalidatePath(`/dashboard/exams/${id}`);
  
  return {
    success: true,
    message: "Concurso atualizado com sucesso!",
  };
}

/**
 * Delete an exam
 */
export async function deleteExam(id: string) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Você precisa estar autenticado para excluir um concurso.",
    };
  }

  // Delete exam (RLS will ensure user can only delete their own exams)
  const { error } = await supabase
    .from("exams")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting exam:", error);
    return {
      error: "Erro ao excluir concurso. Tente novamente.",
    };
  }

  revalidatePath("/dashboard/exams");
  
  return {
    success: true,
    message: "Concurso excluído com sucesso!",
  };
}

/**
 * Update exam status
 */
export async function updateExamStatus(id: string, status: string) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Você precisa estar autenticado.",
    };
  }

  // Update status
  const { error } = await supabase
    .from("exams")
    .update({ 
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating exam status:", error);
    return {
      error: "Erro ao atualizar status. Tente novamente.",
    };
  }

  revalidatePath("/dashboard/exams");
  revalidatePath(`/dashboard/exams/${id}`);
  revalidatePath("/dashboard");
  
  return {
    success: true,
    message: "Status atualizado com sucesso!",
  };
}

/**
 * Toggle document checked status
 */
export async function toggleDocumentChecked(
  examId: string,
  documentName: string,
  checked: boolean
) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Você precisa estar autenticado.",
    };
  }

  // Get current exam
  const { data: exam, error: fetchError } = await supabase
    .from("exams")
    .select("documents")
    .eq("id", examId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !exam) {
    return {
      error: "Concurso não encontrado.",
    };
  }

  // Update documents array
  const documents = exam.documents || [];
  const updatedDocuments = documents.map((doc: any) =>
    doc.name === documentName ? { ...doc, checked } : doc
  );

  // Update exam
  const { error } = await supabase
    .from("exams")
    .update({
      documents: updatedDocuments,
      updated_at: new Date().toISOString(),
    })
    .eq("id", examId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating document:", error);
    return {
      error: "Erro ao atualizar documento. Tente novamente.",
    };
  }

  revalidatePath(`/dashboard/exams/${examId}`);
  
  return {
    success: true,
  };
}

/**
 * Get all exams for current user
 */
export async function getUserExams() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Não autenticado" };
  }

  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching exams:", error);
    return { data: null, error: "Erro ao buscar concursos" };
  }

  return { data, error: null };
}

/**
 * Get single exam by ID
 */
export async function getExamById(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Não autenticado" };
  }

  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching exam:", error);
    return { data: null, error: "Concurso não encontrado" };
  }

  return { data, error: null };
}
