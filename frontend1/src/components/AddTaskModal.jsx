import { useState } from "react";
import "./AddTaskModal.css";

export default function AddTaskModal({ isOpen, onClose, onAddTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Feature");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      status: "todo",
      priority,
      category,
      attachments: []
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setCategory("Feature");
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="add-modal-overlay" onClick={handleOverlayClick}>
      <div className="add-modal">
        <div className="add-modal-header">
          <h2>Create New Task</h2>
          <button className="add-modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="add-modal-form">
          <div className="form-group">
            <label htmlFor="task-title">Title <span className="required">*</span></label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-category">Category</label>
              <select
                id="task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Bug">🐛 Bug</option>
                <option value="Feature">✨ Feature</option>
                <option value="Enhancement">🔧 Enhancement</option>
              </select>
            </div>
          </div>

          <div className="add-modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-create" disabled={!title.trim()}>
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
