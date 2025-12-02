import skills from "../../assets/illustrations/skills.svg";
import skillsIcon1 from "../../assets/icons/skillsIcon1.svg";
import skillsIcon2 from "../../assets/icons/skillsIcon2.svg";
import skillsIcon3 from "../../assets/icons/skillsIcon3.svg";
import skillsIcon4 from "../../assets/icons/skillsIcon4.svg";

export default function SkillDevelopmentSection() {
  return (
    <section className="bg-white py-8 md:py-12 lg:py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Left Side - Text and Icons */}
          <div>
            <p className="text-[#F98149] uppercase tracking-[8px] md:tracking-[12px] lg:tracking-[14px] text-xs md:text-sm font-semibold mb-3 md:mb-4">
              WHO CAN JOIN
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#003D7A] leading-tight mb-8 md:mb-10 lg:mb-12">
              Skill Development
              <br />
              Schemes For All
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              {/* Card 01 */}
              <div className="flex items-start gap-3 md:gap-4">
                <span className="text-2xl md:text-3xl font-bold text-[#003F7D]">
                  01
                </span>
                <div className="flex-1">
                  <div className="mb-2 md:mb-3">
                    <img
                      src={skillsIcon1}
                      alt="Colleges"
                      className="w-12 h-12 md:w-14 md:h-14"
                    />
                  </div>
                  <h3 className="font-semibold text-[#303030] text-sm md:text-base">
                    Colleges/Universities
                  </h3>
                </div>
              </div>

              {/* Card 02 */}
              <div className="flex items-start gap-3 md:gap-4">
                <span className="text-2xl md:text-3xl font-bold text-[#003F7D]">
                  02
                </span>
                <div className="flex-1">
                  <div className="mb-2 md:mb-3">
                    <img
                      src={skillsIcon2}
                      alt="Professionals"
                      className="w-12 h-12 md:w-14 md:h-14"
                    />
                  </div>
                  <h3 className="font-semibold text-[#303030] text-sm md:text-base">
                    Individuals/Working
                    <br />
                    Professionals
                  </h3>
                </div>
              </div>

              {/* Card 03 */}
              <div className="flex items-start gap-3 md:gap-4">
                <span className="text-2xl md:text-3xl font-bold text-[#003F7D]">
                  03
                </span>
                <div className="flex-1">
                  <div className="mb-2 md:mb-3">
                    <img
                      src={skillsIcon3}
                      alt="Startups"
                      className="w-12 h-12 md:w-14 md:h-14"
                    />
                  </div>
                  <h3 className="font-semibold text-[#303030] text-sm md:text-base">
                    Startups
                  </h3>
                </div>
              </div>

              {/* Card 04 */}
              <div className="flex items-start gap-3 md:gap-4">
                <span className="text-2xl md:text-3xl font-bold text-[#003F7D]">
                  04
                </span>
                <div className="flex-1">
                  <div className="mb-2 md:mb-3">
                    <img
                      src={skillsIcon4}
                      alt="Corporates"
                      className="w-12 h-12 md:w-14 md:h-14"
                    />
                  </div>
                  <h3 className="font-semibold text-[#303030] text-sm md:text-base">
                    115.01 x 115
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="flex justify-center items-center">
            <img
              src={skills}
              alt="Skill Development"
              className="w-full max-w-[400px] md:max-w-[500px] lg:max-w-[550px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
