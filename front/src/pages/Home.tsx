import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/TypedHooks";
import {
  fetchProjects,
  deleteProject,
  type Project,
} from "../redux/ProjectSlice";
import Box from "../components/Box";
import AddProjectForm from "../components/AddProjectForm";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { projects, loading, error } = useAppSelector(
    (state) => state.projects
  );

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/login");
    }
    dispatch(fetchProjects(searchTerm || undefined));
  }, [dispatch, searchTerm]);

  const handleBoxClick = (project: Project) => {
    navigate("/task", { state: project });
  };

  const handleDelete = (id: string) => {
    dispatch(deleteProject(id));
  };

  return (
    <>
      {/* Search + Add Button */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex-1 mr-4">
          <input
            type="text"
            placeholder="Search Projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="border rounded px-4 py-2 cursor-pointer hover:bg-gray-200"
        >
          Add Project
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full relative">
            <AddProjectForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Project List */}
      <div className="flex flex-wrap gap-6 p-4">
        {loading && <p>Loading projects...</p>}
        {error && <p className="text-red-600">Project not found!</p>}
        {!loading && !error && projects.length === 0 && (
          <p>No projects found.</p>
        )}

        {!loading &&
          !error &&
          projects.map((proj) => (
            <Box
              key={proj.id}
              id={proj.id}
              title={proj.title}
              description={proj.description}
              status={proj.status}
              onClick={() => handleBoxClick(proj)}
              onDelete={() => handleDelete(proj.id)}
            />
          ))}
      </div>
    </>
  );
};

export default Home;
