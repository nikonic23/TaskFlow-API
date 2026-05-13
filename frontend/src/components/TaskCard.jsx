import { useState } from "react";
import { updateTask, deleteTask } from "../services/taskService";

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
  });

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateTask(task.id, editFormData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(task.id);
        onDelete();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return { backgroundColor: "#d4edda", color: "#155724" };
      case "in_progress":
        return { backgroundColor: "#fff3cd", color: "#856404" };
      default:
        return { backgroundColor: "#f8d7da", color: "#721c24" };
    }
  };

  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "1rem",
      margin: "1rem 0",
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      {isEditing ? (
        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            name="title"
            value={editFormData.title}
            onChange={handleEditChange}
            required
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <textarea
            name="description"
            value={editFormData.description}
            onChange={handleEditChange}
            rows="3"
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <select
            name="status"
            value={editFormData.status}
            onChange={handleEditChange}
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div>
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "0.5rem"
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0 }}>{task.title}</h3>
            <span
              style={{
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                ...getStatusColor(task.status)
              }}
            >
              {task.status.replace("_", " ").toUpperCase()}
            </span>
          </div>

          {task.description && (
            <p style={{ margin: "0.5rem 0", color: "#666" }}>{task.description}</p>
          )}

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#ffc107",
                color: "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;