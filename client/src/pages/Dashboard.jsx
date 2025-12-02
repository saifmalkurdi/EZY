import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useCallback, useState } from "react";
import { logoutUser, logout, deleteAccount } from "../store/slices/authSlice";
import UserProfile from "../components/dashboard/UserProfile";
import PlansList from "../components/dashboard/PlansList";
import CoursesList from "../components/dashboard/CoursesList";
import ManagementCards from "../components/dashboard/ManagementCards";
import AccountActions from "../components/dashboard/AccountActions";
import TeacherDashboard from "../components/dashboard/TeacherDashboard";
import CustomerDashboard from "../components/dashboard/CustomerDashboard";
import PendingApprovals from "../components/dashboard/PendingApprovals";
import PendingRequests from "../components/dashboard/PendingRequests";
import PlanModal from "../components/modals/PlanModal";
import CourseModal from "../components/modals/CourseModal";
import TeacherModal from "../components/modals/TeacherModal";
import ConfirmDialog from "../components/modals/ConfirmDialog";
import Toast from "../components/Toast";
import { usePlans } from "../hooks/usePlans";
import { useCourses } from "../hooks/useCourses";
import { useNotifications } from "../contexts/NotificationContext";
import { usePurchases } from "../hooks/usePurchases";
import { useTeacher } from "../hooks/useTeacher";
import { useToast } from "../hooks/useToast";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { loading: planLoading } = useSelector((state) => state.plans);

  // Custom hooks for different functionalities
  const plans = usePlans();
  const courses = useCourses();
  const notifications = useNotifications();
  const purchases = usePurchases();
  const teacher = useTeacher();
  const { toast, showToast, hideToast } = useToast();

  // Account deletion confirm dialog
  const [deleteAccountDialog, setDeleteAccountDialog] = useState({
    isOpen: false,
  });

  // Fetch data on mount
  useEffect(() => {
    if (user) {
      purchases.fetchPurchases(user);

      if (user.role === "admin") {
        plans.fetchPlansList("", 1);
      } else if (user.role === "teacher") {
        courses.fetchCoursesList("", 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Refresh revenue when course purchase notifications arrive (for teachers)
  useEffect(() => {
    if (user?.role === "teacher" && notifications.notifications.length > 0) {
      const latestNotification = notifications.notifications[0];
      const purchaseTypes = [
        "course_purchased",
        "course_purchase_approval_request",
        "course_enrollment_approved",
      ];

      if (
        purchaseTypes.includes(latestNotification.type) &&
        !latestNotification.is_read
      ) {
        // Refresh revenue when new purchase notifications arrive
        purchases.refreshRevenue();
      }
    }
  }, [user, notifications.notifications, purchases]);

  // Account actions
  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutUser());
      dispatch(logout());
      navigate("/login");
    } catch {
      // Error handled
    }
  }, [dispatch, navigate]);

  const handleDeleteAccount = useCallback(async () => {
    setDeleteAccountDialog({ isOpen: true });
  }, []);

  const confirmDeleteAccount = useCallback(async () => {
    try {
      const resultAction = await dispatch(deleteAccount());
      if (deleteAccount.fulfilled.match(resultAction)) {
        showToast("Account deleted successfully", "success");
        setTimeout(() => {
          dispatch(logout());
          navigate("/register");
        }, 1500);
      } else {
        showToast(resultAction.payload || "Failed to delete account", "error");
      }
    } catch {
      showToast("Failed to delete account", "error");
    }
  }, [dispatch, navigate, showToast]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#003D7A] mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your courses and account</p>
        </div>
        {user && <UserProfile user={user} />}
        {/* Plans List for Admins */}
        {user?.role === "admin" && (
          <PlansList
            plans={plans.plans}
            loading={planLoading}
            onOpenModal={() => {
              plans.setEditingPlanId(null);
              plans.setIsPlanModalOpen(true);
            }}
            onEditPlan={plans.handleEditPlan}
            onDeletePlan={plans.handleDeletePlan}
            onToggleStatus={plans.handleTogglePlanStatus}
            onSearch={plans.handlePlanSearch}
            searchTerm={plans.planSearchTerm}
            pagination={plans.planPagination}
            onPageChange={plans.handlePlanPageChange}
          />
        )}
        {/* Role-based dashboard sections */}
        {user?.role === "admin" && (
          <>
            <PendingApprovals userRole="admin" />
            <ManagementCards
              user={user}
              onOpenPlanModal={() => plans.setIsPlanModalOpen(true)}
              onOpenTeacherModal={() => teacher.setIsTeacherModalOpen(true)}
            />
          </>
        )}
        {user?.role === "teacher" && (
          <div className="space-y-10">
            <PendingApprovals userRole="teacher" />
            <CoursesList
              courses={courses.courses}
              onEditCourse={courses.handleEditCourse}
              onDeleteCourse={courses.handleDeleteCourse}
              onToggleStatus={courses.handleToggleCourseStatus}
              onSearch={courses.handleCourseSearch}
              searchTerm={courses.courseSearchTerm}
              pagination={courses.coursePagination}
              onPageChange={courses.handleCoursePageChange}
            />
            <TeacherDashboard
              onOpenCourseModal={courses.handleOpenCreateModal}
              revenue={purchases.revenue}
              purchaseLoading={purchases.purchaseLoading}
              onRefreshRevenue={purchases.refreshRevenue}
            />
          </div>
        )}
        {user?.role === "customer" && (
          <>
            <PendingRequests />
            <CustomerDashboard
              myPlans={purchases.myPlans}
              myCourses={purchases.myCourses}
              purchaseLoading={purchases.purchaseLoading}
            />
          </>
        )}
        <AccountActions
          user={user}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
        />
      </div>

      {/* Modals */}
      <PlanModal
        isOpen={plans.isPlanModalOpen}
        onClose={() => {
          plans.setIsPlanModalOpen(false);
          plans.setEditingPlanId(null);
        }}
        onSubmit={
          plans.editingPlanId ? plans.handleUpdatePlan : plans.handleCreatePlan
        }
        planForm={plans.planForm}
        setPlanForm={plans.setPlanForm}
        featureInput={plans.featureInput}
        setFeatureInput={plans.setFeatureInput}
        editingPlanId={plans.editingPlanId}
      />

      <CourseModal
        isOpen={courses.isCourseModalOpen}
        onClose={() => {
          courses.setIsCourseModalOpen(false);
          courses.setEditingCourseId(null);
        }}
        onSubmit={
          courses.editingCourseId
            ? courses.handleUpdateCourse
            : courses.handleCreateCourse
        }
        courseForm={courses.courseForm}
        setCourseForm={courses.setCourseForm}
        objectiveInput={courses.objectiveInput}
        setObjectiveInput={courses.setObjectiveInput}
        curriculumInput={courses.curriculumInput}
        setCurriculumInput={courses.setCurriculumInput}
        toolInput={courses.toolInput}
        setToolInput={courses.setToolInput}
        editingCourseId={courses.editingCourseId}
        thumbnailFile={courses.thumbnailFile}
        setThumbnailFile={courses.setThumbnailFile}
        thumbnailPreview={courses.thumbnailPreview}
        setThumbnailPreview={courses.setThumbnailPreview}
      />

      <TeacherModal
        isOpen={teacher.isTeacherModalOpen}
        onClose={() => teacher.setIsTeacherModalOpen(false)}
        onSubmit={teacher.handleCreateTeacher}
        teacherForm={teacher.teacherForm}
        setTeacherForm={teacher.setTeacherForm}
      />

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={plans.confirmDialog.isOpen}
        onClose={() =>
          plans.setConfirmDialog({ ...plans.confirmDialog, isOpen: false })
        }
        onConfirm={plans.confirmDialog.onConfirm}
        title={plans.confirmDialog.title}
        message={plans.confirmDialog.message}
        type={plans.confirmDialog.type}
      />

      <ConfirmDialog
        isOpen={courses.confirmDialog.isOpen}
        onClose={() =>
          courses.setConfirmDialog({ ...courses.confirmDialog, isOpen: false })
        }
        onConfirm={courses.confirmDialog.onConfirm}
        title={courses.confirmDialog.title}
        message={courses.confirmDialog.message}
        type={courses.confirmDialog.type}
      />

      <ConfirmDialog
        isOpen={deleteAccountDialog.isOpen}
        onClose={() => setDeleteAccountDialog({ isOpen: false })}
        onConfirm={confirmDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
        type="danger"
        confirmText="Delete Account"
      />

      <Toast
        isOpen={toast.isOpen}
        onClose={hideToast}
        message={toast.message}
        type={toast.type}
      />

      <Toast
        isOpen={plans.toast.isOpen}
        onClose={plans.hideToast}
        message={plans.toast.message}
        type={plans.toast.type}
      />

      <Toast
        isOpen={courses.toast.isOpen}
        onClose={courses.hideToast}
        message={courses.toast.message}
        type={courses.toast.type}
      />

      <Toast
        isOpen={teacher.toast.isOpen}
        onClose={teacher.hideToast}
        message={teacher.toast.message}
        type={teacher.toast.type}
      />
    </div>
  );
}

export default Dashboard;
