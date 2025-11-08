import type { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    margin: 0,
    fontSize: '32px',
    color: '#333'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px'
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  primaryButton: {
    backgroundColor: '#2196f3',
    color: 'white'
  },
  secondaryButton: {
    backgroundColor: 'white',
    color: '#666',
    border: '1px solid #ddd'
  },
  dangerButton: {
    backgroundColor: '#f44336',
    color: 'white'
  },
  iconButton: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    backgroundColor: 'transparent'
  },
  editButton: {},
  deleteButton: {},
  entriesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '2px solid #f0f0f0'
  },
  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  cardDate: {
    margin: 0,
    fontSize: '20px',
    color: '#333'
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  cardContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  column: {
    minWidth: 0
  },
  columnTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2196f3',
    textTransform: 'uppercase'
  },
  todoItem: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '14px'
  },
  bulletItem: {
    marginBottom: '8px',
    fontSize: '14px',
    lineHeight: '1.5'
  },
  projectLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
    marginBottom: '6px',
    marginTop: '4px'
  },
  ideasSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  ideasHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '2px solid #f0f0f0'
  },
  ideasTitle: {
    margin: 0,
    fontSize: '20px',
    color: '#333'
  },
  ideasContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px'
  },
  ideasColumn: {
    minWidth: 0
  },
  ideasColumnTitle: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#2196f3'
  },
  emptyText: {
    color: '#999',
    fontSize: '14px',
    fontStyle: 'italic'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '24px',
    padding: '20px'
  },
  paginationInfo: {
    color: '#666',
    fontSize: '14px'
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '60px 20px',
    textAlign: 'center',
    color: '#999'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px'
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: '8px',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
  },
  dialogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e0e0e0'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#999'
  },
  dialogContent: {
    padding: '20px',
    overflowY: 'auto',
    flex: 1
  },
  dialogFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '20px',
    borderTop: '1px solid #e0e0e0'
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500'
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  section: {
    marginBottom: '24px',
    paddingBottom: '20px',
    borderBottom: '1px solid #f0f0f0'
  },
  sectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333'
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
    alignItems: 'center'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  removeButton: {
    padding: '6px 10px',
    border: 'none',
    background: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#f44336'
  },
  addButton: {
    padding: '6px 12px',
    border: '1px dashed #2196f3',
    backgroundColor: 'transparent',
    color: '#2196f3',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer'
  }
};
