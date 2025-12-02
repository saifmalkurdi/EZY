import { useState } from "react";
import dots5 from "../assets/illustrations/dots5.svg";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Who is eligible for this program?",
      answer:
        "Any Original (Fresher/Re/Tech) final year, Passed outs, Individuals, Employees are eligible for this program.",
    },
    {
      question: "What is the duration of the program?",
      answer:
        "The program duration varies depending on the course selected. Typically, courses range from 3 to 6 months with flexible learning options.",
    },
    {
      question: "Do I get the assured placement?",
      answer:
        "We provide 100% placement assistance with our network of partner companies. While we cannot guarantee placement, we support you throughout your job search with interview preparation and career guidance.",
    },
    {
      question:
        "What is the basic academic percentage required to enroll for the course?",
      answer:
        "There is no minimum academic percentage required. We welcome all students who are passionate about learning and building their career in technology.",
    },
    {
      question: "What is the execution plan of the program?",
      answer:
        "The program includes live interactive sessions, hands-on projects, real-world scenarios, regular assessments, and personalized mentoring throughout the course duration.",
    },
    {
      question: "Can we take this course online?",
      answer:
        "Yes, all our courses are available in online mode with live instructor-led sessions. You can join from anywhere and learn at your own pace.",
    },
    {
      question: "I am already employed, will I be eligible for the program?",
      answer:
        "Absolutely! Our programs are designed for both freshers and working professionals. We offer flexible timings to accommodate your work schedule.",
    },
    {
      question: "What if I miss the session due to an emergency?",
      answer:
        "All sessions are recorded and will be available for you to watch later. You can also reach out to instructors for any clarifications on missed topics.",
    },
    {
      question: "Can we take this course online?",
      answer:
        "Yes, we offer both online and offline modes. Choose the one that best fits your learning style and schedule.",
    },
    {
      question: "Do you provide any certificate after the program?",
      answer:
        "Yes, upon successful completion of the program and final assessment, you will receive an industry-recognized certificate from EZY Skills.",
    },
    {
      question: "Have suggestions for us?",
      answer:
        "We'd love to hear from you! Please reach out to us through our Contact Us page or email us at info@ezyskills.in with your feedback and suggestions.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Navbar integrated */}
      <div className="bg-[#F98149] relative overflow-hidden pb-8 md:pb-10 lg:pb-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-14 lg:pb-16 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Frequently Asked Questions
          </h1>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-[900px] mx-auto px-4 md:px-6 lg:px-8 -mt-6 md:-mt-8 pb-16 md:pb-24 lg:pb-32 relative">
        {/* Decorative Dots - Left - Hidden on mobile */}
        <div className="absolute left-0 top-70 hidden md:block">
          <img src={dots5} alt="" className="w-10 md:w-12 h-auto" />
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 lg:p-10 space-y-1 relative z-10">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-start justify-between gap-3 md:gap-4 text-left py-4 md:py-5 hover:text-[#F98149] transition-colors group cursor-pointer"
              >
                <div className="flex items-start gap-2 md:gap-3 flex-1">
                  <span className="text-[#F98149] text-lg md:text-xl font-bold shrink-0">
                    {openIndex === index ? "−" : "+"}
                  </span>
                  <span
                    className={`font-medium text-sm md:text-[15px] transition-colors ${
                      openIndex === index
                        ? "text-[#F98149]"
                        : "text-gray-900 group-hover:text-[#F98149]"
                    }`}
                  >
                    {faq.question}
                  </span>
                </div>
              </button>

              {openIndex === index && (
                <div className="pl-8 md:pl-10 pr-4 md:pr-8 pb-5 md:pb-6 animate-slideDown">
                  <p className="text-gray-600 leading-relaxed text-sm md:text-[15px]">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Decorative Circle - Bottom Right - Hidden on mobile */}
        <div className="absolute -right-20 bottom-5 w-72 h-72 rounded-full hidden lg:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#F98149"
              strokeWidth="40"
            />
          </svg>
        </div>
      </div>

      {/* Move animation CSS to global or module CSS file */}
    </div>
  );
}

export default FAQ;
