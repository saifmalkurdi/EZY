import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../store/slices/categorySlice";
import { fetchCourses } from "../../store/slices/courseSlice";
import womenPhoto from "../../assets/illustrations/women.svg";

export default function HeroSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading } = useSelector((state) => state.categories);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategories({ is_active: true }));
  }, [dispatch]);

  const handleSearchInput = (value) => {
    setSearchQuery(value);
    setSearchError("");

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (value.trim()) {
      searchTimerRef.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const result = await dispatch(
            fetchCourses({ is_active: true, search: value.trim() })
          );
          if (fetchCourses.fulfilled.match(result)) {
            setSearchResults(result.payload.data || result.payload || []);
          }
        } catch (error) {
          console.error("Search error:", error);
        }
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearch = async () => {
    setSearchError("");

    if (!searchQuery.trim()) {
      setSearchError("Please enter a course name");
      return;
    }

    // Cancel any pending search
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    setIsSearching(true);
    try {
      const result = await dispatch(
        fetchCourses({ is_active: true, search: searchQuery.trim() })
      );

      if (fetchCourses.fulfilled.match(result)) {
        const courses = result.payload.data || result.payload || [];

        if (courses.length > 0) {
          window.scrollTo(0, 0);
          navigate(`/course/${courses[0].id}`);
          setSearchQuery("");
          setSearchResults([]);
        } else {
          setSearchError("No courses found matching your search");
        }
      } else {
        setSearchError("Search failed. Please try again");
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("Search failed. Please try again");
    }
    setIsSearching(false);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-28 md:pt-32 lg:pt-40 pb-8 md:pb-12 lg:pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
      <div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#003D7A] leading-tight mb-4 md:mb-5 lg:mb-6">
          Skill Your Way Up To Success With Us
        </h1>
        <p className="text-gray-600 mb-6 md:mb-7 lg:mb-8 text-sm md:text-base">
          Get the skills you need for the Future of work.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-4 md:mb-5 lg:mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search the course you want"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 bg-[#F2F4F8] focus:outline-none rounded-xl md:rounded-2xl text-sm md:text-base"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-[#003D7A] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {searchError && !isSearching && (
              <p className="text-red-500 text-xs md:text-sm mt-1 ml-1">
                {searchError}
              </p>
            )}
            {searchQuery &&
              searchResults.length > 0 &&
              !searchError &&
              !isSearching && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.slice(0, 5).map((course) => (
                    <button
                      key={course.id}
                      onClick={() => {
                        window.scrollTo(0, 0);
                        navigate(`/course/${course.id}`);
                        setSearchQuery("");
                        setSearchResults([]);
                        setSearchError("");
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <p className="font-medium text-sm text-[#003D7A]">
                        {course.title}
                      </p>
                      {course.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                          {course.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="h-[50px] sm:h-[58px] md:h-[74px] bg-[#003D7A] text-white px-6 md:px-8 lg:p-6 rounded-xl hover:bg-[#002d5c] transition-colors text-sm md:text-base font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3">
          {!loading &&
            categories.map((cat, index) => (
              <button
                key={cat.id}
                className={`${index === 0 ? cat.color : "bg-[#F2F4F8]"} ${
                  index === 0 && cat.color === "bg-white"
                    ? "text-[#B9B5B2]"
                    : index === 0
                    ? "text-white"
                    : "text-gray-700"
                } px-3 md:px-4 lg:px-5 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer`}
              >
                {cat.name}
              </button>
            ))}
        </div>
      </div>

      <div className="relative flex justify-center items-center min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
        {/* Blue circle background - behind student - Scaled for mobile */}
        <div className="absolute w-[280px] h-[280px] md:w-[350px] md:h-[350px] lg:w-[420px] lg:h-[420px] bg-[#003D7A] rounded-full left-[120px] md:left-[150px] lg:left-[180px] top-1/2 -translate-y-1/2 z-0"></div>

        {/* Orange circle ring - top right - Hidden on mobile */}
        <div className="absolute w-[280px] h-[280px] md:w-[320px] md:h-80 lg:w-[380px] lg:h-[380px] border-40 md:border-50 lg:border-60 border-[#FF914C] rounded-full right-5 md:right-[25px] lg:right-[30px] top-[-30px] md:-top-10 lg:top-[-50px] z-0 hidden sm:block"></div>

        {/* Best Seller Card - Left Side - Hidden on mobile, adjusted on tablet */}
        <div className="absolute w-[125px] left-2 md:left-5 top-[350px] md:top-[420px] lg:top-[450px] -translate-y-1/2 z-20 hidden md:block">
          <div className="bg-[#FF914C] text-white px-4 md:px-6 py-1.5 md:py-2 rounded-lg font-semibold text-xs md:text-sm mb-4 shadow-lg absolute -top-4 md:-top-5 -right-10 md:right-[-60px]">
            Best seller
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl p-4 md:p-5 space-y-3 md:space-y-4 w-[220px] md:w-[260px]">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-[#003D7A] w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-[#003D7A] text-sm md:text-base mb-1">
                  Data Analyst
                </h4>
                <div className="flex items-center gap-1 md:gap-1.5 text-xs text-gray-600">
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4 text-[#FF914C]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">2145 Reviews</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-[#FF914C] w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-[#003D7A] text-sm md:text-base mb-1">
                  Website Design
                </h4>
                <div className="flex items-center gap-1 md:gap-1.5 text-xs text-gray-600">
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4 text-[#FF914C]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">2145 Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Student Image with blue border frame */}
        <div className="relative">
          <div className="relative w-[300px] h-[380px] md:w-[380px] md:h-[480px] lg:w-[450px] lg:h-[550px] top-5 md:top-[25px] lg:top-[30px] left-10 md:left-[55px] lg:left-[70px]">
            <img
              src={womenPhoto}
              alt="Student Learning"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
