import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PlansList = ({
  plans,
  onEditPlan,
  onDeletePlan,
  onToggleStatus,
  onSearch,
  searchTerm = "",
  pagination,
  onPageChange,
}) => {
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(searchTerm);

  const handleCardClick = () => {
    navigate("/pricing");
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearch);
    }
  };

  return (
    <div className="bg-white p-12 rounded-xl shadow-sm mb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h4 className="text-2xl font-bold text-[#003D7A]">Existing Plans</h4>
        {onSearch && (
          <form
            onSubmit={handleSearchSubmit}
            className="flex gap-2 w-full sm:w-auto"
          >
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search plans..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F98149] text-sm flex-1 sm:flex-initial sm:min-w-[250px]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#F98149] text-white rounded-lg hover:bg-[#e55a2a] text-sm font-medium"
            >
              Search
            </button>
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  onSearch("");
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-medium"
              >
                Clear
              </button>
            )}
          </form>
        )}
      </div>

      {plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={handleCardClick}
              className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 flex flex-col cursor-pointer ${
                plan.is_highlighted
                  ? "border-4 border-[#FF6B35] shadow-2xl scale-105"
                  : "border-2 border-gray-200 hover:shadow-xl"
              }`}
            >
              {/* Plan Header */}
              <div
                className={`p-4 text-white ${
                  plan.is_highlighted
                    ? "bg-linear-to-r from-[#FF6B35] to-[#FF8B55]"
                    : "bg-linear-to-r from-[#003D7A] to-[#0066CC]"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-bold text-lg flex-1">{plan.title}</h5>
                  {plan.is_highlighted && (
                    <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold">
                      ⭐ Popular
                    </span>
                  )}
                </div>
                <p className="text-white/90 text-xs mb-3 line-clamp-2">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">₹{plan.price}</span>
                  {plan.price_note && (
                    <span className="text-white/80 text-xs">
                      / {plan.price_note}
                    </span>
                  )}
                </div>
                {plan.gst_note && (
                  <p className="text-white/70 text-xs mt-1">{plan.gst_note}</p>
                )}
              </div>

              {/* Plan Features */}
              <div className="p-4 flex-1 bg-gray-50">
                <ul className="space-y-2">
                  {plan.features && plan.features.length > 0 ? (
                    plan.features.map((feature, index) => {
                      // Handle both string features and object features {icon, text}
                      const featureText =
                        typeof feature === "string"
                          ? feature
                          : feature.text || "";

                      return (
                        <li key={index} className="flex items-start gap-2">
                          <svg
                            className="w-4 h-4 text-green-500 shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-700 text-xs">
                            {featureText}
                          </span>
                        </li>
                      );
                    })
                  ) : (
                    <li className="text-gray-500 text-sm">
                      No features listed
                    </li>
                  )}
                </ul>
              </div>

              {/* Status Badge */}
              <div className="px-4 pb-3">
                <span
                  className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    plan.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {plan.is_active ? "✓ Active" : "✗ Inactive"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditPlan(plan);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-xs transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStatus(plan.id, plan.is_active);
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium text-xs transition-colors ${
                    plan.is_active
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                  title={plan.is_active ? "Deactivate plan" : "Activate plan"}
                >
                  {plan.is_active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePlan(plan.id);
                  }}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-xs transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg
            className="w-20 h-20 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500 text-lg font-medium">
            {searchTerm
              ? `No plans found for "${searchTerm}"`
              : "No plans created yet."}
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.total > pagination.limit && (
        <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-5 py-2.5 bg-[#003D7A] text-white rounded-lg hover:bg-[#002855] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-5 py-2.5 bg-[#003D7A] text-white rounded-lg hover:bg-[#002855] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PlansList;
