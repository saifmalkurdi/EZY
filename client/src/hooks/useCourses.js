import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  createCourse,
  updateCourse,
  deleteCourse,
} from "../store/slices/courseSlice";
import axios from "../api/axios";
import { useToast } from "./useToast";

export const useCourses = () => {
  const dispatch = useDispatch();
  const { toast, showToast, hideToast } = useToast();

  const [courses, setCourses] = useState([]);
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [coursePagination, setCoursePagination] = useState({
    currentPage: 1,
    limit: 3,
    total: 0,
    totalPages: 1,
  });

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    duration_days: "30",
    level: "Beginner",
    category: "",
    icon: "",
    thumbnail_url: "",
    objectives: [],
    curriculum: [],
    tools: [],
    is_active: true,
  });
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [objectiveInput, setObjectiveInput] = useState("");
  const [curriculumInput, setCurriculumInput] = useState({
    week: "",
    topics: [],
  });
  const [toolInput, setToolInput] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger",
  });

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

  const handleCourseSearch = useCallback(
    (search) => {
      setCourseSearchTerm(search);
      setCoursePagination((prev) => ({ ...prev, currentPage: 1 }));
      fetchCoursesList(search, 1);
    },
    [fetchCoursesList]
  );

  const handleCoursePageChange = useCallback(
    (page) => {
      fetchCoursesList(courseSearchTerm, page);
    },
    [fetchCoursesList, courseSearchTerm]
  );

  const handleCreateCourse = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        let thumbnailUrl = "";

        // Upload thumbnail file if provided
        if (thumbnailFile) {
          const formData = new FormData();
          formData.append("image", thumbnailFile);

          const uploadResponse = await axios.post(
            "/courses/upload-image",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (uploadResponse.data.success) {
            thumbnailUrl = uploadResponse.data.data.url;
          }
        } else if (
          courseForm.thumbnail_url &&
          courseForm.thumbnail_url.startsWith("data:")
        ) {
          // Convert base64 to blob and upload
          const response = await fetch(courseForm.thumbnail_url);
          const blob = await response.blob();
          const file = new File([blob], "image.jpg", { type: blob.type });

          const formData = new FormData();
          formData.append("image", file);

          const uploadResponse = await axios.post(
            "/courses/upload-image",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (uploadResponse.data.success) {
            thumbnailUrl = uploadResponse.data.data.url;
          }
        } else if (courseForm.thumbnail_url) {
          // Use external URL as-is
          thumbnailUrl = courseForm.thumbnail_url;
        }

        const courseData = {
          ...courseForm,
          thumbnail_url: thumbnailUrl,
          price: parseFloat(courseForm.price),
          duration_days: parseInt(courseForm.duration_days) || 30,
        };

        const resultAction = await dispatch(createCourse(courseData));
        if (createCourse.fulfilled.match(resultAction)) {
          showToast("Course created successfully!", "success");
          setIsCourseModalOpen(false);
          setCourseForm({
            title: "",
            description: "",
            price: "",
            duration: "",
            duration_days: "30",
            level: "Beginner",
            category: "",
            icon: "",
            thumbnail_url: "",
            objectives: [],
            curriculum: [],
            tools: [],
            is_active: true,
          });
          setThumbnailFile(null);
          setThumbnailPreview(null);
          fetchCoursesList(courseSearchTerm, coursePagination.currentPage);
        } else {
          showToast(resultAction.payload || "Failed to create course", "error");
        }
      } catch (error) {
        showToast(
          "Failed to create course: " +
            (error.response?.data?.message || error.message),
          "error"
        );
      }
    },
    [
      dispatch,
      courseForm,
      thumbnailFile,
      thumbnailPreview,
      fetchCoursesList,
      courseSearchTerm,
      coursePagination.currentPage,
      showToast,
    ]
  );

  const handleEditCourse = useCallback((course) => {
    setCourseForm({
      title: course.title || "",
      description: course.description || "",
      price: course.price?.toString() || "",
      duration: course.duration || "",
      duration_days: course.duration_days?.toString() || "30",
      level: course.level || "Beginner",
      category: course.category || "",
      icon: course.icon || "",
      thumbnail_url: course.thumbnail_url || "",
      objectives: course.objectives || [],
      curriculum: course.curriculum || [],
      tools: course.tools || [],
      is_active: course.is_active !== undefined ? course.is_active : true,
    });
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setEditingCourseId(course.id);
    setIsCourseModalOpen(true);
  }, []);

  const handleOpenCreateModal = useCallback(() => {
    // Reset form and thumbnail states when opening create modal
    setCourseForm({
      title: "",
      description: "",
      price: "",
      duration: "",
      duration_days: "30",
      level: "Beginner",
      category: "",
      icon: "",
      thumbnail_url: "",
      objectives: [],
      curriculum: [],
      tools: [],
      is_active: true,
    });
    // Clear both file and preview states
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setEditingCourseId(null);
    setIsCourseModalOpen(true);
  }, []);

  const handleUpdateCourse = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        let thumbnailUrl = "";

        // Upload thumbnail file if provided
        if (thumbnailFile) {
          const formData = new FormData();
          formData.append("image", thumbnailFile);

          const uploadResponse = await axios.post(
            "/courses/upload-image",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (uploadResponse.data.success) {
            thumbnailUrl = uploadResponse.data.data.url;
          }
        } else if (
          courseForm.thumbnail_url &&
          courseForm.thumbnail_url.startsWith("data:")
        ) {
          // Convert base64 to blob and upload
          const response = await fetch(courseForm.thumbnail_url);
          const blob = await response.blob();
          const file = new File([blob], "image.jpg", { type: blob.type });

          const formData = new FormData();
          formData.append("image", file);

          const uploadResponse = await axios.post(
            "/courses/upload-image",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (uploadResponse.data.success) {
            thumbnailUrl = uploadResponse.data.data.url;
          }
        } else if (courseForm.thumbnail_url) {
          // Keep existing URL
          thumbnailUrl = courseForm.thumbnail_url;
        }
        // If thumbnail_url is empty, don't send it (keep existing)

        const courseData = {
          ...courseForm,
          thumbnail_url: thumbnailUrl || undefined, // Don't send empty string
          price: parseFloat(courseForm.price),
          duration_days: parseInt(courseForm.duration_days) || 30,
        };

        const resultAction = await dispatch(
          updateCourse({ id: editingCourseId, courseData })
        );
        if (updateCourse.fulfilled.match(resultAction)) {
          showToast("Course updated successfully!", "success");
          setIsCourseModalOpen(false);
          setEditingCourseId(null);
          setCourseForm({
            title: "",
            description: "",
            price: "",
            duration: "",
            duration_days: "30",
            level: "Beginner",
            category: "",
            icon: "",
            thumbnail_url: "",
            objectives: [],
            curriculum: [],
            tools: [],
            is_active: true,
          });
          setThumbnailFile(null);
          setThumbnailPreview(null);
          fetchCoursesList(courseSearchTerm, coursePagination.currentPage);
        } else {
          showToast(resultAction.payload || "Failed to update course", "error");
        }
      } catch (error) {
        showToast(
          "Failed to update course: " +
            (error.response?.data?.message || error.message),
          "error"
        );
      }
    },
    [
      dispatch,
      courseForm,
      thumbnailFile,
      editingCourseId,
      fetchCoursesList,
      courseSearchTerm,
      coursePagination.currentPage,
      showToast,
    ]
  );

  const handleDeleteCourse = useCallback(
    (courseId) => {
      setConfirmDialog({
        isOpen: true,
        title: "Delete Course",
        message:
          "Are you sure you want to delete this course? This action cannot be undone.",
        type: "danger",
        onConfirm: async () => {
          try {
            const resultAction = await dispatch(deleteCourse(courseId));
            if (deleteCourse.fulfilled.match(resultAction)) {
              showToast("Course deleted successfully!", "success");
              fetchCoursesList(courseSearchTerm, coursePagination.currentPage);
            } else {
              showToast(
                resultAction.payload || "Failed to delete course",
                "error"
              );
            }
          } catch {
            showToast("Failed to delete course", "error");
          }
        },
      });
    },
    [
      dispatch,
      fetchCoursesList,
      courseSearchTerm,
      coursePagination.currentPage,
      showToast,
    ]
  );

  const handleToggleCourseStatus = useCallback(
    (courseId, isActive) => {
      setConfirmDialog({
        isOpen: true,
        title: `${isActive ? "Activate" : "Deactivate"} Course`,
        message: `Are you sure you want to ${
          isActive ? "activate" : "deactivate"
        } this course? ${
          !isActive
            ? "Students will no longer be able to enroll."
            : "Students will be able to enroll in this course."
        }`,
        type: isActive ? "success" : "warning",
        onConfirm: async () => {
          try {
            const response = await axios.patch(
              `/courses/${courseId}/toggle-status`,
              { is_active: isActive }
            );

            if (response.data.success) {
              showToast(
                `Course ${
                  isActive ? "activated" : "deactivated"
                } successfully!`,
                "success"
              );
              fetchCoursesList(courseSearchTerm, coursePagination.currentPage);
            }
          } catch (error) {
            showToast(
              error.response?.data?.message || "Failed to update course status",
              "error"
            );
          }
        },
      });
    },
    [
      fetchCoursesList,
      courseSearchTerm,
      coursePagination.currentPage,
      showToast,
    ]
  );

  return {
    courses,
    courseSearchTerm,
    coursePagination,
    isCourseModalOpen,
    courseForm,
    editingCourseId,
    objectiveInput,
    curriculumInput,
    toolInput,
    thumbnailFile,
    thumbnailPreview,
    confirmDialog,
    setCourses,
    setCourseSearchTerm,
    setCoursePagination,
    setIsCourseModalOpen,
    setCourseForm,
    setEditingCourseId,
    setObjectiveInput,
    setCurriculumInput,
    setToolInput,
    setThumbnailFile,
    setThumbnailPreview,
    setConfirmDialog,
    fetchCoursesList,
    handleCourseSearch,
    handleCoursePageChange,
    handleCreateCourse,
    handleEditCourse,
    handleOpenCreateModal,
    handleUpdateCourse,
    handleDeleteCourse,
    handleToggleCourseStatus,
    toast,
    hideToast,
  };
};
