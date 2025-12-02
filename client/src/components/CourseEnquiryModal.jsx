import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import SuccessModal from "./SuccessModal";
import { getImageUrl } from "../utils/imageUtils";

// Import course logos
import angularLogo from "../assets/logos/angular.svg";
import awsLogo from "../assets/logos/aws.svg";
import coreuiLogo from "../assets/logos/coreui.svg";
import powerBiLogo from "../assets/logos/powerBi.svg";
import pythonLogo from "../assets/logos/python.svg";
import reactLogo from "../assets/logos/react.svg";
import testingLogo from "../assets/logos/testing.svg";
import vueLogo from "../assets/logos/vue.svg";

const courseLogos = {
  "angular.svg": angularLogo,
  "aws.svg": awsLogo,
  "coreui.svg": coreuiLogo,
  "powerBi.svg": powerBiLogo,
  "python.svg": pythonLogo,
  "react.svg": reactLogo,
  "testing.svg": testingLogo,
  "vue.svg": vueLogo,
};

function CourseEnquiryModal({ course, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    countryCode: "+91",
    agreeToPrivacy: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const courseTitle = course?.title || "Angular JS";
  const courseLogo = course?.thumbnail_url
    ? getImageUrl(course.thumbnail_url)
    : course?.icon && courseLogos[course.icon]
    ? courseLogos[course.icon]
    : "/angular-icon.svg";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setFormData({
      name: "",
      email: "",
      mobile: "",
      countryCode: "+91",
      agreeToPrivacy: false,
    });
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 5000);
  };

  // Check if all required fields are filled
  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.mobile.trim() !== "" &&
    formData.agreeToPrivacy;

  return (
    <>
      <Modal isOpen={true} onClose={onClose} className="max-w-md">
        {/* Header */}
        <div className="bg-[#003D7A] rounded-t-2xl p-8 text-center relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Course Logo */}
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <img
              src={courseLogo}
              alt={courseTitle}
              className="w-14 h-14 object-contain"
            />
          </div>

          {/* Course Title */}
          <h2 className="text-2xl font-bold text-white">{courseTitle}</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Name Field */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-[#003D7A] mb-2">
              Your name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B35] transition-colors"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Field */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-[#003D7A] mb-2">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B35] transition-colors"
              placeholder="Enter your email"
            />
          </div>

          {/* Mobile Number Field */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-[#003D7A] mb-2">
              Mobile Number<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B35] transition-colors bg-white"
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+971">+971</option>
              </select>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B35] transition-colors"
                placeholder="Enter mobile number"
              />
            </div>
          </div>

          {/* Privacy Policy Checkbox */}
          <div className="mb-6">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="agreeToPrivacy"
                checked={formData.agreeToPrivacy}
                onChange={handleChange}
                required
                className="mt-1 w-4 h-4 text-[#FF6B35] border-gray-300 rounded focus:ring-[#FF6B35] cursor-pointer"
              />
              <span className="text-xs text-gray-600 leading-tight">
                By providing your contact details, you agree to our{" "}
                <a
                  href="/privacy"
                  className="text-[#FF6B35] hover:underline cursor-pointer"
                >
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full py-4"
            disabled={!isFormValid}
          >
            Download Now
          </Button>
        </form>
      </Modal>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
      />
    </>
  );
}

export default CourseEnquiryModal;
