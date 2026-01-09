export type ExamStatus = 
  | 'waiting' 
  | 'registered' 
  | 'taken' 
  | 'approved' 
  | 'rejected';

export interface ExamDates {
  registrationOpen?: Date;
  registrationDeadline?: Date;
  paymentDeadline?: Date;
  examDate?: Date;
  resultsDate?: Date;
}

export interface DocumentItem {
  id: string;
  name: string;
  isCompleted: boolean;
  notes?: string;
}

export interface Exam {
  id: string;
  name: string;
  publicBody: string;
  position: string;
  examBoard: string;
  city: string;
  state: string;
  status: ExamStatus;
  dates: ExamDates;
  documents: DocumentItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Alert {
  id: string;
  examId: string;
  type: 'registration' | 'payment' | 'exam' | 'result';
  message: string;
  dueDate: Date;
  isPaused: boolean;
  isSent: boolean;
}

export const STATUS_LABELS: Record<ExamStatus, string> = {
  waiting: 'Aguardando Edital',
  registered: 'Inscrito',
  taken: 'Prova Realizada',
  approved: 'Aprovado',
  rejected: 'Não Aprovado',
};

export const DEFAULT_DOCUMENTS: string[] = [
  'RG',
  'CPF',
  'Comprovante de Residência',
  'Comprovante de Pagamento',
  'Diploma',
  'Certidão de Nascimento/Casamento',
  'Título de Eleitor',
  'Certificado de Reservista',
  'Foto 3x4',
  'Laudo Médico (se aplicável)',
];
