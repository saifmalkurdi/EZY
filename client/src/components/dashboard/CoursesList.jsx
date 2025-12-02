import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";

const CoursesList = ({
  courses,
  onEditCourse,
  onDeleteCourse,
  onToggleStatus,
  onSearch,
  searchTerm = "",
  pagination,
  onPageChange,
}) => {
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(searchTerm);

  const handleCardClick = (courseId) => {
    navigate(`/course/${courseId}`);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearch);
    }
  };

  return (
    <div className="bg-white p-12 rounded-xl shadow-sm mb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h4 className="text-2xl font-bold text-[#003D7A]">My Courses</h4>
        {onSearch && (
          <form
            onSubmit={handleSearchSubmit}
            className="flex gap-2 w-full sm:w-auto"
          >
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search courses..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F98149] text-sm flex-1 sm:flex-initial sm:min-w-[250px]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#F98149] text-white rounded-lg hover:bg-[#e55a2a] text-sm font-medium"
            >
              Search
            </button>
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  onSearch("");
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-medium"
              >
                Clear
              </button>
            )}
          </form>
        )}
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleCardClick(course.id)}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Course Thumbnail */}
              {course.thumbnail_url && (
                <div className="bg-[#003D7A] h-44 flex items-center justify-center p-6">
                  <img
                    src={getImageUrl(course.thumbnail_url)}
                    alt={course.title}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              )}

              {/* Course Header */}
              <div className="bg-linear-to-r from-[#003D7A] to-[#0066CC] p-6 text-white">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-bold text-xl flex-1">{course.title}</h5>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.is_active
                        ? "bg-green-400 text-green-900"
                        : "bg-red-400 text-red-900"
                    }`}
                  >
                    {course.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-white/90 text-sm line-clamp-2 mb-3">
                  {course.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#FF6B35] font-bold text-2xl bg-white px-3 py-1 rounded-lg">
                    ₹{course.price}
                  </span>
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Course Details */}
              <div className="p-5 flex-1 bg-gray-50">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#FF6B35]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600">
                      Duration:{" "}
                      <span className="font-semibold text-gray-800">
                        {course.duration}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#FF6B35]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    <span className="text-gray-600">
                      Category:{" "}
                      <span className="font-semibold text-gray-800">
                        {course.category}
                      </span>
                    </span>
                  </div>
                  {course.icon && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-[#FF6B35]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-600">
                        Icon:{" "}
                        <span className="font-semibold text-gray-800">
                          {course.icon}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="p-4 bg-white border-t border-gray-200 flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStatus(course.id, !course.is_active);
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    course.is_active
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {course.is_active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCourse(course);
                  }}
                  className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCourse(course.id);
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg
            className="w-20 h-20 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="text-gray-500 text-lg font-medium">
            {searchTerm
              ? `No courses found for "${searchTerm}"`
              : "No courses created yet."}
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.total > pagination.limit && (
        <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-5 py-2.5 bg-[#003D7A] text-white rounded-lg hover:bg-[#002855] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-5 py-2.5 bg-[#003D7A] text-white rounded-lg hover:bg-[#002855] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
