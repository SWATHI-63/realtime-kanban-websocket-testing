import { useDrag } from "react-dnd";
import { socket } from "../socket/socket";
import "./TaskCard.css";

const ItemTypes = {
  TASK: "task"
};

export default function TaskCard({ task }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  const handleDelete = () => {
    if (confirm("Delete this task?")) {
      socket.emit("task:delete", task.id);
    }
  };

  const handlePriorityChange = (e) => {
    socket.emit("task:update", { ...task, priority: e.target.value });
  };

  const handleCategoryChange = (e) => {
    socket.emit("task:update", { ...task, category: e.target.value });
  };

  const handleTitleChange = (newTitle) => {
    socket.emit("task:update", { ...task, title: newTitle });
  };

  const handleDescriptionChange = (newDescription) => {
    socket.emit("task:update", { ...task, description: newDescription });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "#ef4444";
      case "Medium": return "#f59e0b";
      case "Low": return "#10b981";
      default: return "#e2e8f0";
    }
  };

  return (
    <div
      ref={drag}
      className="task-card"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        borderLeft: `4px solid ${getPriorityColor(task.priority)}`
      }}
    >
      <div className="task-header">
        <input
          type="text"
          className="task-title"
          value={task.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Task title"
        />
        <button className="delete-btn" onClick={handleDelete}>×</button>
      </div>

      <textarea
        className="task-description"
        value={task.description || ""}
        onChange={(e) => handleDescriptionChange(e.target.value)}
        placeholder="Add description..."
        rows="2"
      />

      <div className="task-meta">
        <div className="task-field">
          <label>Priority:</label>
          <select value={task.priority} onChange={handlePriorityChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="task-field">
          <label>Category:</label>
          <select value={task.category} onChange={handleCategoryChange}>
            <option value="Bug">Bug</option>
            <option value="Feature">Feature</option>
            <option value="Enhancement">Enhancement</option>
          </select>
        </div>
      </div>

      {task.attachments && task.attachments.length > 0 && (
        <div className="task-attachments">
          {task.attachments.map((file, idx) => (
            <div key={idx} className="attachment">
              {file.url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img src={file.url} alt={file.name} className="attachment-preview" />
              ) : (
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  📎 {file.name}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
