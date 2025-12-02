import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrainers } from "../../store/slices/trainerSlice";
import { getImageUrl } from "../../utils/imageUtils";
import person1 from "../../assets/images/person1.svg";
import person2 from "../../assets/images/person2.svg";
import person3 from "../../assets/images/person3.svg";

export default function TrainersSection() {
  const dispatch = useDispatch();
  const { trainers, loading, error } = useSelector((state) => state.trainers);

  const personImages = [person1, person2, person3];

  useEffect(() => {
    dispatch(fetchTrainers({ is_active: true }));
  }, [dispatch]);

  if (loading) {
    return (
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="text-center">Loading trainers...</div>
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
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16 relative">
      <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-[85px] leading-tight md:leading-[60px] lg:leading-[70px] xl:leading-[78px] tracking-[0px] font-bold text-left mb-10 md:mb-12 lg:mb-16">
        <span className="text-[#003F7D]">Meet Our Professional</span>
        <br />
        <span className="text-[#FF8B36]">Mentors & Trainers</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-10 lg:mt-12 relative">
        {/* Orange circle decoration - only visible portion behind first card - Hidden on mobile */}
        <div className="absolute -left-20 top-[200px] w-40 h-40 pointer-events-none hidden lg:block">
          <div className="w-full h-full border-14 border-[#FF8B36] rounded-full opacity-70"></div>
        </div>

        {trainers.map((trainer, idx) => (
          <div
            key={trainer.id}
            className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 hover:shadow-2xl shadow-lg transition-shadow relative"
          >
            {/* Best Trainer Badge - positioned absolutely at top center */}
            {idx === 0 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-[#FF8B36] text-white text-xs md:text-sm font-semibold px-4 md:px-6 py-1.5 md:py-2 rounded-lg flex items-center gap-2 whitespace-nowrap shadow-md">
                  <span>🏆</span>
                  BEST TRAINER
                </div>
              </div>
            )}

            {/* Content Layout: Image on Left, Info on Right */}
            <div className="flex gap-4 md:gap-6 mb-3 md:mb-4">
              {/* Profile Image */}
              <div className="shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src={
                      getImageUrl(trainer.profile_image) ||
                      personImages[idx % personImages.length]
                    }
                    alt={trainer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                {/* Name */}
                <h3 className="font-bold text-lg md:text-xl lg:text-2xl mb-1">
                  {trainer.name}
                </h3>

                {/* Title */}
                <p className="text-xs md:text-sm text-[#FF8B36] mb-2 md:mb-3">
                  {trainer.title}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                  <div className="flex text-yellow-400 text-sm md:text-base lg:text-lg">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(trainer.rating) ? "★" : "★"}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs md:text-sm text-gray-500">
                    {trainer.reviews} Reviews
                  </span>
                </div>

                {/* Modules and Students */}
                <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-[#FF8B36]">📚</span>
                    <span className="text-gray-700">
                      {trainer.modules} Modules
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[#FF8B36]">👥</span>
                    <span className="text-gray-700">
                      {trainer.students} Students
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              {trainer.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
