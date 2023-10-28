// generate-dialog 인터페이스
interface InputDialogData {
  line_count: number;
  word_pairs: Record<string, string>;
}

interface DialogEntry {
  speaker: string;
  message: string;
}

interface DialogResponse {
  dialog: DialogEntry[];
}

// explain-grammar 인터페이스
interface DialogEntryForGrammar {
  speaker: string;
  message: string;
}

interface InputGrammarData {
  dialog: DialogEntryForGrammar[];
}

interface GrammarExplanation {
  message: string;
  explain: string;
}

interface GrammarResponse {
  grammar: GrammarExplanation[];
}

// 공통 에러 응답
interface ValidationError {
  loc: Array<string | number>;
  msg: string;
  type: string;
}

interface HTTPValidationError {
  detail: ValidationError[];
}

export type {
  DialogEntry,
  DialogResponse,
  DialogEntryForGrammar,
  GrammarResponse,
  GrammarExplanation,
  InputDialogData,
  InputGrammarData,
  HTTPValidationError,
  ValidationError,
};
