import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskCard from '../components/TaskCard';
import { socket } from '../socket/socket';

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo',
  priority: 'High',
  category: 'Feature',
  attachments: []
};

const renderWithDnd = (component) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      {component}
    </DndProvider>
  );
};

describe('TaskCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders task card with correct data', () => {
    renderWithDnd(<TaskCard task={mockTask} />);
    
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('High')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Feature')).toBeInTheDocument();
  });

  it('calls socket.emit when priority changes', () => {
    renderWithDnd(<TaskCard task={mockTask} />);
    
    const prioritySelect = screen.getByDisplayValue('High');
    fireEvent.change(prioritySelect, { target: { value: 'Low' } });
    
    expect(socket.emit).toHaveBeenCalledWith('task:update', {
      ...mockTask,
      priority: 'Low'
    });
  });

  it('calls socket.emit when category changes', () => {
    renderWithDnd(<TaskCard task={mockTask} />);
    
    const categorySelect = screen.getByDisplayValue('Feature');
    fireEvent.change(categorySelect, { target: { value: 'Bug' } });
    
    expect(socket.emit).toHaveBeenCalledWith('task:update', {
      ...mockTask,
      category: 'Bug'
    });
  });

  it('calls socket.emit when title changes', () => {
    renderWithDnd(<TaskCard task={mockTask} />);
    
    const titleInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
    
    expect(socket.emit).toHaveBeenCalledWith('task:update', {
      ...mockTask,
      title: 'Updated Task'
    });
  });

  it('calls socket.emit when delete button is clicked', () => {
    // Mock window.confirm
    window.confirm = vi.fn(() => true);
    
    renderWithDnd(<TaskCard task={mockTask} />);
    
    const deleteButton = screen.getByText('×');
    fireEvent.click(deleteButton);
    
    expect(socket.emit).toHaveBeenCalledWith('task:delete', mockTask.id);
  });

  it('does not delete when confirm is cancelled', () => {
    window.confirm = vi.fn(() => false);
    
    renderWithDnd(<TaskCard task={mockTask} />);
    
    const deleteButton = screen.getByText('×');
    fireEvent.click(deleteButton);
    
    expect(socket.emit).not.toHaveBeenCalledWith('task:delete', mockTask.id);
  });

  it('displays attachments when present', () => {
    const taskWithAttachment = {
      ...mockTask,
      attachments: [{ url: 'test.pdf', name: 'test.pdf' }]
    };
    
    renderWithDnd(<TaskCard task={taskWithAttachment} />);
    
    expect(screen.getByText('📎 test.pdf')).toBeInTheDocument();
  });
});
