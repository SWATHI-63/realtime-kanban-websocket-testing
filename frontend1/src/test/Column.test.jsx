import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from '../components/Column';

const mockTasks = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    status: 'todo',
    priority: 'High',
    category: 'Feature',
    attachments: []
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Description 2',
    status: 'todo',
    priority: 'Low',
    category: 'Bug',
    attachments: []
  }
];

const renderWithDnd = (component) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      {component}
    </DndProvider>
  );
};

describe('Column', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders column with title and task count', () => {
    renderWithDnd(<Column title="To Do" status="todo" tasks={mockTasks} />);
    
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('(2)')).toBeInTheDocument();
  });

  it('renders all tasks in the column', () => {
    renderWithDnd(<Column title="To Do" status="todo" tasks={mockTasks} />);
    
    expect(screen.getByDisplayValue('Task 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Task 2')).toBeInTheDocument();
  });

  it('shows empty state when no tasks', () => {
    renderWithDnd(<Column title="To Do" status="todo" tasks={[]} />);
    
    expect(screen.getByText('Drop tasks here')).toBeInTheDocument();
    expect(screen.getByText('(0)')).toBeInTheDocument();
  });

  it('applies correct status to tasks', () => {
    renderWithDnd(<Column title="In Progress" status="inprogress" tasks={mockTasks} />);
    
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });
});
