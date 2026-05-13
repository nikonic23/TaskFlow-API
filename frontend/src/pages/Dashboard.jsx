import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import {
  getTasks,
  createTask,
} from "../services/taskService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTask(formData);

      setFormData({
        title: "",
        description: "",
      });

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "white" }}>
          <h2>Create New Task</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
            />
            <button type="submit" style={{ padding: "0.5rem 1rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Create Task
            </button>
          </form>
        </div>

        <div>
          <h2>Your Tasks ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <p>No tasks yet. Create your first task above!</p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={fetchTasks}
                onDelete={fetchTasks}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;