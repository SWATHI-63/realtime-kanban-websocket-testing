import { useEffect, useState, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { socket } from "../socket/socket";
import Column from "./Column";
import TaskProgress from "./TaskProgress";
import Navbar from "./Navbar";
import AddTaskModal from "./AddTaskModal";
import ConnectionAlert from "./ConnectionAlert";
import "./KanbanBoard.css";

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Connection status handlers
    socket.on("connect", () => {
      setIsConnected(true);
      // Request tasks when connected
      socket.emit("request:tasks");
    });
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("sync:tasks", setTasks);
    
    // Check initial connection status
    setIsConnected(socket.connected);
    
    // If already connected, request tasks
    if (socket.connected) {
      socket.emit("request:tasks");
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("sync:tasks");
    };
  }, []);

  // Apply filters whenever tasks, search, or filters change
  useEffect(() => {
    let filtered = [...tasks];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Priority filter
    if (filterPriority) {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Category filter
    if (filterCategory) {
      filtered = filtered.filter(task => task.category === filterCategory);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, filterPriority, filterCategory]);

  const openAddModal = () => {
    if (!isConnected) {
      alert("⚠️ Not connected to server. Please ensure the backend is running on http://localhost:4000");
      return;
    }
    setShowAddModal(true);
  };

  const handleAddTask = (newTask) => {
    socket.emit("task:create", newTask);
  };

  const handleClearAll = () => {
    if (!isConnected) {
      alert("⚠️ Not connected to server.");
      return;
    }
    tasks.forEach(task => {
      socket.emit("task:delete", task.id);
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `syncboard-tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterPriority = (priority) => {
    setFilterPriority(priority);
  };

  const handleFilterCategory = (category) => {
    setFilterCategory(category);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Upload failed");

      const fileData = await response.json();
      
      const task = tasks.find(t => t.id === selectedTaskId);
      if (task) {
        const updatedTask = {
          ...task,
          attachments: [...(task.attachments || []), fileData]
        };
        socket.emit("task:update", updatedTask);
      }

      setShowUpload(false);
      setSelectedTaskId(null);
      alert("File uploaded successfully!");
    } catch (error) {
      alert("Failed to upload file: " + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const openUploadDialog = (taskId) => {
    setSelectedTaskId(taskId);
    setShowUpload(true);
  };

  const todoTasks = filteredTasks.filter(t => t.status === "todo");
  const inProgressTasks = filteredTasks.filter(t => t.status === "inprogress");
  const doneTasks = filteredTasks.filter(t => t.status === "done");

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-container">
        <Navbar
          onAddTask={openAddModal}
          onSearch={handleSearch}
          onFilterPriority={handleFilterPriority}
          onFilterCategory={handleFilterCategory}
          isConnected={isConnected}
          taskCount={tasks.length}
        />

        <AddTaskModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddTask={handleAddTask}
        />

        <div className="kanban-content">
          <TaskProgress tasks={tasks} />

          <div className="board">
            <Column title="📋 To Do" status="todo" tasks={todoTasks} />
            <Column title="⚙️ In Progress" status="inprogress" tasks={inProgressTasks} />
            <Column title="✅ Done" status="done" tasks={doneTasks} />
          </div>
        </div>

        {showUpload && (
          <div className="modal-overlay" onClick={() => setShowUpload(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Upload Attachment</h3>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx"
                disabled={uploading}
              />
              <div className="modal-actions">
                <button onClick={() => setShowUpload(false)} disabled={uploading}>
                  Cancel
                </button>
              </div>
              {uploading && <div className="uploading">Uploading...</div>}
            </div>
          </div>
        )}

        <ConnectionAlert isConnected={isConnected} />
      </div>
    </DndProvider>
  );
}
