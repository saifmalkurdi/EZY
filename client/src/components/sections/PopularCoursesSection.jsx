import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../Button";
import CourseCard from "../CourseCard";
import { fetchCourses } from "../../store/slices/courseSlice";

export default function PopularCoursesSection() {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses({ is_active: true }));
  }, [dispatch]);

  if (loading) {
    return (
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="text-center">Loading courses...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="text-center text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
      <h2 className="text-3xl md:text-4xl lg:text-[53px] font-bold text-center mb-8 md:mb-10 lg:mb-12">
        <span className="text-[#003F7D]">Popular</span>{" "}
        <span className="text-[#F98149]">Courses</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="secondary"
          className="px-6 md:px-8 h-auto py-2 md:py-2.5 text-sm md:text-base"
        >
          <Link to="/courses" onClick={() => window.scrollTo(0, 0)}>
            View All Courses
          </Link>
        </Button>
      </div>
    </section>
  );
}
