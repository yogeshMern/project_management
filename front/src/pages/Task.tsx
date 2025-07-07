import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/TypedHooks";
import { fetchTasksByProject, deleteTask, type Task } from "../redux/TaskSlice";
import TaskForm from "../components/TaskForm";
import { useLocation } from "react-router-dom";

const TaskPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const dispatch = useAppDispatch();
  const location = useLocation();

  // Get project info from route state
  const project = location.state as {
    id: string;
    title: string;
    description: string;
    status: "todo" | "in-progress" | "done";
  };

  const { tasks, loading, error } = useAppSelector((state) => state.Tasks);

  useEffect(() => {
    if (project?.id) {
      dispatch(fetchTasksByProject(project.id));
    }
  }, [dispatch, project?.id]);

  const handleDelete = async (taskId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmed) {
      const resultAction = await dispatch(deleteTask(taskId));

      // Optional: display notification
      if (deleteTask.fulfilled.match(resultAction)) {
        console.log("Task deleted:", resultAction.payload.message);
      } else {
        console.error("Failed to delete task:", resultAction.payload);
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditTask(null);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Tasks for Project: {project?.title}
        </h2>
        <button
          onClick={() => {
            setEditTask(null); // reset editing
            setShowForm(true);
          }}
          className="border rounded px-4 py-2 hover:bg-gray-200"
        >
          Add Task
        </button>
      </div>

      {/* Add/Edit Task Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full relative">
            <TaskForm
              projectId={project.id}
              onClose={handleFormClose}
              initialData={editTask || undefined}
              isEdit={!!editTask}
            />
          </div>
        </div>
      )}

      {/* Loading/Error/Empty */}
      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && tasks.length === 0 && <p>No tasks found.</p>}

      {/* Task List */}
      <ul className="space-y-3 mt-4">
        {tasks.map((task) => (
          <li key={task.id} className="border rounded p-3 bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{task.title}</h3>
                <span className="text-sm text-gray-500">{task.status}</span>
              </div>
              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => handleEdit(task)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-700">{task.description}</p>
            {task.dueDate && (
              <p className="text-sm text-gray-400">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskPage;
