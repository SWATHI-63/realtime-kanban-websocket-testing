import { useState, useEffect, useRef } from "react";
import "./Navbar.css";

export default function Navbar({ 
  onAddTask, 
  onSearch, 
  onFilterPriority, 
  onFilterCategory,
  isConnected,
  taskCount 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activePriority, setActivePriority] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const filterRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handlePriorityChange = (value) => {
    setActivePriority(value);
    onFilterPriority(value);
  };

  const handleCategoryChange = (value) => {
    setActiveCategory(value);
    onFilterCategory(value);
  };

  const clearAllFilters = () => {
    setActivePriority("");
    setActiveCategory("");
    onFilterPriority("");
    onFilterCategory("");
  };

  const hasActiveFilters = activePriority || activeCategory;

  const handleClearAll = () => {
    if (confirm(`Are you sure you want to delete all ${taskCount} tasks?`)) {
      onClearAll();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">
          🚀 SyncBoard
        </h1>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="navbar-center">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-wrapper" ref={filterRef}>
          <button 
            className={`filter-btn ${showFilters ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            title="Filter tasks"
          >
            <span>🔽 Filters</span>
            {hasActiveFilters && <span className="filter-badge">{(activePriority ? 1 : 0) + (activeCategory ? 1 : 0)}</span>}
          </button>

          {showFilters && (
            <div className="filter-dropdown">
              <div className="filter-dropdown-header">
                <span className="filter-dropdown-title">Filters</span>
                {hasActiveFilters && (
                  <button className="clear-filters-btn" onClick={clearAllFilters}>
                    Clear all
                  </button>
                )}
              </div>
              <div className="filter-section">
                <label>Priority:</label>
                <select value={activePriority} onChange={(e) => handlePriorityChange(e.target.value)}>
                  <option value="">All</option>
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>
              <div className="filter-section">
                <label>Category:</label>
                <select value={activeCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
                  <option value="">All</option>
                  <option value="Bug">🐛 Bug</option>
                  <option value="Feature">✨ Feature</option>
                  <option value="Enhancement">🔧 Enhancement</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="filter-chips">
            {activePriority && (
              <span className="filter-chip">
                {activePriority}
                <button onClick={() => handlePriorityChange("")}>&times;</button>
              </span>
            )}
            {activeCategory && (
              <span className="filter-chip">
                {activeCategory}
                <button onClick={() => handleCategoryChange("")}>&times;</button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="navbar-right">
        <button className="navbar-btn add-btn" onClick={onAddTask} title="Add new task">
          ➕ Add Task
        </button>

        <div className="task-counter">
          <span className="counter-label">Tasks:</span>
          <span className="counter-value">{taskCount}</span>
        </div>
      </div>
    </nav>
  );
}
