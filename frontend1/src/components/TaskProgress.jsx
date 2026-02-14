import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "./TaskProgress.css";

export default function TaskProgress({ tasks }) {
  const todoCount = tasks.filter(t => t.status === "todo").length;
  const inProgressCount = tasks.filter(t => t.status === "inprogress").length;
  const doneCount = tasks.filter(t => t.status === "done").length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  const barData = [
    { name: "To Do", tasks: todoCount },
    { name: "In Progress", tasks: inProgressCount },
    { name: "Done", tasks: doneCount }
  ];

  const pieData = [
    { name: "To Do", value: todoCount },
    { name: "In Progress", value: inProgressCount },
    { name: "Done", value: doneCount }
  ];

  const COLORS = ["#6366f1", "#f59e0b", "#10b981"];

  // Count by priority
  const priorityData = [
    { name: "High", count: tasks.filter(t => t.priority === "High").length },
    { name: "Medium", count: tasks.filter(t => t.priority === "Medium").length },
    { name: "Low", count: tasks.filter(t => t.priority === "Low").length }
  ];

  return (
    <div className="task-progress">
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-value">{totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{todoCount}</div>
          <div className="stat-label">To Do</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{inProgressCount}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{doneCount}</div>
          <div className="stat-label">Done</div>
        </div>
        <div className="stat-card completion">
          <div className="stat-value">{completionPercentage}%</div>
          <div className="stat-label">Completion</div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h3>Tasks by Status</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasks" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Task Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value, x, y, midAngle }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = 95;
                  const cx2 = x + radius * 0.1 * Math.cos(-midAngle * RADIAN);
                  const cy2 = y + radius * 0.1 * Math.sin(-midAngle * RADIAN);
                  return (
                    <text x={cx2} y={cy2} textAnchor={cx2 > 250 ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fill="#475569">
                      {`${name}: ${value}`}
                    </text>
                  );
                }}
                outerRadius={60}
                innerRadius={30}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={30} iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
