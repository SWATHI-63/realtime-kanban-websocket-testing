import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskProgress from '../components/TaskProgress';

const mockTasks = [
  { id: 1, status: 'todo', priority: 'High', category: 'Feature' },
  { id: 2, status: 'todo', priority: 'Medium', category: 'Bug' },
  { id: 3, status: 'inprogress', priority: 'Low', category: 'Enhancement' },
  { id: 4, status: 'done', priority: 'High', category: 'Feature' },
  { id: 5, status: 'done', priority: 'Medium', category: 'Bug' }
];

describe('TaskProgress', () => {
  it('calculates and displays correct task counts', () => {
    render(<TaskProgress tasks={mockTasks} />);
    
    expect(screen.getByText('5')).toBeInTheDocument(); // Total tasks
    expect(screen.getByText('2')).toBeInTheDocument(); // To Do
    expect(screen.getByText('1')).toBeInTheDocument(); // In Progress
  });

  it('calculates completion percentage correctly', () => {
    render(<TaskProgress tasks={mockTasks} />);
    
    // 2 done out of 5 total = 40%
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('displays 0% completion when no tasks are done', () => {
    const incompleteTasks = [
      { id: 1, status: 'todo', priority: 'High', category: 'Feature' },
      { id: 2, status: 'inprogress', priority: 'Medium', category: 'Bug' }
    ];
    
    render(<TaskProgress tasks={incompleteTasks} />);
    
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('displays 100% completion when all tasks are done', () => {
    const completeTasks = [
      { id: 1, status: 'done', priority: 'High', category: 'Feature' },
      { id: 2, status: 'done', priority: 'Medium', category: 'Bug' }
    ];
    
    render(<TaskProgress tasks={completeTasks} />);
    
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders all stat labels', () => {
    render(<TaskProgress tasks={mockTasks} />);
    
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('Completion')).toBeInTheDocument();
  });

  it('renders chart titles', () => {
    render(<TaskProgress tasks={mockTasks} />);
    
    expect(screen.getByText('Tasks by Status')).toBeInTheDocument();
    expect(screen.getByText('Task Distribution')).toBeInTheDocument();
    expect(screen.getByText('Tasks by Priority')).toBeInTheDocument();
  });

  it('handles empty task array', () => {
    render(<TaskProgress tasks={[]} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
