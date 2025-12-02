import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPlans } from "../store/slices/planSlice";
import { purchasePlan } from "../store/slices/purchaseSlice";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";
import razorpay from "../assets/images/razorpay.svg";
import house from "../assets/icons/house.svg";
import people from "../assets/icons/people.svg";
import calender from "../assets/icons/calender.svg";
import dots2 from "../assets/illustrations/dots2.svg";

const Pricing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const {
    plans: pricingPlans,
    total,
    loading,
    error,
  } = useSelector((state) => state.plans);
  const { user } = useSelector((state) => state.auth);
  const { loading: purchasing } = useSelector((state) => state.purchase);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const plansPerPage = 3;

  // Icon mapping
  const iconMap = {
    house,
    people,
    calender,
  };

  useEffect(() => {
    // Fetch plans with pagination
    dispatch(
      fetchPlans({
        limit: plansPerPage,
        offset: (currentPage - 1) * plansPerPage,
      })
    );
  }, [dispatch, currentPage, plansPerPage]);

  const handleChoosePlan = async (planId) => {
    if (!user) {
      showToast("Please login to purchase a plan", "error");
      navigate("/login");
      return;
    }

    if (user.role !== "customer") {
      showToast("Only customers can purchase plans", "error");
      return;
    }

    // Find the plan to check if it's active
    const selectedPlan = pricingPlans.find((p) => p.id === planId);
    if (!selectedPlan?.is_active) {
      showToast("This plan is currently not available for purchase", "error");
      return;
    }

    if (confirm("Confirm your plan purchase?")) {
      try {
        const result = await dispatch(purchasePlan(planId));
        if (purchasePlan.fulfilled.match(result)) {
          showToast(
            "Plan purchase request submitted! Check your dashboard for status.",
            "success"
          );
          navigate("/dashboard");
        } else {
          showToast(
            result.payload || "Failed to submit purchase request",
            "error"
          );
        }
      } catch (error) {
        showToast("Failed to submit purchase request", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading pricing plans...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      {/* Blue Background Section */}
      <div className="bg-[#003F7D] rounded-b-[50px] md:rounded-b-[100px] lg:rounded-b-[150px] relative pb-24 md:pb-32 lg:pb-40">
        {/* Page Title */}
        <div className="container mx-auto px-4 pt-24 md:pt-28 lg:pt-32 pb-16 md:pb-20 lg:pb-24">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Our <span className="text-[#FF8B36]">Pricing</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Decorative Dots - Left */}
      <div className="absolute left-4 md:left-10 top-[250px] md:top-[300px] lg:top-[350px] hidden md:block z-100">
        <img src={dots2} alt="" className="w-16 md:w-20 lg:w-24 h-auto" />
      </div>

      {/* Decorative Dots - Right */}
      <div className="absolute right-4 md:right-10 top-[250px] md:top-[300px] lg:top-[350px] hidden md:block z-100">
        <img src={dots2} alt="" className="w-16 md:w-20 lg:w-24 h-auto" />
      </div>

      {/* Pricing Cards Section */}
      <div className="bg-white py-8 md:py-12 lg:py-16 relative">
        <div className="container mx-auto px-4 relative z-30">
          {/* Approval Notice */}
          {user?.role === "customer" && (
            <div className="max-w-5xl mx-auto -mt-24 md:-mt-32 lg:-mt-40 mb-12 md:mb-16 bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg shadow-lg" style={{ zIndex: 200 }}>
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    className="h-6 w-6 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-orange-800">
                    Plan Purchase Requires Admin Approval
                  </h3>
                  <div className="mt-2 text-sm text-orange-700">
                    <p>
                      Please note: When you purchase a plan, your request will be sent to the admin for approval.
                      You will receive a notification once your purchase is approved and gain immediate access to all plan benefits.
                      You can track your purchase status in your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 gap-y-12 md:gap-y-16 lg:gap-y-20 max-w-5xl mx-auto items-stretch md:items-center -mt-32 md:-mt-48 lg:-mt-64">
            {pricingPlans.map((plan, index) => {
              // In a 3-column grid, determine if card is in middle position (index % 3 === 1)
              const isMiddleCard = index % 3 === 1;

              return (
                <div
                  key={plan.id}
                  className={`relative transition-transform duration-300 ${
                    isMiddleCard
                      ? "md:scale-105 lg:scale-110"
                      : "md:scale-90 lg:scale-90"
                  }`}
                  style={{ zIndex: 100 }}
                >
                  {/* Program Label */}
                  <div className="relative -mb-3 z-200">
                    <div className="flex justify-center">
                      <div
                        className={`bg-white px-3 md:px-4 py-2 rounded-[10px] shadow-md border border-gray-100 ${
                          plan.title.length > 25
                            ? "max-w-[70%] md:max-w-[55%]"
                            : ""
                        }`}
                      >
                        <p
                          className={`text-xs font-semibold text-[#FF8B36] uppercase tracking-wide text-center leading-tight ${
                            plan.title.length > 25 ? "" : "whitespace-nowrap"
                          }`}
                        >
                          {plan.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Card */}
                  <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* Price Header */}
                    <div className="bg-[#FF8B36] rounded-t-3xl pt-6 md:pt-8 pb-3 md:pb-4 px-4 md:px-6">
                      <div className="text-center">
                        <div className="flex items-start justify-center gap-1 mb-1">
                          <span className="text-white text-xl md:text-2xl font-bold mt-1">
                            ₹
                          </span>
                          <span className="text-white text-4xl md:text-5xl font-bold">
                            {plan.price.toLocaleString()}
                          </span>
                          <span className="text-white text-xs md:text-sm mt-2 font-medium">
                            {plan.price_note}
                          </span>
                        </div>
                        <p className="text-white/90 text-xs">{plan.gst_note}</p>
                        {plan.duration_days && (
                          <p className="text-white font-semibold text-sm mt-2">
                            {plan.duration_days} days access
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="px-6 md:px-8 pb-6 md:pb-8 pt-4 md:pt-6">
                      {/* Features List */}
                      <div className="space-y-4 md:space-y-5 mb-6 md:mb-8">
                        {(plan.features && Array.isArray(plan.features)
                          ? plan.features
                          : []
                        ).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="flex items-center justify-center shrink-0 mt-0.5">
                              <img
                                src={iconMap[feature.icon] || house}
                                alt=""
                                className="w-6 md:w-8 h-6 md:h-8"
                              />
                            </div>
                            <p className="text-gray-700 text-sm font-medium leading-relaxed pt-1 md:pt-2">
                              {feature.text}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Plan Status Badge */}
                      {!plan.is_active && (
                        <div className="mb-4 text-center">
                          <span className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold">
                            Currently Unavailable
                          </span>
                        </div>
                      )}

                      {/* CTA Button */}
                      <button
                        onClick={() => handleChoosePlan(plan.id)}
                        disabled={!plan.is_active || purchasing}
                        className={`w-full py-2.5 md:py-3 px-4 md:px-6 rounded-lg font-semibold text-sm md:text-base border-2 transition-all duration-300 ${
                          !plan.is_active
                            ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                            : "border-[#FF8B36] text-[#FF8B36] hover:bg-[#FF8C42] hover:text-white cursor-pointer"
                        }`}
                      >
                        {!plan.is_active
                          ? "Not Available"
                          : purchasing
                          ? "Processing..."
                          : plan.button_text}
                      </button>

                      {/* Payment Logo */}
                      <div className="mt-4 md:mt-5 text-center">
                        <img
                          src={razorpay}
                          alt="Razorpay"
                          className="h-4 md:h-5 mx-auto opacity-60"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {total > plansPerPage && (
            <div className="flex justify-center items-center gap-2 mt-12 mb-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#003D7A] text-white hover:bg-[#002a54]"
                }`}
              >
                Previous
              </button>

              {/* Page numbers */}
              {Array.from(
                { length: Math.ceil(total / plansPerPage) },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? "bg-[#FF8B36] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(total / plansPerPage))
                  )
                }
                disabled={currentPage === Math.ceil(total / plansPerPage)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === Math.ceil(total / plansPerPage)
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#003D7A] text-white hover:bg-[#002a54]"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.isOpen}
        onClose={hideToast}
      />
    </>
  );
};

export default Pricing;
