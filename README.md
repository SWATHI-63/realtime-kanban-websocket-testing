# 🚀 SyncBoard - Real-time Kanban Board

A feature-rich, real-time Kanban board application built with React and Node.js using WebSockets for live task synchronization. Users can create, update, delete, and move tasks across columns, assign priority and category, upload attachments, and visualize progress with interactive charts.

## ✨ Features

### Core Functionality
- ✅ **Real-time Synchronization** - Multiple users can collaborate simultaneously with instant updates via WebSockets
- ✅ **Drag & Drop** - Intuitive task movement between columns using React DnD
- ✅ **Task Management** - Create, read, update, and delete tasks with full CRUD operations
- ✅ **Priority Levels** - Assign High, Medium, or Low priority with color-coded indicators
- ✅ **Category Tags** - Organize tasks by Bug, Feature, or Enhancement categories
- ✅ **File Attachments** - Upload images, PDFs, and documents to tasks (5MB limit)
- ✅ **Task Descriptions** - Add detailed descriptions to each task

### Visualization
- 📊 **Progress Charts** - Real-time task statistics with Recharts
  - Bar chart showing tasks by status
  - Pie chart displaying task distribution
  - Priority-based task breakdown
- 📈 **Live Statistics** - Track total tasks, completion percentage, and status counts

### Testing Suite
- 🧪 **Unit Tests** - Component-level testing with Vitest and React Testing Library
- 🔗 **Integration Tests** - WebSocket and state management testing
- 🎭 **E2E Tests** - Full user journey testing with Playwright
  - Kanban board operations
  - Drag and drop functionality
  - File upload workflows
  - Multi-user scenarios

## 🏗️ Architecture

### Backend (Node.js + Socket.IO)
```
backend/
├── server.js        # WebSocket server and REST API
├── uploads/         # File storage directory
└── package.json     # Dependencies
```

**WebSocket Events:**
- `task:create` - Create a new task
- `task:update` - Update task properties
- `task:move` - Move task between columns
- `task:delete` - Remove a task
- `sync:tasks` - Synchronize all tasks with clients

**REST Endpoints:**
- `POST /upload` - Upload file attachments

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── components/
│   │   ├── KanbanBoard.jsx    # Main board container
│   │   ├── Column.jsx          # Droppable column
│   │   ├── TaskCard.jsx        # Draggable task card
│   │   └── TaskProgress.jsx    # Charts and statistics
│   ├── socket/
│   │   └── socket.js           # WebSocket client
│   ├── test/
│   │   ├── setup.js            # Test configuration
│   │   └── *.test.jsx          # Unit/integration tests
│   └── App.jsx
├── e2e/
│   ├── kanban.spec.js          # Kanban board E2E tests
│   ├── dragdrop.spec.js        # Drag & drop E2E tests
│   └── fileupload.spec.js      # File upload E2E tests
├── playwright.config.js
├── vitest.config.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd realtime-kanban-websocket-testing
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
```

4. **Install Playwright browsers** (for E2E tests)
```bash
cd frontend
npx playwright install
```

### Running the Application

1. **Start the backend server** (Terminal 1)
```bash
cd backend
node server.js
```
Server runs on `http://localhost:4000`

2. **Start the frontend dev server** (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5174`

3. **Open your browser**
Navigate to `http://localhost:5174`

## 🧪 Testing

### Unit & Integration Tests (Vitest)

**Run all tests:**
```bash
cd frontend
npm test
```

**Run tests in watch mode:**
```bash
npm test -- --watch
```

**Run tests with UI:**
```bash
npm run test:ui
```

**Test Coverage:**
- TaskCard component (priority, category, delete, drag)
- Column component (drop zones, task filtering)
- KanbanBoard component (WebSocket integration)
- TaskProgress component (statistics, charts)

### E2E Tests (Playwright)

**Run all E2E tests:**
```bash
cd frontend
npm run test:e2e
```

**Run E2E tests with UI mode:**
```bash
npm run test:e2e:ui
```

**Run specific test file:**
```bash
npx playwright test e2e/kanban.spec.js
```

**Test Scenarios:**
- ✅ Creating, updating, and deleting tasks
- ✅ Dragging tasks between columns
- ✅ Changing priority and category
- ✅ File upload functionality
- ✅ Real-time synchronization
- ✅ Chart updates

## 🎨 UI Features

### Task Card
- **Color-coded Priority** - Left border changes color (Red: High, Yellow: Medium, Green: Low)
- **Inline Editing** - Click to edit title and description
- **Dropdown Selects** - Quick priority and category changes
- **Attachment Preview** - Image thumbnails and file links
- **Delete Confirmation** - Prevents accidental deletion

### Kanban Board
- **Three Columns** - To Do, In Progress, Done
- **Empty States** - Visual feedback when columns are empty
- **Hover Effects** - Column highlights when dragging over
- **Smooth Animations** - CSS transitions for professional feel
- **Responsive Design** - Adapts to different screen sizes

### Progress Dashboard
- **Real-time Stats** - Updates instantly as tasks change
- **Interactive Charts** - Hover tooltips and legends
- **Completion Percentage** - Visual progress indicator
- **Priority Distribution** - See workload by priority level

## 📡 WebSocket Protocol

### Client to Server
```javascript
// Create task
socket.emit('task:create', {
  id: 1234567890,
  title: 'New Task',
  description: '',
  status: 'todo',
  priority: 'Medium',
  category: 'Feature',
  attachments: []
});

// Update task
socket.emit('task:update', {
  id: 1234567890,
  title: 'Updated Title',
  priority: 'High'
});

// Move task
socket.emit('task:move', {
  taskId: 1234567890,
  newStatus: 'inprogress'
});

// Delete task
socket.emit('task:delete', 1234567890);
```

### Server to Client
```javascript
// Sync all tasks
socket.on('sync:tasks', (tasks) => {
  setTasks(tasks);
});
```

## 🔧 Configuration

### Backend Configuration
Edit `backend/server.js`:
- Port: `4000` (default)
- CORS: `*` (allow all origins)
- File upload limit: `5MB`
- Accepted file types: `jpeg, jpg, png, gif, pdf, doc, docx`

### Frontend Configuration

**Development:**
The frontend automatically connects to `http://localhost:4000` for the backend.

**Production/Deployment:**
Set the `VITE_BACKEND_URL` environment variable to your deployed backend URL:

```bash
# Example for deployment
VITE_BACKEND_URL=https://your-backend.herokuapp.com
```

For deployment platforms:
- **Vercel/Netlify**: Add `VITE_BACKEND_URL` in environment variables settings
- **GitHub Pages**: Create `.env.production` file with `VITE_BACKEND_URL=your-backend-url`

Edit `frontend/playwright.config.js`:
- Base URL: `http://localhost:5174`
- Test directory: `./e2e`
- Browsers: `chromium, firefox, webkit`

## 📦 Dependencies

### Backend
- `express` - Web server framework
- `socket.io` - WebSocket library
- `cors` - Cross-origin resource sharing
- `multer` - File upload handling

### Frontend
- `react` - UI library
- `react-dnd` - Drag and drop
- `react-dnd-html5-backend` - HTML5 backend for DnD
- `recharts` - Charting library
- `socket.io-client` - WebSocket client
- `vitest` - Unit testing framework
- `@testing-library/react` - React testing utilities
- `@playwright/test` - E2E testing framework

## 🎯 Future Enhancements

- [ ] User authentication and authorization
- [ ] Task assignment to team members
- [ ] Due dates and reminders
- [ ] Task comments and activity log
- [ ] Custom columns and workflows
- [ ] Database persistence (MongoDB/PostgreSQL)
- [ ] Search and filter functionality
- [ ] Export tasks to CSV/JSON
- [ ] Dark mode support
- [ ] Mobile app (React Native)

## 📝 License

MIT License

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 💬 Support

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using React, Node.js, and WebSockets**
