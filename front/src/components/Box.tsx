import React, { useState } from "react";
import EditProjectForm from "../components/EditProjectFrom";

interface BoxProps {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  onDelete: () => void;
  onClick?: () => void;
}

const Box: React.FC<BoxProps> = ({
  id,
  title,
  description,
  status,
  onDelete,
  onClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCloseEdit = () => setIsEditing(false);

  return (
    <div
      className="relative w-[400px] rounded-xl bg-white shadow-md p-6"
      onClick={() => {
        if (!isEditing && onClick) {
          onClick();
        }
      }}
    >
      <div className="text-sm font-semibold tracking-wide text-indigo-500 uppercase flex justify-between">
        <span>Project</span>
        <div className="flex gap-4">
          <span
            onClick={handleEditClick}
            className="text-green-500 cursor-pointer hover:underline"
          >
            Edit
          </span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-500 cursor-pointer hover:underline"
          >
            Delete
          </span>
        </div>
      </div>

      <h2 className="mt-2 text-lg font-medium text-black">{title}</h2>
      <p className="mt-4 text-gray-500 text-sm">{description}</p>

      {isEditing && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
          <EditProjectForm
            project={{ id, title, description, status }}
            onClose={handleCloseEdit}
          />
        </div>
      )}
    </div>
  );
};

export default Box;
