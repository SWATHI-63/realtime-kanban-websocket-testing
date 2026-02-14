import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import KanbanBoard from '../components/KanbanBoard';
import { socket } from '../socket/socket';

describe('KanbanBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders kanban board with header', () => {
    render(<KanbanBoard />);
    
    expect(screen.getByText(/SyncBoard/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Task/i)).toBeInTheDocument();
  });

  it('renders all three columns', () => {
    render(<KanbanBoard />);
    
    expect(screen.getByText('📋 To Do')).toBeInTheDocument();
    expect(screen.getByText('⚙️ In Progress')).toBeInTheDocument();
    expect(screen.getByText('✅ Done')).toBeInTheDocument();
  });

  it('sets up socket listener on mount', () => {
    render(<KanbanBoard />);
    
    expect(socket.on).toHaveBeenCalledWith('sync:tasks', expect.any(Function));
  });

  it('cleans up socket listener on unmount', () => {
    const { unmount } = render(<KanbanBoard />);
    
    unmount();
    
    expect(socket.off).toHaveBeenCalledWith('sync:tasks');
  });

  it('emits task:create when add task button is clicked', () => {
    render(<KanbanBoard />);
    
    const addButton = screen.getByText(/Add Task/i);
    fireEvent.click(addButton);
    
    expect(socket.emit).toHaveBeenCalledWith('task:create', expect.objectContaining({
      title: 'New Task',
      status: 'todo',
      priority: 'Medium',
      category: 'Feature'
    }));
  });

  it('displays task progress component', () => {
    render(<KanbanBoard />);
    
    // TaskProgress renders stats cards
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Completion')).toBeInTheDocument();
  });
});
