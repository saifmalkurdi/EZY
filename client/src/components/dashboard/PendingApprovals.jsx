import { useState, useEffect } from "react";
import purchaseService from "../../api/purchaseService";
import Button from "../Button";
import ConfirmDialog from "../modals/ConfirmDialog";
import Toast from "../Toast";
import { useToast } from "../../hooks/useToast";

const PendingApprovals = ({ userRole }) => {
  const [pendingCourses, setPendingCourses] = useState([]);
  const [pendingPlans, setPendingPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("courses");
  const { toast, showToast, hideToast } = useToast();

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "info",
  });

  useEffect(() => {
    fetchPendingApprovals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  const fetchPendingApprovals = async () => {
    setLoading(true);
    try {
      // Teachers and Admins can see pending courses
      if (userRole === "teacher" || userRole === "admin") {
        const coursesResponse =
          await purchaseService.getPendingCoursePurchases();
        setPendingCourses(coursesResponse.data || []);
      }

      // Only Admins can see pending plans
      if (userRole === "admin") {
        const plansResponse = await purchaseService.getPendingPlanPurchases();
        setPendingPlans(plansResponse.data || []);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCourse = (purchaseId) => {
    setConfirmDialog({
      isOpen: true,
      title: "Approve Enrollment",
      message:
        "Are you sure you want to approve this course enrollment? The student will get immediate access.",
      type: "success",
      onConfirm: async () => {
        try {
          await purchaseService.approveCoursePurchase(purchaseId);
          showToast("Course enrollment approved successfully!", "success");
          fetchPendingApprovals();
        } catch (error) {
          showToast(
            error.response?.data?.message || "Failed to approve enrollment",
            "error"
          );
        }
      },
    });
  };

  const handleRejectCourse = (purchaseId) => {
    setConfirmDialog({
      isOpen: true,
      title: "Reject Enrollment",
      message:
        "Are you sure you want to reject this enrollment? This action cannot be undone.",
      type: "danger",
      onConfirm: async () => {
        try {
          await purchaseService.rejectCoursePurchase(purchaseId);
          showToast("Course enrollment rejected", "info");
          fetchPendingApprovals();
        } catch (error) {
          showToast(
            error.response?.data?.message || "Failed to reject enrollment",
            "error"
          );
        }
      },
    });
  };

  const handleApprovePlan = (purchaseId) => {
    setConfirmDialog({
      isOpen: true,
      title: "Approve Plan Purchase",
      message:
        "Are you sure you want to approve this plan purchase? The user will get immediate access to all plan features.",
      type: "success",
      onConfirm: async () => {
        try {
          await purchaseService.approvePlanPurchase(purchaseId);
          showToast("Plan purchase approved successfully!", "success");
          fetchPendingApprovals();
        } catch (error) {
          showToast(
            error.response?.data?.message || "Failed to approve plan",
            "error"
          );
        }
      },
    });
  };

  const handleRejectPlan = (purchaseId) => {
    setConfirmDialog({
      isOpen: true,
      title: "Reject Plan Purchase",
      message:
        "Are you sure you want to reject this plan purchase? This action cannot be undone.",
      type: "danger",
      onConfirm: async () => {
        try {
          await purchaseService.rejectPlanPurchase(purchaseId);
          showToast("Plan purchase rejected", "info");
          fetchPendingApprovals();
        } catch (error) {
          showToast(
            error.response?.data?.message || "Failed to reject plan",
            "error"
          );
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Pending Approvals
      </h2>

      {/* Tabs */}
      {userRole === "admin" && (
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("courses")}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === "courses"
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-gray-600 hover:text-orange-600"
            }`}
          >
            Course Enrollments ({pendingCourses.length})
          </button>
          <button
            onClick={() => setActiveTab("plans")}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === "plans"
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-gray-600 hover:text-orange-600"
            }`}
          >
            Plan Purchases ({pendingPlans.length})
          </button>
        </div>
      )}

      {/* Course Enrollments */}
      {(activeTab === "courses" || userRole === "teacher") && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Pending Course Enrollments
          </h3>
          {pendingCourses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No pending course enrollments
            </p>
          ) : (
            <div className="space-y-4">
              {pendingCourses.map((purchase) => (
                <div
                  key={purchase.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {purchase.course_title}
                      </h4>
                      <p className="text-gray-600 mt-1">
                        <span className="font-medium">Student:</span>{" "}
                        {purchase.customer_name}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span>{" "}
                        {purchase.customer_email}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Amount:</span> ₹
                        {purchase.amount_paid}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Requested on:{" "}
                        {new Date(purchase.purchased_at).toLocaleDateString()}
                      </p>
                      {userRole === "admin" && purchase.teacher_name && (
                        <p className="text-gray-600">
                          <span className="font-medium">Teacher:</span>{" "}
                          {purchase.teacher_name}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleApproveCourse(purchase.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectCourse(purchase.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Plan Purchases (Admin only) */}
      {activeTab === "plans" && userRole === "admin" && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Pending Plan Purchases
          </h3>
          {pendingPlans.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No pending plan purchases
            </p>
          ) : (
            <div className="space-y-4">
              {pendingPlans.map((purchase) => (
                <div
                  key={purchase.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {purchase.plan_title}
                      </h4>
                      <p className="text-gray-600 mt-1">
                        <span className="font-medium">Customer:</span>{" "}
                        {purchase.customer_name}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span>{" "}
                        {purchase.customer_email}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Amount:</span> ₹
                        {purchase.amount_paid}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Requested on:{" "}
                        {new Date(purchase.purchased_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleApprovePlan(purchase.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectPlan(purchase.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
      />

      <Toast
        isOpen={toast.isOpen}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
};

export default PendingApprovals;
