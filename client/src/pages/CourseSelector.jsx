import { useState } from "react";
import { useNavigate } from "react-router-dom";
import courseSelector from "../assets/images/courseSelector.svg";
import Button from "../components/Button";
import dots4 from "../assets/illustrations/dots4.svg";
import arrows from "../assets/illustrations/arrows.svg";
import plus from "../assets/illustrations/plus.svg";

function CourseSelector() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFlow, setShowFlow] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    status: "",
    helpType: "",
    field: "",
    preference: "",
    language: "",
  });

  const steps = [
    {
      number: 1,
      question: "Welcome Friend! Let us know your current status?",
      options: [
        { value: "student", label: "I am a Student", icon: "🎓" },
        { value: "fresher", label: "I am a Fresher", icon: "👔" },
        { value: "professional", label: "I want to switch", icon: "🔄" },
      ],
    },
    {
      number: 2,
      question: "Great! Let me help you",
      options: [
        {
          value: "discover",
          label: "Discover Course",
          button: true,
          variant: "primary",
        },
        {
          value: "suggest",
          label: "Suggest Course",
          button: true,
          variant: "outline",
        },
      ],
    },
    {
      number: 3,
      question: "Select the field you're interested",
      options: [
        { value: "it", label: "IT field", button: true, variant: "primary" },
        {
          value: "non-it",
          label: "Non IT field",
          button: true,
          variant: "outline",
        },
      ],
    },
    {
      number: 4,
      question: "If fixed, then what do you prefer now?",
      options: [
        { value: "coding", label: "Coding", icon: "💻" },
        { value: "testing", label: "My choice", icon: "🎯" },
      ],
    },
    {
      number: 5,
      question: "Wow, you chose coding. What's next?",
      options: [
        { value: "frontend", label: "Frontend", icon: "🎨" },
        { value: "backend", label: "Backend", icon: "⚙️" },
        { value: "fullstack", label: "Fullstack", icon: "📱" },
      ],
    },
    {
      number: 6,
      question: "Excellent! Click here to get info",
      final: true,
    },
  ];

  const handleAnswer = (key, value) => {
    setAnswers({ ...answers, [key]: value });
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStartFlow = (option) => {
    if (option === "discover") {
      window.scrollTo(0, 0);
      navigate("/courses");
    } else {
      setSelectedOption(option);
      setShowFlow(true);
    }
  };

  // Show initial selection screen
  if (!showFlow) {
    return (
      <div className="bg-linear-to-b from-white to-gray-50 min-h-screen pt-24 md:pt-28 lg:pt-36 pb-8 md:pb-12 lg:pb-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 md:mb-12 lg:mb-16">
            <span className="text-[#003D7A]">Choose The</span>{" "}
            <span className="text-[#F2831F]">Course</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left Side - Selection Card */}
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-8 md:p-10 lg:p-12 w-full max-w-[450px]">
                <h2 className="text-xl md:text-2xl font-bold text-[#000000] mb-8 md:mb-10 lg:mb-12 text-center">
                  Ok, let me help you
                </h2>

                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {/* Discover Course Button */}
                  <button
                    onClick={() => handleStartFlow("discover")}
                    className={`rounded-2xl md:rounded-3xl h-[280px] md:h-80 lg:h-[371px] p-6 md:p-8 text-center font-bold text-base md:text-lg transition-all cursor-pointer ${
                      selectedOption === "discover"
                        ? "bg-[#F2831F] text-white scale-105 shadow-xl"
                        : "bg-[#F2831F] text-white hover:scale-105"
                    }`}
                  >
                    Discover
                    <br />
                    Course
                  </button>

                  {/* Suggest Course Button */}
                  <button
                    onClick={() => handleStartFlow("suggest")}
                    className={`rounded-2xl md:rounded-3xl p-6 md:p-8 text-center font-bold text-base md:text-lg transition-all cursor-pointer ${
                      selectedOption === "suggest"
                        ? "bg-white text-[#2048AB] border-4 border-[#2048AB] scale-105 shadow-xl"
                        : "bg-white text-[#2048AB] border-4 border-[#2048AB] hover:scale-105"
                    }`}
                  >
                    Suggest
                    <br />
                    Course
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="flex justify-center items-center">
              <div className="relative">
                <img
                  src={courseSelector}
                  alt="Course Selection"
                  className="w-full max-w-[400px] md:max-w-[500px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show multi-step flow
  return (
    <div className="bg-linear-to-b from-white to-gray-50 min-h-screen pt-24 md:pt-28 lg:pt-36 pb-8 md:pb-12 lg:pb-16 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 md:mb-12 lg:mb-16">
          <span className="text-[#003D7A]">Choose The</span>{" "}
          <span className="text-[#FF6B35]">Course</span>
        </h1>

        <div className="flex justify-center items-start gap-4 md:gap-6 lg:gap-8 relative">
          {/* Left decorative images - positioned to follow conversation - Hidden on mobile */}
          <div className="hidden lg:flex flex-col gap-32 pt-32 sticky top-32">
            <img
              src={dots4}
              alt="Decorative Dots"
              className="w-12 lg:w-16 h-16 lg:h-20"
            />
            <img
              src={arrows}
              alt="Decorative Arrows"
              className="w-12 lg:w-16 h-16 lg:h-20"
            />
          </div>

          {/* Wrapper for Main Flow Container and Circle */}
          <div className="relative">
            {/* Main Flow Container */}
            <div className="bg-[#003D7A] rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-12 w-full max-w-[500px] shadow-2xl relative z-10">
              {/* Progress Steps */}
              <div className="space-y-6 md:space-y-8">
                {steps.slice(0, currentStep).map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Step Number Badge */}
                    <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="bg-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shrink-0 font-bold text-[#003D7A] text-sm md:text-base">
                        {step.number}
                      </div>
                      <div className="bg-white rounded-xl md:rounded-2xl px-4 md:px-6 py-2 md:py-3 flex-1">
                        <p className="font-semibold text-[#003D7A] text-sm md:text-base">
                          {step.question}
                        </p>
                      </div>
                    </div>

                    {/* Options */}
                    {step.options && idx === currentStep - 1 && !step.final && (
                      <div className="ml-12 md:ml-16 space-y-3">
                        {step.options[0].button ? (
                          <div className="flex flex-col sm:flex-row gap-3">
                            {step.options.map((opt, i) => (
                              <button
                                key={i}
                                onClick={() =>
                                  handleAnswer(
                                    Object.keys(answers)[currentStep - 1],
                                    opt.value
                                  )
                                }
                                className={`flex-1 py-2.5 md:py-3 px-4 md:px-6 rounded-lg font-semibold transition-all text-sm md:text-base cursor-pointer ${
                                  opt.variant === "primary"
                                    ? "bg-[#FF6B35] text-white hover:bg-[#e55a2a]"
                                    : "bg-white text-[#003D7A] hover:bg-gray-100"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                            {step.options.map((opt, i) => (
                              <button
                                key={i}
                                onClick={() =>
                                  handleAnswer(
                                    Object.keys(answers)[currentStep - 1],
                                    opt.value
                                  )
                                }
                                className="bg-white rounded-xl p-4 md:p-6 text-center hover:scale-105 transition-transform cursor-pointer"
                              >
                                <div className="text-2xl md:text-3xl mb-2">
                                  {opt.icon}
                                </div>
                                <p className="text-xs font-semibold text-[#003D7A]">
                                  {opt.label}
                                </p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Final Step Button */}
                    {step.final && idx === currentStep - 1 && (
                      <div className="ml-12 md:ml-16">
                        <Button
                          variant="primary"
                          className="px-6 md:px-8 text-sm md:text-base"
                          onClick={() =>
                            alert("Course information will be displayed!")
                          }
                        >
                          Get Info
                        </Button>
                      </div>
                    )}

                    {/* Answered - Show selected answer */}
                    {idx < currentStep - 1 && step.options && (
                      <div className="ml-12 md:ml-16 text-white text-xs md:text-sm">
                        ✓ Selected:{" "}
                        {
                          step.options.find(
                            (o) => o.value === Object.values(answers)[idx]
                          )?.label
                        }
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative circle - positioned relative to wrapper, behind the box - Hidden on mobile */}
            <div className="absolute -bottom-10 -right-16 w-24 h-24 md:w-32 md:h-32 border-12 md:border-16 border-[#FF6B35] rounded-full z-0 hidden sm:block"></div>
          </div>

          {/* Right decorative images - positioned to follow conversation - Hidden on mobile */}
          <div className="hidden lg:flex flex-col gap-32 pt-32 sticky top-52">
            <img
              src={arrows}
              alt="Decorative Plus"
              className="w-12 lg:w-16 h-16 lg:h-20"
            />
            <img
              src={plus}
              alt="Decorative Plus"
              className="w-12 lg:w-16 h-16 lg:h-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseSelector;
