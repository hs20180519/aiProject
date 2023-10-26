interface NoteTitleProps {
  id: string;
  title: string;
}
interface NoteListProps {
  noteList: NoteTitleProps[];
  isEditing: boolean;
}

interface SubmitCustomWord {
  word: string;
  meaning: string;
}

export type { NoteTitleProps, NoteListProps, SubmitCustomWord };
