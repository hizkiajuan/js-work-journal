export interface Todo {
  text: string;
  completed: boolean;
}

export interface LogEntry {
  timeSpent: string;
  description: string;
  projectCode: string;
}

export type BulletField = 'til' | 'bigTheme' | 'majorContribution';

export interface Entry {
  date: string;
  todos: Todo[];
  logs: LogEntry[];
  til: string[];
  bigTheme: string[];
  majorContribution: string[];
}

export interface IdeasState {
  improvementIdeas: string[];
  learningTopics: string[];
}
