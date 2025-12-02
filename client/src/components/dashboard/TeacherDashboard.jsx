import React from "react";

const TeacherDashboard = ({
  onOpenCourseModal,
  revenue,
  purchaseLoading,
  onRefreshRevenue,
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
        {/* Course Creation */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-xl font-bold text-[#FF6B35] mb-2">Add Courses</h4>
          <p className="text-gray-600 mb-4">Create new courses for students.</p>
          <button
            type="button"
            onClick={onOpenCourseModal}
            className="px-6 py-3 rounded-lg font-semibold text-[15px] transition-all duration-300 inline-flex items-center justify-center text-center bg-orange-500 text-white border-2 border-orange-500 hover:bg-orange-600 hover:border-orange-600 w-[183px] cursor-pointer"
          >
            Add New Course
          </button>
        </div>
        {/* Revenue Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xl font-bold text-[#FF6B35]">My Revenue</h4>
            {onRefreshRevenue && (
              <button
                onClick={onRefreshRevenue}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                disabled={purchaseLoading}
                title="Refresh revenue stats"
              >
                🔄 Refresh
              </button>
            )}
          </div>
          <p className="text-gray-600 mb-4">
            View your earnings from course sales.
          </p>
          {purchaseLoading ? (
            <p className="text-gray-500">Loading revenue...</p>
          ) : revenue ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Sales:</span>
                <span className="font-medium">{revenue.total_sales}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Revenue:</span>
                <span className="font-medium text-green-600">
                  ₹{Number(revenue.total_revenue).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No revenue yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
