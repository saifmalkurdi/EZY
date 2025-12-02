import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CourseCard from "../components/CourseCard";
import { fetchCourses } from "../store/slices/courseSlice";

function Courses() {
  const dispatch = useDispatch();
  const { courses, total, loading, error } = useSelector(
    (state) => state.courses
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const selectedCategory = "All";
  const [selectedSort, setSelectedSort] = useState("Coaching Based");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;
  const searchTimerRef = useRef(null);

  const categories = ["All", "Opened", "Comming soon", "Archived"];
  const sortOptions = ["Sort by: Popular Class"];

  useEffect(() => {
    const offset = (currentPage - 1) * coursesPerPage;
    dispatch(
      fetchCourses({
        is_active: true,
        search: searchQuery,
        limit: coursesPerPage,
        offset: offset,
      })
    );
  }, [dispatch, searchQuery, currentPage]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      setSearchQuery(value);
      setCurrentPage(1); // Reset to first page when search changes
    }, 1000);
  };

  const totalPages = Math.ceil(total / coursesPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-24 md:pt-28 lg:pt-32">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <div className="text-center">Loading courses...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen pt-24 md:pt-28 lg:pt-32">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 md:pt-28 lg:pt-32">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-10 lg:mb-12">
          Courses <span className="text-[#FF6B35]">List</span>
        </h1>

        {/* Filters Section */}
        <div className=" p-4 md:p-6 mb-8 md:mb-10 lg:mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Search - Left */}
            <div className="flex items-center gap-3 rounded-[10px] px-4 py-2.5 md:py-2 w-full md:w-auto md:min-w-[250px] bg-[#F1F1F5] text-sm">
              <svg
                className="w-5 h-5 text-gray-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search for Courses here"
                value={searchInput}
                onChange={handleSearchChange}
                className="flex-1 outline-none  px-3 py-2"
              />
            </div>

            {/* Category Filters - Middle */}
            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 md:flex-1 md:justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {}}
                  className={`px-4 md:px-5 py-2 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? "text-[#FF6B35] border-b-2 border-[#FF6B35]"
                      : "text-gray-700 hover:text-[#FF6B35]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown - Right */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200 outline-none cursor-pointer w-full md:w-auto"
            >
              {sortOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10 lg:mb-12">
          {courses.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12 text-lg font-medium">
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : "No courses available."}
            </div>
          ) : (
            courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          )}
        </div>

        {/* Pagination */}
        {courses.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mb-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={!hasPrevPage}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                hasPrevPage
                  ? "bg-[#FF6B35] text-white hover:bg-[#e55a2a] cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {currentPage > 2 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors bg-transparent text-[#FF6B35] border-2 border-[#FF6B35] hover:bg-orange-50 cursor-pointer"
                  >
                    1
                  </button>
                  {currentPage > 3 && (
                    <span className="text-gray-400">...</span>
                  )}
                </>
              )}

              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors bg-transparent text-[#FF6B35] border-2 border-[#FF6B35] hover:bg-orange-50 cursor-pointer"
                >
                  {currentPage - 1}
                </button>
              )}

              <button className="w-10 h-10 rounded-lg flex items-center justify-center font-medium bg-[#FF6B35] text-white border-2 border-[#FF6B35]">
                {currentPage}
              </button>

              {hasNextPage && (
                <>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors bg-transparent text-[#FF6B35] border-2 border-[#FF6B35] hover:bg-orange-50 cursor-pointer"
                  >
                    {currentPage + 1}
                  </button>
                  <span className="text-gray-400">...</span>
                </>
              )}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!hasNextPage}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                hasNextPage
                  ? "bg-[#FF6B35] text-white hover:bg-[#e55a2a] cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
