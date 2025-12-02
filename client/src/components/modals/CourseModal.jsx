import React from "react";
import Modal from "../Modal";
import { getImageUrl } from "../../utils/imageUtils";

const CourseModal = ({
  isOpen,
  onClose,
  onSubmit,
  courseForm,
  setCourseForm,
  objectiveInput,
  setObjectiveInput,
  toolInput,
  setToolInput,
  editingCourseId,
  thumbnailFile, // eslint-disable-line no-unused-vars
  setThumbnailFile,
  thumbnailPreview,
  setThumbnailPreview,
}) => {
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setCourseForm({ ...courseForm, thumbnail_url: "" });
  };
  const addObjective = () => {
    if (objectiveInput.trim()) {
      setCourseForm({
        ...courseForm,
        objectives: [...courseForm.objectives, objectiveInput],
      });
      setObjectiveInput("");
    }
  };

  const removeObjective = (index) => {
    setCourseForm({
      ...courseForm,
      objectives: courseForm.objectives.filter((_, i) => i !== index),
    });
  };

  const addTool = () => {
    if (toolInput.trim()) {
      setCourseForm({
        ...courseForm,
        tools: [...courseForm.tools, toolInput],
      });
      setToolInput("");
    }
  };

  const removeTool = (index) => {
    setCourseForm({
      ...courseForm,
      tools: courseForm.tools.filter((_, i) => i !== index),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCourseId ? "Edit Course" : "Create New Course"}
      className="max-w-5xl"
    >
      <form
        onSubmit={onSubmit}
        className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            required
            value={courseForm.title}
            onChange={(e) =>
              setCourseForm({ ...courseForm, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            required
            value={courseForm.description}
            onChange={(e) =>
              setCourseForm({ ...courseForm, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              required
              step="0.01"
              value={courseForm.price}
              onChange={(e) =>
                setCourseForm({ ...courseForm, price: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <input
              type="text"
              required
              placeholder="e.g., 8 weeks"
              value={courseForm.duration}
              onChange={(e) =>
                setCourseForm({ ...courseForm, duration: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Access Duration (days)
            </label>
            <input
              type="number"
              required
              value={courseForm.duration_days}
              onChange={(e) =>
                setCourseForm({ ...courseForm, duration_days: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              required
              value={courseForm.level}
              onChange={(e) =>
                setCourseForm({ ...courseForm, level: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            required
            value={courseForm.category}
            onChange={(e) =>
              setCourseForm({ ...courseForm, category: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Thumbnail
          </label>
          <div className="space-y-2">
            {thumbnailPreview || courseForm.thumbnail_url ? (
              <div className="relative inline-block">
                <img
                  src={
                    thumbnailPreview || getImageUrl(courseForm.thumbnail_url)
                  }
                  alt="Thumbnail preview"
                  className="w-32 h-32 object-cover rounded-md border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : null}
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <span className="text-gray-500 text-sm self-center">or</span>
              <input
                type="url"
                placeholder="Image URL"
                value={
                  courseForm.thumbnail_url?.startsWith("/uploads/") ||
                  courseForm.thumbnail_url?.startsWith("data:")
                    ? ""
                    : courseForm.thumbnail_url || ""
                }
                onChange={(e) => {
                  // Clear file preview when typing URL
                  setThumbnailFile(null);
                  setThumbnailPreview(null);
                  setCourseForm({
                    ...courseForm,
                    thumbnail_url: e.target.value,
                  });
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Learning Objectives
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add objective"
              value={objectiveInput}
              onChange={(e) => setObjectiveInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={addObjective}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <ul className="space-y-1">
            {courseForm.objectives.map((obj, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span>{obj}</span>
                <button
                  type="button"
                  onClick={() => removeObjective(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tools/Technologies
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add tool"
              value={toolInput}
              onChange={(e) => setToolInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={addTool}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <ul className="space-y-1">
            {courseForm.tools.map((tool, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span>{tool}</span>
                <button
                  type="button"
                  onClick={() => removeTool(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={courseForm.is_active}
              onChange={(e) =>
                setCourseForm({ ...courseForm, is_active: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Active Course
            </span>
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-[#003D7A] text-white rounded-md hover:bg-[#002855]"
          >
            {editingCourseId ? "Update Course" : "Create Course"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CourseModal;
