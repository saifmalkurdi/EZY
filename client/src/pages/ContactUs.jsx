import { useState } from "react";
import dots5 from "../assets/illustrations/dots5.svg";
import mail from "../assets/images/mail.png";
import callCenter from "../assets/images/callCenter.png";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    issue: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Navbar integrated */}
      <div className="bg-[#F98149] relative overflow-hidden pb-8 md:pb-10 lg:pb-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-14 lg:pb-16 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Contact Our Team
          </h1>
        </div>
      </div>

      {/* Contact Form Content */}
      <div className="max-w-[900px] mx-auto px-4 md:px-6 lg:px-8 -mt-6 md:-mt-8 pb-16 md:pb-24 lg:pb-32 relative">
        {/* Decorative Dots - Left - Hidden on mobile */}
        <div className="absolute -left-2 top-65 hidden md:block">
          <img src={dots5} alt="" className="w-10 md:w-12 h-auto opacity-80" />
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 lg:p-10 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Your name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Wilson"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F98149] focus:border-transparent text-sm md:text-base"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Contact email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F98149] focus:border-transparent text-sm md:text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {/* Phone Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Company name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F98149] focus:border-transparent text-sm md:text-base"
                />
              </div>

              {/* Issue Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Issue Related to*
                </label>
                <select
                  name="issue"
                  value={formData.issue}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F98149] focus:border-transparent bg-white appearance-none text-sm md:text-base"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="">Course Structure</option>
                  <option value="course-structure">Course Structure</option>
                  <option value="payment-failure">Payment Failure</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Your message*
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message..."
                required
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F98149] focus:border-transparent resize-none text-sm md:text-base"
              ></textarea>
            </div>

            {/* Privacy Notice */}
            <p className="text-xs text-gray-500 leading-relaxed">
              By submitting this form you agree to our{" "}
              <a
                href="#"
                className="text-[#F98149] hover:underline cursor-pointer"
              >
                terms and conditions
              </a>{" "}
              and our{" "}
              <a
                href="#"
                className="text-[#F98149] hover:underline cursor-pointer"
              >
                Privacy Policy
              </a>{" "}
              which explains how we may collect, use and disclose your personal
              information including to third parties.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#003B5C] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-medium hover:bg-[#002A42] transition-colors text-sm md:text-base"
            >
              Send
            </button>
          </form>
        </div>

        {/* Decorative Circle - Bottom Right - Hidden on mobile */}
        <div className="absolute -right-20 bottom-0 w-72 h-72 rounded-full hidden lg:block">
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

      {/* Contact Info Section */}
      <div className="py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Email Us */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img
                src={mail}
                alt="Email"
                className="w-16 h-16 md:w-20 md:h-20"
              />
            </div>
            <h3 className="text-[#F98149] font-bold text-base md:text-lg mb-2">
              Email us
            </h3>
            <p className="text-gray-600 text-xs md:text-sm mb-3 px-4">
              Email us for general queries, including marketing and partnership
              opportunities.
            </p>
            <a
              href="mailto:hello@ezyskills.com"
              className="text-[#003B5C] font-semibold hover:underline text-sm md:text-base"
            >
              hello@ezyskills.com
            </a>
          </div>

          {/* Call Us */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img
                src={callCenter}
                alt="Call Center"
                className="w-16 h-16 md:w-20 md:h-20"
              />
            </div>
            <h3 className="text-[#F98149] font-bold text-base md:text-lg mb-2">
              Call us
            </h3>
            <p className="text-gray-600 text-xs md:text-sm mb-3 px-4">
              Call us to speak to a member of our team. We are always happy to
              help.
            </p>
            <a
              href="tel:+918688838888"
              className="text-[#003B5C] font-semibold hover:underline text-sm md:text-base"
            >
              +91 86888 38888
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
