interface NoteTitleProps {
  id: string;
  title: string;
}
interface NoteListProps {
  noteList: NoteTitleProps[];
  isEditing: boolean;
}

interface WordsProps {
  id: string;
  word: string;
  meaning: string;
}
interface SubmitCustomWord {
  word: string;
  meaning: string;
}

export type { NoteTitleProps, NoteListProps, WordsProps, SubmitCustomWord };
