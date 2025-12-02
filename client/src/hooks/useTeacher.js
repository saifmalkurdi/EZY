import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { createTeacher } from "../store/slices/authSlice";
import { useToast } from "./useToast";

export const useTeacher = () => {
  const dispatch = useDispatch();
  const { toast, showToast, hideToast } = useToast();

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [teacherForm, setTeacherForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
  });

  const handleCreateTeacher = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const resultAction = await dispatch(createTeacher(teacherForm));
        if (createTeacher.fulfilled.match(resultAction)) {
          showToast("Teacher account created successfully!", "success");
          setIsTeacherModalOpen(false);
          setTeacherForm({
            email: "",
            password: "",
            full_name: "",
            phone: "",
          });
        } else {
          showToast(
            resultAction.payload || "Failed to create teacher account",
            "error"
          );
        }
      } catch {
        showToast("Failed to create teacher account", "error");
      }
    },
    [dispatch, teacherForm, showToast]
  );

  return {
    isTeacherModalOpen,
    teacherForm,
    setIsTeacherModalOpen,
    setTeacherForm,
    handleCreateTeacher,
    toast,
    hideToast,
  };
};
