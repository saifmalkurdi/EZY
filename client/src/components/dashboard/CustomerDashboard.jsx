import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";

const CustomerDashboard = ({ myPlans, myCourses, purchaseLoading }) => {
  const navigate = useNavigate();
  const sevenDaysFromNowRef = useRef(null);
  if (sevenDaysFromNowRef.current === null) {
    sevenDaysFromNowRef.current = new Date(
      // eslint-disable-next-line react-hooks/purity
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );
  }
  const sevenDaysFromNow = sevenDaysFromNowRef.current;

  return (
    <div className="space-y-8">
      {/* My Plans Section */}
      {myPlans.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-[#003D7A]">
              My Plans ({myPlans.length})
            </h3>
            <button
              onClick={() => navigate("/pricing")}
              className="px-4 py-2 bg-[#003D7A] text-white rounded-lg hover:bg-[#002855] transition-colors font-medium text-sm"
            >
              Discover More Plans
            </button>
          </div>

          {purchaseLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPlans.map((plan) => {
                const isExpired =
                  plan.expires_at && new Date(plan.expires_at) < new Date();
                const isExpiringSoon =
                  plan.expires_at &&
                  new Date(plan.expires_at) < sevenDaysFromNow &&
                  !isExpired;

                return (
                  <div
                    key={plan.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
                  >
                    <div className="bg-linear-to-r from-[#003D7A] to-[#0056A8] p-6 text-white">
                      <h4 className="text-xl font-bold mb-2">
                        {plan.title || plan.name}
                      </h4>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">
                          ₹{plan.price}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Purchased</span>
                        <span className="font-medium text-gray-900">
                          {new Date(plan.purchased_at).toLocaleDateString()}
                        </span>
                      </div>

                      {plan.expires_at && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Expires</span>
                          <span
                            className={`font-medium ${
                              isExpired
                                ? "text-red-600"
                                : isExpiringSoon
                                ? "text-orange-600"
                                : "text-green-600"
                            }`}
                          >
                            {isExpired
                              ? "Expired"
                              : new Date(plan.expires_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Status</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isExpired
                                ? "bg-red-100 text-red-700"
                                : isExpiringSoon
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {isExpired
                              ? "Expired"
                              : isExpiringSoon
                              ? "Expiring Soon"
                              : "Active"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* My Courses Section */}
      {myCourses.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-[#003D7A]">
              My Courses ({myCourses.length}/5)
            </h3>
            <button
              onClick={() => navigate("/courses")}
              className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF8555] transition-colors font-medium text-sm"
            >
              Discover More Courses
            </button>
          </div>

          {purchaseLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map((course) => {
                const isExpired =
                  course.expires_at && new Date(course.expires_at) < new Date();
                const isExpiringSoon =
                  course.expires_at &&
                  new Date(course.expires_at) < sevenDaysFromNow &&
                  !isExpired;

                const handleCardClick = () => {
                  // myCourses are purchase records which include cp.* fields and course fields
                  // course.id might actually be the purchase id. Use course.course_id if available.
                  const idToNavigate = course.course_id || course.id;
                  navigate(`/course/${idToNavigate}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                };

                return (
                  <div
                    key={course.id}
                    onClick={handleCardClick}
                    className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                  >
                    {course.thumbnail_url && (
                      <div className="bg-[#003D7A] h-44 flex items-center justify-center p-6">
                        <img
                          src={getImageUrl(course.thumbnail_url)}
                          alt={course.title}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    )}

                    <div className="bg-linear-to-r from-[#003D7A] to-[#0066CC] p-6 text-white">
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="font-bold text-xl flex-1">
                          {course.title}
                        </h5>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            course.is_active
                              ? "bg-green-400 text-green-900"
                              : "bg-red-400 text-red-900"
                          }`}
                        >
                          {course.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="text-white/90 text-sm line-clamp-2 mb-3">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[#FF6B35] font-bold text-2xl bg-white px-3 py-1 rounded-lg">
                          ₹{course.price}
                        </span>
                        <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                          {course.level}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 bg-gray-50">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-[#FF6B35]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-600">
                            Duration:{" "}
                            <span className="font-semibold text-gray-800">
                              {course.duration}
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-[#FF6B35]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                          </svg>
                          <span className="text-gray-600">
                            Category:{" "}
                            <span className="font-semibold text-gray-800">
                              {course.category}
                            </span>
                          </span>
                        </div>

                        {course.expires_at && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">
                              Access Until:{" "}
                              <span
                                className={`font-medium ${
                                  isExpired
                                    ? "text-red-600"
                                    : isExpiringSoon
                                    ? "text-orange-600"
                                    : "text-green-600"
                                }`}
                              >
                                {isExpired
                                  ? "Expired"
                                  : new Date(
                                      course.expires_at
                                    ).toLocaleDateString()}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* No Purchases State */}
      {myPlans.length === 0 && myCourses.length === 0 && !purchaseLoading && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Purchases Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your learning journey by purchasing a plan or course.
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="/pricing"
                className="px-6 py-3 bg-[#003D7A] text-white rounded-lg hover:bg-[#002855] transition-colors font-medium"
              >
                View Plans
              </a>
              <a
                href="/courses"
                className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF8555] transition-colors font-medium"
              >
                Browse Courses
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
