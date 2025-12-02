import React from "react";
import { useNavigate } from "react-router-dom";

const ManagementCards = ({ user, onOpenPlanModal, onOpenTeacherModal }) => {
  const navigate = useNavigate();

  const handleViewPricingPage = () => {
    navigate("/pricing");
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
        {/* Plan Management - Admin Only */}
        {user?.role === "admin" && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="text-xl font-bold text-[#FF6B35] mb-2">
              Manage Plans
            </h4>
            <p className="text-gray-600 mb-4">
              Add, edit, or remove plans for users.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onOpenPlanModal}
                className="px-6 py-3 rounded-lg font-semibold text-[15px] transition-all duration-300 inline-flex items-center justify-center text-center bg-orange-500 text-white border-2 border-orange-500 hover:bg-orange-600 hover:border-orange-600 w-[183px] cursor-pointer"
              >
                Add New Plan
              </button>
              <button
                type="button"
                onClick={handleViewPricingPage}
                className="px-6 py-3 rounded-lg font-semibold text-[15px] transition-all duration-300 inline-flex items-center justify-center text-center bg-white text-orange-500 border-2 border-orange-500 hover:bg-orange-50 w-[183px] cursor-pointer"
              >
                View Pricing Page
              </button>
            </div>
          </div>
        )}
        {/* Teacher Management - Admin Only */}
        {user?.role === "admin" && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="text-xl font-bold text-[#FF6B35] mb-2">
              Create Teachers
            </h4>
            <p className="text-gray-600 mb-4">
              Add new teachers to the platform.
            </p>
            <button
              type="button"
              onClick={onOpenTeacherModal}
              className="px-6 py-3 rounded-lg font-semibold text-[15px] transition-all duration-300 inline-flex items-center justify-center text-center bg-orange-500 text-white border-2 border-orange-500 hover:bg-orange-600 hover:border-orange-600 w-[183px] cursor-pointer"
            >
              Add New Teacher
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementCards;
