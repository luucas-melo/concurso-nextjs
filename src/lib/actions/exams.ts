"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server"; // Keep for auth
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

  // Get current user (using Supabase Auth)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Você precisa estar autenticado para criar um concurso.",
    };
  }

  try {
    // Ensure profile exists using Prisma upsert
    await prisma.profile.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email || "",
        fullName: user.user_metadata?.full_name || null,
        avatarUrl: user.user_metadata?.avatar_url || null,
      },
      update: {}, // Do nothing if exists
    });

    // Insert exam using Prisma
    await prisma.exam.create({
      data: {
        userId: user.id,
        name: validatedFields.data.name,
        publicBody: validatedFields.data.publicBody,
        position: validatedFields.data.position,
        examBoard: validatedFields.data.examBoard || null,
        city: validatedFields.data.city || null,
        state: validatedFields.data.state || null,
        status: validatedFields.data.status || "waiting",
        registrationOpen: validatedFields.data.registrationOpen
          ? new Date(validatedFields.data.registrationOpen)
          : null,
        registrationDeadline: validatedFields.data.registrationDeadline
          ? new Date(validatedFields.data.registrationDeadline)
          : null,
        paymentDeadline: validatedFields.data.paymentDeadline
          ? new Date(validatedFields.data.paymentDeadline)
          : null,
        examDate: validatedFields.data.examDate
          ? new Date(validatedFields.data.examDate)
          : null,
        resultsDate: validatedFields.data.resultsDate
          ? new Date(validatedFields.data.resultsDate)
          : null,
        documents: validatedFields.data.documents || [],
      },
    });

    revalidatePath("/dashboard/exams");
    redirect("/dashboard/exams");
  } catch (error) {
    console.error("Error creating exam:", error);
    return {
      error: "Erro ao criar concurso. Tente novamente.",
    };
  }
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

  // Get current user (using Supabase Auth)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Você precisa estar autenticado para atualizar um concurso.",
    };
  }

  try {
    // Update exam using Prisma (with ownership check)
    const updated = await prisma.exam.updateMany({
      where: {
        id: id,
        userId: user.id, // Ensures user ownership
      },
      data: {
        name: validatedFields.data.name,
        publicBody: validatedFields.data.publicBody,
        position: validatedFields.data.position,
        examBoard: validatedFields.data.examBoard || null,
        city: validatedFields.data.city || null,
        state: validatedFields.data.state || null,
        status: validatedFields.data.status || "waiting",
        registrationOpen: validatedFields.data.registrationOpen
          ? new Date(validatedFields.data.registrationOpen)
          : null,
        registrationDeadline: validatedFields.data.registrationDeadline
          ? new Date(validatedFields.data.registrationDeadline)
          : null,
        paymentDeadline: validatedFields.data.paymentDeadline
          ? new Date(validatedFields.data.paymentDeadline)
          : null,
        examDate: validatedFields.data.examDate
          ? new Date(validatedFields.data.examDate)
          : null,
        resultsDate: validatedFields.data.resultsDate
          ? new Date(validatedFields.data.resultsDate)
          : null,
        documents: validatedFields.data.documents || [],
        // updatedAt handled automatically by Prisma @updatedAt
      },
    });

    // Check if any record was updated
    if (updated.count === 0) {
      return {
        error: "Concurso não encontrado ou você não tem permissão.",
      };
    }

    revalidatePath("/dashboard/exams");
    revalidatePath(`/dashboard/exams/${id}`);

    return {
      success: true,
      message: "Concurso atualizado com sucesso!",
    };
  } catch (error) {
    console.error("Error updating exam:", error);
    return {
      error: "Erro ao atualizar concurso. Tente novamente.",
    };
  }
}

/**
 * Delete an exam
 */
export async function deleteExam(id: string) {
  const supabase = await createClient();

  // Get current user (using Supabase Auth)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Você precisa estar autenticado para excluir um concurso.",
    };
  }

  try {
    // Delete exam using Prisma (with ownership check)
    const deleted = await prisma.exam.deleteMany({
      where: {
        id: id,
        userId: user.id, // Ensures user ownership
      },
    });

    // Check if any record was deleted
    if (deleted.count === 0) {
      return {
        error: "Concurso não encontrado ou você não tem permissão.",
      };
    }

    revalidatePath("/dashboard/exams");

    return {
      success: true,
      message: "Concurso excluído com sucesso!",
    };
  } catch (error) {
    console.error("Error deleting exam:", error);
    return {
      error: "Erro ao excluir concurso. Tente novamente.",
    };
  }
}

/**
 * Update exam status
 */
export async function updateExamStatus(id: string, status: string) {
  const supabase = await createClient();

  // Get current user (using Supabase Auth)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Você precisa estar autenticado.",
    };
  }

  try {
    // Update status using Prisma
    const updated = await prisma.exam.updateMany({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        status,
        // updatedAt handled automatically by @updatedAt
      },
    });

    if (updated.count === 0) {
      return {
        error: "Concurso não encontrado ou você não tem permissão.",
      };
    }

    revalidatePath("/dashboard/exams");
    revalidatePath(`/dashboard/exams/${id}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Status atualizado com sucesso!",
    };
  } catch (error) {
    console.error("Error updating exam status:", error);
    return {
      error: "Erro ao atualizar status. Tente novamente.",
    };
  }
}

/**
 * Toggle document completed status
 */
export async function toggleDocumentChecked(
  examId: string,
  documentName: string,
  isCompleted: boolean
) {
  const supabase = await createClient();

  // Get current user (using Supabase Auth)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Você precisa estar autenticado.",
    };
  }

  try {
    // Fetch current exam with Prisma
    const exam = await prisma.exam.findFirst({
      where: {
        id: examId,
        userId: user.id,
      },
      select: {
        documents: true,
      },
    });

    if (!exam) {
      return {
        error: "Concurso não encontrado.",
      };
    }

    // Update documents array
    const documents = Array.isArray(exam.documents) ? exam.documents : [];
    const updatedDocuments = documents.map((doc: any) =>
      doc.name === documentName ? { ...doc, isCompleted } : doc
    );

    // Update exam with new documents array
    await prisma.exam.update({
      where: {
        id: examId,
      },
      data: {
        documents: updatedDocuments,
        // updatedAt handled automatically
      },
    });

    revalidatePath(`/dashboard/exams/${examId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating document:", error);
    return {
      error: "Erro ao atualizar documento. Tente novamente.",
    };
  }
}

/**
 * Get all exams for current user
 */
export async function getUserExams() {
  const supabase = await createClient();

  // Get current user (using Supabase Auth)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Não autenticado" };
  }

  try {
    // Fetch exams using Prisma
    const exams = await prisma.exam.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { data: exams, error: null };
  } catch (error) {
    console.error("Error fetching exams:", error);
    return { data: null, error: "Erro ao buscar concursos" };
  }
}

/**
 * Get single exam by ID
 */
export async function getExamById(id: string) {
  const supabase = await createClient();

  // Get current user (using Supabase Auth)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Não autenticado" };
  }

  try {
    // Fetch single exam using Prisma
    const exam = await prisma.exam.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!exam) {
      return { data: null, error: "Concurso não encontrado" };
    }

    return { data: exam, error: null };
  } catch (error) {
    console.error("Error fetching exam:", error);
    return { data: null, error: "Concurso não encontrado" };
  }
}
