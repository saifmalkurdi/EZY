import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAchievements } from "../../store/slices/achievementSlice";
import GroupAch from "../../assets/illustrations/GroupAch.png";
import studentsIcon from "../../assets/icons/studentIcon.svg";
import bookIcon from "../../assets/icons/bookIcon.svg";
import dots3 from "../../assets/illustrations/dots3.svg";

export default function AchievementsSection() {
  const dispatch = useDispatch();
  const { achievements, loading, error } = useSelector(
    (state) => state.achievements
  );

  useEffect(() => {
    dispatch(fetchAchievements({ is_active: true }));
  }, [dispatch]);

  if (loading) {
    return (
      <section className="py-8 md:py-12 lg:py-16 ">
        <div className="text-center">Loading achievements...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 md:py-12 lg:py-16">
        <div className="text-center text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-10 md:mb-12 lg:mb-16">
          <span className="text-[#003D7A]">Our</span>{" "}
          <span className="text-[#FF6B35]">Achievements</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Left side - Illustration */}
          <div className="flex justify-center">
            <img
              src={GroupAch}
              alt="Achievements"
              className="max-w-full h-auto w-full md:w-auto max-h-[300px] md:max-h-none"
            />
          </div>

          {/* Right side - Stats Cards */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 relative overflow-visible">
            {/* Students Trained */}
            {achievements[0] && (
              <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg flex flex-col items-center justify-center h-32 md:h-40">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#FF6B35] mb-1 md:mb-2">
                  {achievements[0].number}
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <img
                    src={studentsIcon}
                    alt="Students"
                    className="w-4 h-4 md:w-5 md:h-5 shrink-0"
                  />
                  <p className="text-xs md:text-sm text-gray-700 font-medium">
                    {achievements[0].label}
                  </p>
                </div>
              </div>
            )}

            {/* Courses Available */}
            {achievements[1] && (
              <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg flex flex-col items-center justify-center h-32 md:h-40">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#FF6B35] mb-1 md:mb-2">
                  {achievements[1].number}
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <img
                    src={bookIcon}
                    alt="Courses"
                    className="w-4 h-4 md:w-5 md:h-5 shrink-0"
                  />
                  <p className="text-xs md:text-sm text-gray-700 font-medium">
                    {achievements[1].label}
                  </p>
                </div>
              </div>
            )}

            {/* Students Secured Jobs - Spans 2 columns */}
            {achievements[2] && (
              <div className="col-span-2 bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center h-[110px] md:h-[140px] relative z-10 overflow-visible">
                <div className="flex items-center gap-4 md:gap-6 relative z-20">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#003D7A]">
                    {achievements[2].number}
                  </div>
                  <p className="text-xs md:text-sm text-gray-700 font-medium max-w-[180px] md:max-w-[200px]">
                    {achievements[2].label}
                  </p>
                </div>
              </div>
            )}

            {/* Dots background - Hidden on mobile */}
            <img
              src={dots3}
              alt=""
              className="absolute -right-20 md:-right-25 -bottom-25 md:-bottom-30 w-48 md:w-60 h-48 md:h-60 pointer-events-none z-0 hidden sm:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
