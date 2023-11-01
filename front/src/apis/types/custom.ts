interface NoteTitleProps {
  id: string;
  title: string;
}
interface NoteListProps {
  noteList: NoteTitleProps[];
  isEditing: boolean;
  onClick: (e) => Promise<void>;
}

interface WordsProps {
  id: number;
  word: string;
  meaning: string;
  correct?: boolean;
  category: string;
  isFavorite: boolean;
}
interface SubmitCustomWord {
  word: string;
  meaning: string;
}

export type { NoteTitleProps, NoteListProps, WordsProps, SubmitCustomWord };
