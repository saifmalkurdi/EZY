import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { purchaseCourse } from "../store/slices/purchaseSlice";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";
import CloudDownloadIcon from "./icons/CloudDownloadIcon";
import MonitorIcon from "./icons/MonitorIcon";
import PinIcon from "./icons/PinIcon";
import CourseEnquiryModal from "./CourseEnquiryModal";
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

function CourseCard({ course }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading: purchasing } = useSelector((state) => state.purchase);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleViewDetails = () => {
    window.scrollTo(0, 0);
    navigate(`/course/${course.id}`);
  };

  const handleDownloadCurriculum = (e) => {
    e.stopPropagation();
    setShowEnquiryModal(true);
  };

  const handleEnrollNow = async (e) => {
    e.stopPropagation();

    if (!user) {
      showToast("Please login to enroll in this course", "error");
      navigate("/login");
      return;
    }

    if (user.role !== "customer") {
      showToast("Only customers can purchase courses", "error");
      return;
    }

    if (confirm(`Confirm enrollment in ${course.title}?`)) {
      try {
        const result = await dispatch(purchaseCourse(course.id));
        if (purchaseCourse.fulfilled.match(result)) {
          showToast(
            "Enrollment request submitted! Check your dashboard for status.",
            "success"
          );
          navigate("/dashboard");
        } else {
          showToast(
            result.payload || "Failed to submit enrollment request",
            "error"
          );
        }
      } catch (error) {
        showToast("Failed to submit enrollment request", "error");
      }
    }
  };

  // Get the logo from the mapping or use thumbnail_url
  const getImageUrl = (url) => {
    if (!url) return null;

    // If it's already a full URL, return as-is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // If it's a relative path, prepend the server base URL (not API URL)
    if (url.startsWith("/uploads/")) {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const serverUrl = apiUrl.replace("/api", ""); // Remove /api to get base server URL
      return `${serverUrl}${url}`;
    }

    return url;
  };

  const courseLogo = course.thumbnail_url
    ? getImageUrl(course.thumbnail_url)
    : course.icon
    ? courseLogos[course.icon]
    : null;

  return (
    <>
      <div
        className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow  cursor-pointer bg-[#003D7A]"
        onClick={handleViewDetails}
      >
        {/* Course Icon/Logo Background */}
        <div className="bg-[#003D7A] h-44 flex items-center justify-center p-8">
          {courseLogo ? (
            <img
              src={courseLogo}
              alt={course.title}
              className="w-28 h-28 object-contain"
            />
          ) : (
            <svg
              className="w-28 h-28 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>

        {/* Course Content - White Card Overlapping */}
        <div className="bg-white mx-3 mb-3 p-5 rounded-2xl">
          <h3 className="font-bold text-lg text-black mb-2 text-center">
            {course.title}
          </h3>
          <p className="text-xs text-gray-600 mb-4 text-center leading-relaxed min-h-[45px]">
            {course.description}
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center gap-2 mb-3">
            <button
              className="flex items-center gap-1 px-3 py-1.5 border border-[#FF6B35] rounded text-xs font-normal text-[#FF6B35] hover:bg-orange-50 transition-colors cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <MonitorIcon className="w-4 h-4" />
              Live Demo
            </button>
            <button
              className="flex items-center gap-1 px-3 py-1.5 border border-[#FF6B35] rounded text-xs font-normal text-[#FF6B35] hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              onClick={handleEnrollNow}
              disabled={purchasing}
            >
              <PinIcon className="w-4 h-4" />
              {purchasing ? "Processing..." : "Enroll Now"}
            </button>
          </div>

          {/* Download Curriculum Button */}
          <button
            className="w-full bg-[#FF6B35] text-white py-2.5 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#e55a2a] transition-colors cursor-pointer"
            onClick={handleDownloadCurriculum}
          >
            <CloudDownloadIcon />
            Download Curriculum
          </button>
        </div>
      </div>

      {showEnquiryModal && (
        <CourseEnquiryModal
          course={course}
          onClose={() => setShowEnquiryModal(false)}
        />
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.isOpen}
        onClose={hideToast}
      />
    </>
  );
}

export default memo(CourseCard);
