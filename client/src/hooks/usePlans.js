import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { createPlan, updatePlan, deletePlan } from "../store/slices/planSlice";
import axios from "../api/axios";
import { useToast } from "./useToast";

export const usePlans = () => {
  const dispatch = useDispatch();
  const { toast, showToast, hideToast } = useToast();

  const [plans, setPlans] = useState([]);
  const [planSearchTerm, setPlanSearchTerm] = useState("");
  const [planPagination, setPlanPagination] = useState({
    currentPage: 1,
    limit: 3,
    total: 0,
    totalPages: 1,
  });

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planForm, setPlanForm] = useState({
    title: "",
    description: "",
    price: "",
    price_note: "",
    gst_note: "",
    features: [],
    button_text: "Choose Plan",
    duration_days: "30",
    is_highlighted: false,
  });
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [featureInput, setFeatureInput] = useState({ text: "", icon: "" });

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger",
  });

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

  const handlePlanSearch = useCallback(
    (search) => {
      setPlanSearchTerm(search);
      setPlanPagination((prev) => ({ ...prev, currentPage: 1 }));
      fetchPlansList(search, 1);
    },
    [fetchPlansList]
  );

  const handlePlanPageChange = useCallback(
    (page) => {
      fetchPlansList(planSearchTerm, page);
    },
    [fetchPlansList, planSearchTerm]
  );

  const handleCreatePlan = useCallback(
    async (e) => {
      e.preventDefault();

      const planData = {
        ...planForm,
        price: parseFloat(planForm.price),
        duration_days: parseInt(planForm.duration_days) || 30,
      };

      try {
        const resultAction = await dispatch(createPlan(planData));
        if (createPlan.fulfilled.match(resultAction)) {
          showToast("Plan created successfully!", "success");
          setIsPlanModalOpen(false);
          setPlanForm({
            title: "",
            description: "",
            price: "",
            price_note: "",
            gst_note: "",
            features: [],
            button_text: "Choose Plan",
            duration_days: "30",
            is_highlighted: false,
          });
          fetchPlansList(planSearchTerm, planPagination.currentPage);
        } else {
          showToast(resultAction.payload || "Failed to create plan", "error");
        }
      } catch {
        showToast("Failed to create plan", "error");
      }
    },
    [
      dispatch,
      planForm,
      fetchPlansList,
      planSearchTerm,
      planPagination.currentPage,
      showToast,
    ]
  );

  const handleEditPlan = useCallback((plan) => {
    setPlanForm({
      title: plan.title || "",
      description: plan.description || "",
      price: plan.price?.toString() || "",
      price_note: plan.price_note || "",
      gst_note: plan.gst_note || "",
      features: plan.features || [],
      button_text: plan.button_text || "Choose Plan",
      duration_days: plan.duration_days?.toString() || "30",
      is_highlighted: plan.is_highlighted || false,
    });
    setEditingPlanId(plan.id);
    setIsPlanModalOpen(true);
  }, []);

  const handleDeletePlan = useCallback(
    (planId) => {
      setConfirmDialog({
        isOpen: true,
        title: "Delete Plan",
        message:
          "Are you sure you want to delete this plan? This action cannot be undone and will affect all users subscribed to this plan.",
        type: "danger",
        onConfirm: async () => {
          try {
            const resultAction = await dispatch(deletePlan(planId));
            if (deletePlan.fulfilled.match(resultAction)) {
              showToast("Plan deleted successfully!", "success");
              fetchPlansList(planSearchTerm, planPagination.currentPage);
            } else {
              showToast(
                resultAction.payload || "Failed to delete plan",
                "error"
              );
            }
          } catch {
            showToast("Failed to delete plan", "error");
          }
        },
      });
    },
    [
      dispatch,
      fetchPlansList,
      planSearchTerm,
      planPagination.currentPage,
      showToast,
    ]
  );

  const handleUpdatePlan = useCallback(
    async (e) => {
      e.preventDefault();

      const planData = {
        ...planForm,
        price: parseFloat(planForm.price),
        duration_days: parseInt(planForm.duration_days) || 30,
      };

      try {
        const resultAction = await dispatch(
          updatePlan({ id: editingPlanId, planData })
        );
        if (updatePlan.fulfilled.match(resultAction)) {
          showToast("Plan updated successfully!", "success");
          setIsPlanModalOpen(false);
          setEditingPlanId(null);
          setPlanForm({
            title: "",
            description: "",
            price: "",
            price_note: "",
            gst_note: "",
            features: [],
            button_text: "Choose Plan",
            duration_days: "30",
            is_highlighted: false,
          });
          fetchPlansList(planSearchTerm, planPagination.currentPage);
        } else {
          showToast(resultAction.payload || "Failed to update plan", "error");
        }
      } catch {
        showToast("Failed to update plan", "error");
      }
    },
    [
      dispatch,
      planForm,
      editingPlanId,
      fetchPlansList,
      planSearchTerm,
      planPagination.currentPage,
      showToast,
    ]
  );

  const handleTogglePlanStatus = useCallback(
    (planId, currentStatus) => {
      const isActive = !currentStatus;
      setConfirmDialog({
        isOpen: true,
        title: `${isActive ? "Activate" : "Deactivate"} Plan`,
        message: `Are you sure you want to ${
          isActive ? "activate" : "deactivate"
        } this plan? ${
          !isActive
            ? "Users will no longer be able to purchase this plan."
            : "Users will be able to purchase this plan."
        }`,
        type: isActive ? "success" : "warning",
        onConfirm: async () => {
          try {
            const response = await axios.patch(
              `/plans/${planId}/toggle-status`
            );
            if (response.data.success) {
              showToast(response.data.message, "success");
              fetchPlansList(planSearchTerm, planPagination.currentPage);
            } else {
              showToast("Failed to toggle plan status", "error");
            }
          } catch (error) {
            showToast(
              error.response?.data?.message || "Failed to toggle plan status",
              "error"
            );
          }
        },
      });
    },
    [fetchPlansList, planSearchTerm, planPagination.currentPage, showToast]
  );

  return {
    plans,
    planSearchTerm,
    planPagination,
    isPlanModalOpen,
    planForm,
    editingPlanId,
    featureInput,
    confirmDialog,
    setPlans,
    setPlanSearchTerm,
    setPlanPagination,
    setIsPlanModalOpen,
    setPlanForm,
    setEditingPlanId,
    setFeatureInput,
    setConfirmDialog,
    fetchPlansList,
    handlePlanSearch,
    handlePlanPageChange,
    handleCreatePlan,
    handleEditPlan,
    handleDeletePlan,
    handleUpdatePlan,
    handleTogglePlanStatus,
    toast,
    hideToast,
  };
};
