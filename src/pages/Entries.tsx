import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';
import { styles } from "../styles";
import { ENTRIES_STORAGE_KEY } from '../constants/storage';
import type { BulletField, Entry, LogEntry, Todo } from '../types/journal';

interface EntriesProps {
  setAddEntry: Dispatch<SetStateAction<() => void>>;
  isVisible: boolean;
}

const RECORDS_PER_PAGE = 20;

const sortEntriesByDateDesc = (list: Entry[]) =>
  [...list].sort((a, b) => b.date.localeCompare(a.date));

const cloneEntry = (entry: Entry): Entry => ({
  ...entry,
  todos: entry.todos.map((todo) => ({ ...todo })),
  logs: entry.logs.map((log) => ({ ...log })),
  til: [...entry.til],
  bigTheme: [...entry.bigTheme],
  majorContribution: [...entry.majorContribution],
});

const createEmptyEntry = (date = new Date().toISOString().split('T')[0]): Entry => ({
  date,
  todos: [],
  logs: [],
  til: [],
  bigTheme: [],
  majorContribution: []
});

// Parse time format (3h, 1d, 30m) to minutes
const parseTimeToMinutes = (timeStr: string) => {
  if (!timeStr) return 0;
  const match = timeStr.match(/^(\d+\.?\d*)(h|d|m)$/i);
  if (!match) return 0;
  const [, value, unit] = match;
  const num = parseFloat(value);
  switch (unit.toLowerCase()) {
    case 'h': return num * 60;
    case 'd': return num * 8 * 60;
    case 'm': return num;
    default: return 0;
  }
};

const formatMinutesToHours = (minutes: number) => {
  const hours = minutes / 60;
  return `${hours.toFixed(1)}h`;
};

const Entries = ({ setAddEntry, isVisible }: EntriesProps) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [currentEntry, setCurrentEntry] = useState<Entry>(() => createEmptyEntry());
  const bulletFields: BulletField[] = ['til', 'bigTheme', 'majorContribution'];

  const prepareEntryForEditing = useCallback((entry: Entry) => {
    setEditingEntry(entry);
    setCurrentEntry(cloneEntry(entry));
  }, []);

  const handleOpenDialog = useCallback((entry?: Entry) => {
    if (entry) {
      prepareEntryForEditing(entry);
    } else {
      const today = new Date().toISOString().split('T')[0];
      const existingToday = entries.find((item) => item.date === today);
      if (existingToday) {
        prepareEntryForEditing(existingToday);
      } else {
        setEditingEntry(null);
        setCurrentEntry(createEmptyEntry(today));
      }
    }
    setShowDialog(true);
  }, [entries, prepareEntryForEditing]);

  useEffect(() => {
    const stored = localStorage.getItem(ENTRIES_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Entry[];
        setEntries(sortEntriesByDateDesc(parsed));
      } catch (error) {
        console.warn('Failed to parse stored entries', error);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setAddEntry(() => () => handleOpenDialog());
  }, [handleOpenDialog, setAddEntry]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries));
  }, [entries, isHydrated]);

  // Keyboard shortcut: E to edit most recent entry
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key !== 'e' && e.key !== 'E') {
        return;
      }
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (entries.length > 0 && !showDialog) {
        handleOpenDialog(entries[0]);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [entries, handleOpenDialog, showDialog]);

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingEntry(null);
  };

  const handleSaveEntry = () => {
    setEntries((prevEntries) => {
      const entriesCopy = [...prevEntries];
      const existingIndex = entriesCopy.findIndex(
        (entry) => entry.date === currentEntry.date
      );

      if (existingIndex !== -1) {
        entriesCopy[existingIndex] = currentEntry;
        return sortEntriesByDateDesc(entriesCopy);
      }

      if (editingEntry) {
        const editingIndex = entriesCopy.findIndex(
          (entry) => entry.date === editingEntry.date
        );
        if (editingIndex !== -1) {
          entriesCopy.splice(editingIndex, 1, currentEntry);
          return sortEntriesByDateDesc(entriesCopy);
        }
      }

      return sortEntriesByDateDesc([currentEntry, ...entriesCopy]);
    });
    handleCloseDialog();
  };

  const handleDeleteEntry = (date: string) => {
    if (window.confirm('Delete this entry?')) {
      setEntries((prevEntries) => prevEntries.filter((entry) => entry.date !== date));
    }
  };

  const handleDateChange = (nextDate: string) => {
    const existingEntry = entries.find((entry) => entry.date === nextDate);
    if (existingEntry) {
      prepareEntryForEditing(existingEntry);
    } else {
      setEditingEntry(null);
      setCurrentEntry(createEmptyEntry(nextDate));
    }
  };

  const addTodo = () => {
    setCurrentEntry((prev) => ({
      ...prev,
      todos: [...prev.todos, { text: '', completed: false }],
    }));
  };

  const updateTodo = <K extends keyof Todo>(index: number, field: K, value: Todo[K]) => {
    setCurrentEntry((prev) => {
      const todos = prev.todos.map((todo, i) => (i === index ? { ...todo, [field]: value } : todo));
      return { ...prev, todos };
    });
  };

  const removeTodo = (index: number) => {
    setCurrentEntry((prev) => ({
      ...prev,
      todos: prev.todos.filter((_, i) => i !== index),
    }));
  };

  const addLog = () => {
    setCurrentEntry((prev) => ({
      ...prev,
      logs: [...prev.logs, { timeSpent: '', description: '', projectCode: '' }],
    }));
  };

  const updateLog = <K extends keyof LogEntry>(index: number, field: K, value: LogEntry[K]) => {
    setCurrentEntry((prev) => {
      const logs = prev.logs.map((log, i) => (i === index ? { ...log, [field]: value } : log));
      return { ...prev, logs };
    });
  };

  const removeLog = (index: number) => {
    setCurrentEntry((prev) => ({
      ...prev,
      logs: prev.logs.filter((_, i) => i !== index),
    }));
  };

  const addBulletPoint = (field: BulletField) => {
    setCurrentEntry((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const updateBulletPoint = (field: BulletField, index: number, value: string) => {
    setCurrentEntry((prev) => {
      const updatedField = prev[field].map((item, i) => (i === index ? value : item));
      return { ...prev, [field]: updatedField };
    });
  };

  const removeBulletPoint = (field: BulletField, index: number) => {
    setCurrentEntry((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const calculateTotalTime = (logs: LogEntry[]) => {
    const totalMinutes = logs.reduce((sum, log) => sum + parseTimeToMinutes(log.timeSpent), 0);
    return formatMinutesToHours(totalMinutes);
  };

  const toggleTodoInEntry = (entryDate: string, todoIndex: number) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) => {
        if (entry.date !== entryDate) {
          return entry;
        }
        const todos = entry.todos.map((todo, index) =>
          index === todoIndex ? { ...todo, completed: !todo.completed } : todo
        );
        return { ...entry, todos };
      })
    );
  };

  const groupLogsByProject = (logs: LogEntry[]) => {
    const grouped: Record<string, LogEntry[]> = {};
    logs.forEach((log) => {
      const project = log.projectCode?.trim() || 'No Project';
      if (!grouped[project]) {
        grouped[project] = [];
      }
      grouped[project].push(log);
    });
    return grouped;
  };

  // Pagination
  const totalPages = Math.ceil(entries.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;
  const paginatedEntries = entries.slice(startIndex, endIndex);

  return (
    <>
      {isVisible && (
        <div style={styles.entriesContainer}>
        {paginatedEntries.map((entry) => {
          const totalTime = calculateTotalTime(entry.logs);
          const totalMinutes = parseTimeToMinutes(totalTime);
          const isFullDay = totalMinutes >= 480;

          return (
            <div key={entry.date} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardHeaderLeft}>
                  <h2 style={styles.cardDate}>{entry.date}</h2>
                  {entry.logs.length > 0 && (
                    <span style={{
                      ...styles.badge,
                      backgroundColor: isFullDay ? '#4caf50' : '#ff9800',
                      color: 'white'
                    }}>
                      Total: {totalTime}
                    </span>
                  )}
                </div>
                <div style={styles.buttonGroup}>
                  <button
                    onClick={() => handleOpenDialog(entry)}
                    style={{...styles.iconButton, ...styles.editButton}}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry.date)}
                    style={{...styles.iconButton, ...styles.deleteButton}}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div style={styles.cardContent}>
                <div style={styles.column}>
                  <h3 style={styles.columnTitle}>Todo</h3>
                  {entry.todos.map((todo, i) => (
                    <div 
                      key={i} 
                      style={{...styles.todoItem, cursor: 'pointer'}}
                      onClick={() => toggleTodoInEntry(entry.date, i)}
                    >
                      <span>{todo.completed ? '✅' : '⬜'}</span>
                      <span style={{
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? '#999' : '#000'
                      }}>
                        {todo.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={styles.column}>
                  <h3 style={styles.columnTitle}>Logs</h3>
                  {Object.entries(groupLogsByProject(entry.logs)).map(([project, logs]) => (
                    <div key={project} style={{ marginBottom: '12px' }}>
                      {project !== 'No Project' && (
                        <div style={styles.projectLabel}>{project}</div>
                      )}
                      {logs.map((log, i) => (
                        <div key={i} style={styles.bulletItem}>
                          • <strong>{log.timeSpent}</strong> - {log.description}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div style={styles.column}>
                  <h3 style={styles.columnTitle}>TIL</h3>
                  {entry.til.map((item, i) => (
                    <div key={i} style={styles.bulletItem}>• {item}</div>
                  ))}
                </div>

                <div style={styles.column}>
                  <h3 style={styles.columnTitle}>Big Theme</h3>
                  {entry.bigTheme.map((item, i) => (
                    <div key={i} style={styles.bulletItem}>• {item}</div>
                  ))}
                </div>

                <div style={styles.column}>
                  <h3 style={styles.columnTitle}>Major Contribution</h3>
                  {entry.majorContribution.map((item, i) => (
                    <div key={i} style={styles.bulletItem}>• {item}</div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {entries.length === 0 && (
          <div style={styles.emptyState}>
            <p>No entries yet. Click "New Entry" to get started!</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{...styles.button, ...styles.secondaryButton}}
            >
              ← Previous
            </button>
            <span style={styles.paginationInfo}>
              Page {currentPage} of {totalPages} ({entries.length} total entries)
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{...styles.button, ...styles.secondaryButton}}
            >
              Next →
            </button>
          </div>
        )}
      </div>
      )}

      {showDialog && (
        <div style={styles.overlay} onClick={handleCloseDialog}>
          <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <div style={styles.dialogHeader}>
              <h2>{editingEntry ? 'Edit Entry' : 'New Entry'}</h2>
              <button onClick={handleCloseDialog} style={styles.closeButton}>✕</button>
            </div>

            <div style={styles.dialogContent}>
              <label style={styles.label}>
                Date
                <input
                  type="date"
                  value={currentEntry.date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  style={styles.input}
                />
              </label>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Todo</h3>
                {currentEntry.todos.map((todo, i) => (
                  <div key={i} style={styles.inputRow}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={(e) => updateTodo(i, 'completed', e.target.checked)}
                      style={styles.checkbox}
                    />
                    <input
                      type="text"
                      value={todo.text}
                      onChange={(e) => updateTodo(i, 'text', e.target.value)}
                      placeholder="Todo item"
                      style={{...styles.input, flex: 1}}
                    />
                    <button onClick={() => removeTodo(i)} style={styles.removeButton}>🗑️</button>
                  </div>
                ))}
                <button onClick={addTodo} style={styles.addButton}>+ Add Todo</button>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Logs</h3>
                {currentEntry.logs.map((log, i) => (
                  <div key={i} style={styles.inputRow}>
                    <input
                      type="text"
                      value={log.projectCode}
                      onChange={(e) => updateLog(i, 'projectCode', e.target.value)}
                      placeholder="Project Code"
                      style={{...styles.input, width: '140px'}}
                    />
                    <input
                      type="text"
                      value={log.timeSpent}
                      onChange={(e) => updateLog(i, 'timeSpent', e.target.value)}
                      placeholder="3h, 30m, 1d"
                      style={{...styles.input, width: '100px'}}
                    />
                    <input
                      type="text"
                      value={log.description}
                      onChange={(e) => updateLog(i, 'description', e.target.value)}
                      placeholder="Description"
                      style={{...styles.input, flex: 1}}
                    />
                    <button onClick={() => removeLog(i)} style={styles.removeButton}>🗑️</button>
                  </div>
                ))}
                <button onClick={addLog} style={styles.addButton}>+ Add Log</button>
                {currentEntry.logs.length > 0 && (
                  <span style={{
                    ...styles.badge,
                    backgroundColor: parseTimeToMinutes(calculateTotalTime(currentEntry.logs)) >= 480 ? '#4caf50' : '#ff9800',
                    color: 'white',
                    marginLeft: '10px'
                  }}>
                    Total: {calculateTotalTime(currentEntry.logs)}
                  </span>
                )}
              </div>

              {bulletFields.map((field) => (
                <div key={field} style={styles.section}>
                  <h3 style={styles.sectionTitle}>
                    {field === 'til' ? 'TIL (Today I Learned)' :
                     field === 'bigTheme' ? 'Big Theme' : 'Major Contribution'}
                  </h3>
                  {currentEntry[field].map((item, i) => (
                    <div key={i} style={styles.inputRow}>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateBulletPoint(field, i, e.target.value)}
                        placeholder="Bullet point"
                        style={{...styles.input, flex: 1}}
                      />
                      <button onClick={() => removeBulletPoint(field, i)} style={styles.removeButton}>🗑️</button>
                    </div>
                  ))}
                  <button onClick={() => addBulletPoint(field)} style={styles.addButton}>+ Add Point</button>
                </div>
              ))}
            </div>

            <div style={styles.dialogFooter}>
              <button onClick={handleCloseDialog} style={{...styles.button, ...styles.secondaryButton}}>
                Cancel
              </button>
              <button onClick={handleSaveEntry} style={{...styles.button, ...styles.primaryButton}}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Entries;
