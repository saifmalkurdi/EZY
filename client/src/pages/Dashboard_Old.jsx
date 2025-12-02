import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import {
  logoutUser,
  logout,
  createTeacher,
  deleteAccount,
} from "../store/slices/authSlice";
import { createPlan, updatePlan, deletePlan } from "../store/slices/planSlice";
import {
  createCourse,
  updateCourse,
  deleteCourse,
} from "../store/slices/courseSlice";
import Modal from "../components/Modal";
import UserProfile from "../components/dashboard/UserProfile";
import PlansList from "../components/dashboard/PlansList";
import CoursesList from "../components/dashboard/CoursesList";
import ManagementCards from "../components/dashboard/ManagementCards";
import AccountActions from "../components/dashboard/AccountActions";
import TeacherDashboard from "../components/dashboard/TeacherDashboard";
import CustomerDashboard from "../components/dashboard/CustomerDashboard";
import axios from "../api/axios";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { loading: planLoading } = useSelector((state) => state.plans);
  const { loading: courseLoading } = useSelector((state) => state.courses);
  const { loading: teacherLoading } = useSelector((state) => state.auth);

  // Local state for notifications and purchases
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [myPlans, setMyPlans] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planForm, setPlanForm] = useState({
    title: "",
    description: "",
    price: "",
    price_note: "",
    gst_note: "",
    features: [],
    button_text: "Choose Plan",
    is_highlighted: false,
    is_active: true,
  });
  const [editingPlan, setEditingPlan] = useState(null);
  const [plans, setPlans] = useState([]);

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [teacherForm, setTeacherForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    level: "beginner",
    category: "",
    icon: "",
    objectives: [],
    curriculum: [],
    tools: [],
    is_active: true,
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const [courses, setCourses] = useState([]);

  // Search and pagination state
  const [planSearchTerm, setPlanSearchTerm] = useState("");
  const [planPagination, setPlanPagination] = useState({
    currentPage: 1,
    limit: 3,
    total: 0,
    totalPages: 1,
  });

  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [coursePagination, setCoursePagination] = useState({
    currentPage: 1,
    limit: 3,
    total: 0,
    totalPages: 1,
  });

  // Helper functions defined before useEffect to avoid hoisting issues
  const fetchPlansList = useCallback(
    async (search = "", page = 1) => {
      try {
        const offset = (page - 1) * planPagination.limit;
        const params = new URLSearchParams({
          limit: planPagination.limit.toString(),
          offset: offset.toString(),
        });

        if (search) {
          params.append("search", search);
        }

        const response = await axios.get(`/plans?${params.toString()}`);
        const fetchedPlans = response.data.data || [];
        const totalCount = response.data.total || 0;
        setPlans(fetchedPlans);

        // Update pagination info
        setPlanPagination((prev) => ({
          ...prev,
          currentPage: page,
          total: totalCount,
          totalPages: Math.ceil(totalCount / prev.limit) || 1,
        }));
      } catch {
        // Error handled
      }
    },
    [planPagination.limit]
  );

  const fetchCoursesList = useCallback(
    async (search = "", page = 1) => {
      try {
        const offset = (page - 1) * coursePagination.limit;
        const params = new URLSearchParams({
          limit: coursePagination.limit.toString(),
          offset: offset.toString(),
        });

        if (search) {
          params.append("search", search);
        }

        const response = await axios.get(
          `/courses/my/courses?${params.toString()}`
        );
        const fetchedCourses = response.data.data || [];
        const totalCount = response.data.total || 0;
        setCourses(fetchedCourses);

        // Update pagination info
        setCoursePagination((prev) => ({
          ...prev,
          currentPage: page,
          total: totalCount,
          totalPages: Math.ceil(totalCount / prev.limit) || 1,
        }));
      } catch {
        // Error handled
      }
    },
    [coursePagination.limit]
  );

  // Fetch notifications and purchases on mount
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setNotificationLoading(true);
        try {
          const notificationsResponse = await axios.get("/notifications/my");
          setNotifications(notificationsResponse.data.data || []);
          setUnreadCount(
            (notificationsResponse.data.data || []).filter((n) => !n.is_read)
              .length
          );
        } catch {
          // Handle silently
        } finally {
          setNotificationLoading(false);
        }

        if (user.role === "customer") {
          setPurchaseLoading(true);
          try {
            const [plansResponse, coursesResponse] = await Promise.all([
              axios.get("/purchases/my/plans"),
              axios.get("/purchases/my/courses"),
            ]);
            setMyPlans(plansResponse.data.data || []);
            setMyCourses(coursesResponse.data.data || []);
          } catch {
            // Handle silently
          } finally {
            setPurchaseLoading(false);
          }
        } else if (user.role === "teacher") {
          setPurchaseLoading(true);
          try {
            const [revenueResponse] = await Promise.all([
              axios.get("/purchases/my/revenue"),
            ]);
            setRevenue(revenueResponse.data.data);
            // Fetch courses with search and pagination support
            await fetchCoursesList(
              courseSearchTerm,
              coursePagination.currentPage
            );
          } catch {
            // Handle silently
          } finally {
            setPurchaseLoading(false);
          }
        } else if (user.role === "admin") {
          // Fetch plans for management
          await fetchPlansList(planSearchTerm, planPagination.currentPage);
        }
      }
    };

    fetchData();
  }, [
    user,
    fetchPlansList,
    fetchCoursesList,
    planSearchTerm,
    courseSearchTerm,
    planPagination.currentPage,
    coursePagination.currentPage,
  ]);

  const handleMarkAsRead = useCallback(async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Handle silently
    }
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await axios.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // Handle silently
    }
  }, []);

  const handleDeleteNotification = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await axios.delete(`/notifications/${id}`);
        setNotifications((prev) => {
          const notification = prev.find((n) => n.id === id);
          const wasUnread = notification && !notification.is_read;
          const newNotifications = prev.filter((n) => n.id !== id);
          if (wasUnread) {
            setUnreadCount((count) => Math.max(0, count - 1));
          }
          return newNotifications;
        });
      } catch {
        // Handle silently
      }
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutUser());
    } catch {
      // API call failed, but still logout locally
    }
    dispatch(logout());
    navigate("/");
  }, [dispatch, navigate]);

  const handleDeleteAccount = useCallback(async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await dispatch(deleteAccount());
        dispatch(logout());
        navigate("/login");
        alert("Account deleted successfully");
      } catch {
        alert("Failed to delete account");
      }
    }
  }, [dispatch, navigate]);

  // Search handlers
  const handlePlanSearch = useCallback(
    (searchTerm) => {
      setPlanSearchTerm(searchTerm);
      setPlanPagination((prev) => ({ ...prev, currentPage: 1 }));
      fetchPlansList(searchTerm, 1);
    },
    [fetchPlansList]
  );

  const handleCourseSearch = useCallback(
    (searchTerm) => {
      setCourseSearchTerm(searchTerm);
      setCoursePagination((prev) => ({ ...prev, currentPage: 1 }));
      fetchCoursesList(searchTerm, 1);
    },
    [fetchCoursesList]
  );

  // Pagination handlers
  const handlePlanPageChange = useCallback(
    (page) => {
      fetchPlansList(planSearchTerm, page);
    },
    [fetchPlansList, planSearchTerm]
  );

  const handleCoursePageChange = useCallback(
    (page) => {
      fetchCoursesList(courseSearchTerm, page);
    },
    [fetchCoursesList, courseSearchTerm]
  );

  const handleCreatePlan = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const resultAction = await dispatch(createPlan(planForm));
        if (createPlan.fulfilled.match(resultAction)) {
          alert("Plan created successfully!");
          setIsPlanModalOpen(false);
          setPlanForm({
            title: "",
            description: "",
            price: "",
            price_note: "",
            gst_note: "",
            features: [],
            button_text: "Choose Plan",
            is_highlighted: false,
            is_active: true,
          });
          // Refresh plans list
          fetchPlansList(planSearchTerm, planPagination.currentPage);
        } else {
          alert(resultAction.payload || "Failed to create plan");
        }
      } catch {
        alert("Failed to create plan");
      }
    },
    [
      dispatch,
      planForm,
      fetchPlansList,
      planSearchTerm,
      planPagination.currentPage,
    ]
  );

  const handleEditPlan = useCallback((plan) => {
    setEditingPlan(plan);
    setPlanForm({
      title: plan.title || "",
      description: plan.description || "",
      price: plan.price || "",
      price_note: plan.price_note || "",
      gst_note: plan.gst_note || "",
      features: plan.features || [],
      button_text: plan.button_text || "Choose Plan",
      is_highlighted: plan.is_highlighted || false,
      is_active: plan.is_active !== undefined ? plan.is_active : true,
    });
    setIsPlanModalOpen(true);
  }, []);

  const handleDeletePlan = useCallback(
    async (planId) => {
      if (!confirm("Are you sure you want to delete this plan?")) return;

      try {
        const resultAction = await dispatch(deletePlan(planId));
        if (deletePlan.fulfilled.match(resultAction)) {
          alert("Plan deleted successfully!");
          // Refresh plans list
          fetchPlansList(planSearchTerm, planPagination.currentPage);
        } else {
          alert(resultAction.payload || "Failed to delete plan");
        }
      } catch {
        // Error handled
        alert("Failed to delete plan");
      }
    },
    [dispatch, fetchPlansList, planSearchTerm, planPagination.currentPage]
  );

  const handleUpdatePlan = useCallback(
    async (e) => {
      e.preventDefault();
      if (!editingPlan) return;

      try {
        const resultAction = await dispatch(
          updatePlan({
            id: editingPlan.id,
            planData: planForm,
          })
        );
        if (updatePlan.fulfilled.match(resultAction)) {
          alert("Plan updated successfully!");
          setIsPlanModalOpen(false);
          setEditingPlan(null);
          setPlanForm({
            title: "",
            description: "",
            price: "",
            price_note: "",
            gst_note: "",
            features: [],
            button_text: "Choose Plan",
            is_highlighted: false,
            is_active: true,
          });
          // Refresh plans list
          fetchPlansList(planSearchTerm, planPagination.currentPage);
        } else {
          alert(resultAction.payload || "Failed to update plan");
        }
      } catch {
        // Error handled
        alert("Failed to update plan");
      }
    },
    [
      dispatch,
      planForm,
      editingPlan,
      fetchPlansList,
      planSearchTerm,
      planPagination.currentPage,
    ]
  );

  const handleCreateTeacher = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const resultAction = await dispatch(createTeacher(teacherForm));
        if (createTeacher.fulfilled.match(resultAction)) {
          alert("Teacher created successfully!");
          setIsTeacherModalOpen(false);
          setTeacherForm({
            full_name: "",
            email: "",
            password: "",
          });
        } else {
          alert(resultAction.payload || "Failed to create teacher");
        }
      } catch {
        // Error handled
        alert("Failed to create teacher");
      }
    },
    [dispatch, teacherForm]
  );

  const handleCreateCourse = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const resultAction = await dispatch(createCourse(courseForm));
        if (createCourse.fulfilled.match(resultAction)) {
          alert("Course created successfully!");
          setIsCourseModalOpen(false);
          setCourseForm({
            title: "",
            description: "",
            price: "",
            duration: "",
            level: "beginner",
            category: "",
            icon: "",
            objectives: [],
            curriculum: [],
            tools: [],
            is_active: true,
          });
          // Refresh courses list
          fetchCoursesList(courseSearchTerm, coursePagination.currentPage);
        } else {
          alert(resultAction.payload || "Failed to create course");
        }
      } catch {
        // Error handled
        alert("Failed to create course");
      }
    },
    [
      dispatch,
      courseForm,
      fetchCoursesList,
      courseSearchTerm,
      coursePagination.currentPage,
    ]
  );

  const handleEditCourse = useCallback((course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title || "",
      description: course.description || "",
      price: course.price || "",
      duration: course.duration || "",
      level: course.level?.toLowerCase() || "beginner",
      category: course.category || "",
      icon: course.icon || "",
      objectives: course.objectives || [],
      curriculum: course.curriculum || [],
      tools: course.tools || [],
      is_active: course.is_active !== undefined ? course.is_active : true,
    });
    setIsCourseModalOpen(true);
  }, []);

  const handleUpdateCourse = useCallback(
    async (e) => {
      e.preventDefault();
      if (!editingCourse) return;

      try {
        const resultAction = await dispatch(
          updateCourse({
            id: editingCourse.id,
            courseData: courseForm,
          })
        );
        if (updateCourse.fulfilled.match(resultAction)) {
          alert("Course updated successfully!");
          setIsCourseModalOpen(false);
          setEditingCourse(null);
          setCourseForm({
            title: "",
            description: "",
            price: "",
            duration: "",
            level: "beginner",
            category: "",
            icon: "",
            objectives: [],
            curriculum: [],
            tools: [],
            is_active: true,
          });
          // Refresh courses list
          fetchCoursesList(courseSearchTerm, coursePagination.currentPage);
        } else {
          alert(resultAction.payload || "Failed to update course");
        }
      } catch {
        // Error handled
        alert("Failed to update course");
      }
    },
    [
      dispatch,
      courseForm,
      editingCourse,
      fetchCoursesList,
      courseSearchTerm,
      coursePagination.currentPage,
    ]
  );

  const handleDeleteCourse = useCallback(
    async (courseId) => {
      if (!confirm("Are you sure you want to delete this course?")) return;

      try {
        const resultAction = await dispatch(deleteCourse(courseId));
        if (deleteCourse.fulfilled.match(resultAction)) {
          alert("Course deleted successfully!");
          // Refresh courses list
          fetchCoursesList(courseSearchTerm, coursePagination.currentPage);
        } else {
          alert(resultAction.payload || "Failed to delete course");
        }
      } catch {
        // Error handled
        alert("Failed to delete course");
      }
    },
    [dispatch, fetchCoursesList, courseSearchTerm, coursePagination.currentPage]
  );

  const handleToggleCourseStatus = useCallback(
    async (courseId, isActive) => {
      try {
        const response = await axios.patch(
          `/courses/${courseId}/toggle-status`,
          { is_active: isActive }
        );

        if (response.data.success) {
          alert(
            `Course ${isActive ? "activated" : "deactivated"} successfully!`
          );
          // Refresh courses list
          fetchCoursesList(courseSearchTerm, coursePagination.currentPage);
        }
      } catch (error) {
        alert(
          error.response?.data?.message || "Failed to update course status"
        );
      }
    },
    [fetchCoursesList, courseSearchTerm, coursePagination.currentPage]
  );

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
            plans={plans}
            onEditPlan={handleEditPlan}
            onDeletePlan={handleDeletePlan}
            onSearch={handlePlanSearch}
            searchTerm={planSearchTerm}
            pagination={planPagination}
            onPageChange={handlePlanPageChange}
          />
        )}

        {/* Role-based dashboard sections */}
        {user?.role === "admin" && (
          <ManagementCards
            user={user}
            onOpenPlanModal={() => setIsPlanModalOpen(true)}
            onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
            notifications={notifications}
            unreadCount={unreadCount}
            notificationLoading={notificationLoading}
            onMarkAllAsRead={handleMarkAllAsRead}
            onMarkAsRead={handleMarkAsRead}
            onDeleteNotification={handleDeleteNotification}
          />
        )}

        {user?.role === "teacher" && (
          <div className="space-y-10">
            <CoursesList
              courses={courses}
              onEditCourse={handleEditCourse}
              onDeleteCourse={handleDeleteCourse}
              onToggleStatus={handleToggleCourseStatus}
              onSearch={handleCourseSearch}
              searchTerm={courseSearchTerm}
              pagination={coursePagination}
              onPageChange={handleCoursePageChange}
            />
            <TeacherDashboard
              onOpenCourseModal={() => setIsCourseModalOpen(true)}
              revenue={revenue}
              purchaseLoading={purchaseLoading}
              notifications={notifications}
              unreadCount={unreadCount}
              notificationLoading={notificationLoading}
              onMarkAllAsRead={handleMarkAllAsRead}
              onMarkAsRead={handleMarkAsRead}
              onDeleteNotification={handleDeleteNotification}
            />
          </div>
        )}

        {user?.role === "customer" && (
          <CustomerDashboard
            myPlans={myPlans}
            myCourses={myCourses}
            purchaseLoading={purchaseLoading}
            notifications={notifications}
            unreadCount={unreadCount}
            notificationLoading={notificationLoading}
            onMarkAllAsRead={handleMarkAllAsRead}
            onMarkAsRead={handleMarkAsRead}
            onDeleteNotification={handleDeleteNotification}
          />
        )}

        {/* Account Actions for all authenticated users - Moved to bottom */}
        {user && (
          <AccountActions
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
            teacherLoading={teacherLoading}
          />
        )}
      </div>

      <Modal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)}>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-[#003D7A] mb-4">
            {editingPlan ? "Edit Plan" : "Create New Plan"}
          </h2>
          <form
            onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={planForm.title}
                onChange={(e) =>
                  setPlanForm({ ...planForm, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98149]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={planForm.description}
                onChange={(e) =>
                  setPlanForm({ ...planForm, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98149]"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                value={planForm.price}
                onChange={(e) =>
                  setPlanForm({
                    ...planForm,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98149]"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Note
              </label>
              <input
                type="text"
                value={planForm.price_note}
                onChange={(e) =>
                  setPlanForm({ ...planForm, price_note: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98149]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Note
              </label>
              <input
                type="text"
                value={planForm.gst_note}
                onChange={(e) =>
                  setPlanForm({ ...planForm, gst_note: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98149]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features (one per line)
              </label>
              <textarea
                value={planForm.features.map((f) => f.text || f).join("\n")}
                onChange={(e) => {
                  const features = e.target.value
                    .split("\n")
                    .filter((f) => f.trim())
                    .map((text) => ({
                      text: text.trim(),
                      icon: "house", // default icon
                    }));
                  setPlanForm({ ...planForm, features });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98149]"
                rows="4"
                placeholder="Enter each feature on a new line"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={planForm.is_highlighted}
                  onChange={(e) =>
                    setPlanForm({
                      ...planForm,
                      is_highlighted: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                Highlighted
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={planForm.is_active}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, is_active: e.target.checked })
                  }
                  className="mr-2"
                />
                Active
              </label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsPlanModalOpen(false);
                  setEditingPlan(null);
                  setPlanForm({
                    title: "",
                    description: "",
                    price: "",
                    price_note: "",
                    gst_note: "",
                    features: [],
                    button_text: "Choose Plan",
                    is_highlighted: false,
                    is_active: true,
                  });
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={planLoading}
                className="px-4 py-2 bg-[#F98149] text-white rounded-md hover:bg-[#e55a2a] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {planLoading
                  ? "Saving..."
                  : editingPlan
                  ? "Update Plan"
                  : "Create Plan"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#003D7A] mb-4">
            Create New Teacher
          </h2>
          <form onSubmit={handleCreateTeacher} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={teacherForm.full_name}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, full_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98149]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={teacherForm.email}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98149]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                value={teacherForm.password}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98149]"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsTeacherModalOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={teacherLoading}
                className="px-4 py-2 bg-[#F98149] text-white rounded-md hover:bg-[#e55a2a] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {teacherLoading ? "Creating..." : "Create Teacher"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        className="max-w-2xl"
      >
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-[#003D7A] mb-4">
            {editingCourse ? "Edit Course" : "Create New Course"}
          </h2>
          <form
            onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={courseForm.title}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98149]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={courseForm.description}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98149]"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                value={courseForm.price}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98149]"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={courseForm.duration}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, duration: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98149]"
                placeholder="e.g., 4 weeks"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                value={courseForm.level}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, level: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98149]"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={courseForm.category}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98149]"
                placeholder="e.g., Web Development"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <select
                value={courseForm.icon}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, icon: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F98149]"
              >
                <option value="">Select an icon</option>
                <option value="react.svg">React</option>
                <option value="angular.svg">Angular</option>
                <option value="vue.svg">Vue</option>
                <option value="python.svg">Python</option>
                <option value="aws.svg">AWS</option>
                <option value="powerBi.svg">Power BI</option>
                <option value="coreui.svg">Core UI</option>
                <option value="testing.svg">Testing</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select an icon or leave empty to show a placeholder
              </p>
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={courseForm.is_active}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      is_active: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                Active
              </label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsCourseModalOpen(false);
                  setEditingCourse(null);
                  setCourseForm({
                    title: "",
                    description: "",
                    price: "",
                    duration: "",
                    level: "beginner",
                    category: "",
                    icon: "",
                    objectives: [],
                    curriculum: [],
                    tools: [],
                    is_active: true,
                  });
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={courseLoading}
                className="px-4 py-2 bg-[#F98149] text-white rounded-md hover:bg-[#e55a2a] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {courseLoading
                  ? "Saving..."
                  : editingCourse
                  ? "Update Course"
                  : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard;
