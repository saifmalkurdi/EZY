import { useState, useCallback } from "react";
import axios from "../api/axios";

export const usePurchases = () => {
  const [myPlans, setMyPlans] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const fetchPurchases = useCallback(async (user) => {
    if (!user || user.role === "admin") return;

    setPurchaseLoading(true);
    try {
      if (user.role === "customer") {
        const [plansResponse, coursesResponse] = await Promise.all([
          axios.get("/purchases/my/plans"),
          axios.get("/purchases/my/courses"),
        ]);
        setMyPlans(plansResponse.data.data || []);
        setMyCourses(coursesResponse.data.data || []);
      } else if (user.role === "teacher") {
        const revenueResponse = await axios.get("/purchases/my/revenue");
        setRevenue(revenueResponse.data.data || null);
      }
    } catch {
      // Handle silently
    } finally {
      setPurchaseLoading(false);
    }
  }, []);

  const refreshRevenue = useCallback(async () => {
    try {
      const revenueResponse = await axios.get("/purchases/my/revenue");
      setRevenue(revenueResponse.data.data || null);
    } catch {
      // Handle silently
    }
  }, []);

  return {
    myPlans,
    myCourses,
    revenue,
    purchaseLoading,
    setMyPlans,
    setMyCourses,
    setRevenue,
    setPurchaseLoading,
    fetchPurchases,
    refreshRevenue,
  };
};
