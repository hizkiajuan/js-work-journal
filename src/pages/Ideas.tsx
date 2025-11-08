import { useEffect, useState } from "react";
import { styles } from "../styles";
import { IDEAS_STORAGE_KEY } from "../constants/storage";
import type { IdeasState } from "../types/journal";

const Ideas = () => {
  const [ideas, setIdeas] = useState<IdeasState>({
    improvementIdeas: [],
    learningTopics: []
  });
  const [isHydrated, setIsHydrated] = useState(false);
  const [showIdeasDialog, setShowIdeasDialog] = useState(false);

  useEffect(() => {
    const storedIdeas = localStorage.getItem(IDEAS_STORAGE_KEY);
    if (storedIdeas) {
      try {
        const parsed = JSON.parse(storedIdeas) as IdeasState;
        setIdeas(parsed);
      } catch (error) {
        console.warn('Failed to parse stored ideas', error);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(ideas));
  }, [ideas, isHydrated]);

  const addIdeaItem = (field: keyof IdeasState) => {
    setIdeas((prev) => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateIdeaItem = (field: keyof IdeasState, index: number, value: string) => {
    setIdeas((prev) => {
      const updatedField = prev[field].map((item, i) => (i === index ? value : item));
      return { ...prev, [field]: updatedField };
    });
  };

  const removeIdeaItem = (field: keyof IdeasState, index: number) => {
    setIdeas((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <>
      <div style={styles.ideasSection}>
        <div style={styles.ideasHeader}>
          <h2 style={styles.ideasTitle}>💡 Ideas & Learning</h2>
          <button
            onClick={() => setShowIdeasDialog(true)}
            style={{...styles.button, ...styles.secondaryButton}}
          >
            ✏️ Edit
          </button>
        </div>
        <div style={styles.ideasContent}>
          <div style={styles.ideasColumn}>
            <h3 style={styles.ideasColumnTitle}>Improvement Ideas</h3>
            {ideas.improvementIdeas.length > 0 ? (
              ideas.improvementIdeas.map((idea, i) => (
                <div key={i} style={styles.bulletItem}>• {idea}</div>
              ))
            ) : (
              <p style={styles.emptyText}>No ideas yet</p>
            )}
          </div>
          <div style={styles.ideasColumn}>
            <h3 style={styles.ideasColumnTitle}>Learning Topics</h3>
            {ideas.learningTopics.length > 0 ? (
              ideas.learningTopics.map((topic, i) => (
                <div key={i} style={styles.bulletItem}>• {topic}</div>
              ))
            ) : (
              <p style={styles.emptyText}>No topics yet</p>
            )}
          </div>
        </div>
      </div>

      {showIdeasDialog && (
        <div style={styles.overlay} onClick={() => setShowIdeasDialog(false)}>
          <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <div style={styles.dialogHeader}>
              <h2>Edit Ideas & Learning</h2>
              <button onClick={() => setShowIdeasDialog(false)} style={styles.closeButton}>✕</button>
            </div>

            <div style={styles.dialogContent}>
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Improvement Ideas</h3>
                {ideas.improvementIdeas.map((idea, i) => (
                  <div key={i} style={styles.inputRow}>
                    <input
                      type="text"
                      value={idea}
                      onChange={(e) => updateIdeaItem('improvementIdeas', i, e.target.value)}
                      placeholder="Improvement idea"
                      style={{...styles.input, flex: 1}}
                    />
                    <button onClick={() => removeIdeaItem('improvementIdeas', i)} style={styles.removeButton}>🗑️</button>
                  </div>
                ))}
                <button onClick={() => addIdeaItem('improvementIdeas')} style={styles.addButton}>+ Add Idea</button>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Learning Topics</h3>
                {ideas.learningTopics.map((topic, i) => (
                  <div key={i} style={styles.inputRow}>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => updateIdeaItem('learningTopics', i, e.target.value)}
                      placeholder="Learning topic"
                      style={{...styles.input, flex: 1}}
                    />
                    <button onClick={() => removeIdeaItem('learningTopics', i)} style={styles.removeButton}>🗑️</button>
                  </div>
                ))}
                <button onClick={() => addIdeaItem('learningTopics')} style={styles.addButton}>+ Add Topic</button>
              </div>
            </div>

            <div style={styles.dialogFooter}>
              <button onClick={() => setShowIdeasDialog(false)} style={{...styles.button, ...styles.primaryButton}}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Ideas;
