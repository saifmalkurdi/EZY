import { useState, useEffect } from "react";
import purchaseService from "../../api/purchaseService";

const PendingRequests = () => {
  const [pendingCourses, setPendingCourses] = useState([]);
  const [pendingPlans, setPendingPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const [coursesResponse, plansResponse] = await Promise.all([
        purchaseService.getMyPendingCourses(),
        purchaseService.getMyPendingPlans(),
      ]);
      setPendingCourses(coursesResponse.data || []);
      setPendingPlans(plansResponse.data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const totalPending = pendingCourses.length + pendingPlans.length;

  if (totalPending === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Pending Approval Requests
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              You have {totalPending} pending{" "}
              {totalPending === 1 ? "request" : "requests"} waiting for
              approval:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {pendingCourses.map((course) => (
                <li key={course.id}>
                  <span className="font-medium">{course.title}</span> - Waiting
                  for teacher approval
                </li>
              ))}
              {pendingPlans.map((plan) => (
                <li key={plan.id}>
                  <span className="font-medium">{plan.title}</span> - Waiting
                  for admin approval
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingRequests;
