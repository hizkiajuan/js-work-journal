import { ENTRIES_STORAGE_KEY, IDEAS_STORAGE_KEY } from '../constants/storage';
import type { Entry, IdeasState } from '../types/journal';

const defaultIdeas: IdeasState = {
  improvementIdeas: [],
  learningTopics: [],
};

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn('Failed to parse stored data for export', error);
    return fallback;
  }
};

const formatCsvRow = (cells: string[]) =>
  cells.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',');

const formatEntryRow = (entry: Entry) => [
  entry.date,
  entry.todos.map((todo) => `[${todo.completed ? 'x' : ' '}] ${todo.text}`).join('; '),
  entry.logs
    .map((log) => `${log.projectCode ? `[${log.projectCode}] ` : ''}${log.timeSpent} - ${log.description}`)
    .join('; '),
  entry.til.join('; '),
  entry.bigTheme.join('; '),
  entry.majorContribution.join('; '),
];

export const exportJournalData = () => {
  const entries = safeParse<Entry[]>(localStorage.getItem(ENTRIES_STORAGE_KEY), []);
  const ideas = safeParse<IdeasState>(localStorage.getItem(IDEAS_STORAGE_KEY), defaultIdeas);

  const csvLines: string[] = [];
  const entryHeaders = ['Date', 'Todos', 'Logs', 'TIL', 'Big Theme', 'Major Contribution'];

  csvLines.push(formatCsvRow(entryHeaders));
  entries.forEach((entry) => {
    csvLines.push(formatCsvRow(formatEntryRow(entry)));
  });

  csvLines.push('');
  csvLines.push('Improvement Ideas');
  ideas.improvementIdeas.forEach((idea) => {
    csvLines.push(formatCsvRow([idea]));
  });

  csvLines.push('');
  csvLines.push('Learning Topics');
  ideas.learningTopics.forEach((topic) => {
    csvLines.push(formatCsvRow([topic]));
  });

  const csvContent = csvLines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const now = new Date();
  const pad = (num: number) => num.toString().padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  link.download = `js-work-journal_${timestamp}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
