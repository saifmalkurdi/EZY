import dots2 from "../../assets/illustrations/dots2.svg";
import jobSeeker from "../../assets/images/jobSeeker.png";
import employee from "../../assets/images/employee.png";

export default function HowItWorksSection() {
  return (
    <section className="py-16 relative">
      <div className="max-w-[1400px] mx-auto px-8 relative">
        {/* Decorative orange circle - positioned at top right with quarter hidden */}
        <div className="absolute w-[300px] h-[300px] border-40 border-[#FF914C] rounded-full right-[-75px] top-[-100px] z-0 opacity-80"></div>

        {/* Process Flow Container */}
        <div className="h-[550px] bg-[#003D7A] rounded-[40px] p-16 pt-0 relative overflow-visible shadow-2xl flex items-center justify-center">
          {/* Title Badge - positioned at top center of blue box */}
          <div className="flex justify-center absolute top-0 left-0 right-0 z-10">
            <div className="w-[450px] text-center bg-[#FF914C] text-white py-3.5 rounded-2xl font-bold text-lg shadow-lg -translate-y-1/2">
              How It Works
            </div>
          </div>

          {/* Decorative dots on blue background - Bottom Left (extends outside) */}
          <div className="absolute left-12 bottom-[-100px] z-0">
            <img src={dots2} alt="Decorative Dots" className="w-24" />
          </div>

          <div className="flex items-center justify-center gap-6 relative">
            {/* Job Seeker Card */}
            <div className="bg-white rounded-2xl p-3 text-center shadow-xl shrink-0 w-[180px]">
              <h4 className="font-bold text-[#FF914C] text-lg mb-3">
                Job Seeker
              </h4>
              <div className="w-40 h-40 mx-auto bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={jobSeeker}
                  alt="Job Seeker"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-[#FF8B36] text-3xl shrink-0 font-light">›</div>

            {/* Step 01 */}
            <div className="text-center text-white shrink-0 w-[90px]">
              <div className="text-sm font-bold mb-2">01</div>
              <div className="w-[70px] h-[70px] mx-auto mb-3 border-2 border-[#FF8B36] rounded-xl flex items-center justify-center bg-[#003D7A]">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-xs leading-tight font-medium">
                Aptitude Test
                <br />
                Interview
              </p>
            </div>

            <div className="text-[#FF8B36] text-3xl shrink-0 font-light">›</div>

            {/* Step 02 */}
            <div className="text-center text-white shrink-0 w-[90px]">
              <div className="text-sm font-bold mb-2">02</div>
              <div className="w-[70px] h-[70px] mx-auto mb-3 border-2 border-[#FF8B36] rounded-xl flex items-center justify-center bg-[#003D7A]">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <p className="text-xs leading-tight font-medium">
                Hands on Practise
                <br />
                Scenarios, Test
                <br />
                Cases
              </p>
            </div>

            <div className="text-[#FF8B36] text-3xl shrink-0 font-light">›</div>

            {/* Step 03 */}
            <div className="text-center text-white shrink-0 w-[90px]">
              <div className="text-sm font-bold mb-2">03</div>
              <div className="w-[70px] h-[70px] mx-auto mb-3 border-2 border-[#FF8B36] rounded-xl flex items-center justify-center bg-[#003D7A]">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-xs leading-tight font-medium">
                Soft Skills &<br />
                Business Training
              </p>
            </div>

            <div className="text-[#FF8B36] text-3xl shrink-0 font-light">›</div>

            {/* Step 04 */}
            <div className="text-center text-white shrink-0 w-[90px]">
              <div className="text-sm font-bold mb-2">04</div>
              <div className="w-[70px] h-[70px] mx-auto mb-3 border-2 border-[#FF8B36] rounded-xl flex items-center justify-center bg-[#003D7A]">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <p className="text-xs leading-tight font-medium">
                Daily, Weekly, Monthly
                <br />
                Assessments
              </p>
            </div>

            <div className="text-[#FF8B36] text-3xl shrink-0 font-light">›</div>

            {/* Step 05 */}
            <div className="text-center text-white shrink-0 w-[90px]">
              <div className="text-sm font-bold mb-2">05</div>
              <div className="w-[70px] h-[70px] mx-auto mb-3 border-2 border-[#FF8B36] rounded-xl flex items-center justify-center bg-[#003D7A]">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <p className="text-xs leading-tight font-medium">
                Real-Time Project
                <br />
                Based Training
              </p>
            </div>

            <div className="text-[#FF8B36] text-3xl shrink-0 font-light">›</div>

            {/* Step 06 */}
            <div className="text-center text-white shrink-0 w-[90px]">
              <div className="text-sm font-bold mb-2">06</div>
              <div className="w-[70px] h-[70px] mx-auto mb-3 border-2 border-[#FF8B36] rounded-xl flex items-center justify-center bg-[#003D7A]">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <p className="text-xs leading-tight font-medium">
                Assessment Guidance
                <br />& Mentoring
              </p>
            </div>

            <div className="text-[#FF8B36] text-3xl shrink-0 font-light">›</div>

            {/* Employed Card */}
            <div className="bg-white rounded-2xl p-3 text-center shadow-xl shrink-0 w-[180px]">
              <h4 className="font-bold text-[#FF6B35] text-lg mb-3">
                Employed
              </h4>
              <div className="w-40 h-40 mx-auto bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={employee}
                  alt="Employed"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
