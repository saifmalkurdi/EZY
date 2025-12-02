import React from "react";

const AccountActions = ({ onLogout, onDeleteAccount, teacherLoading }) => {
  return (
    <div className="flex gap-4 mt-8">
      <button
        type="button"
        onClick={onLogout}
        className="px-8 py-3 rounded bg-white border border-orange-500 text-orange-600 font-semibold hover:bg-orange-50 transition-colors shadow cursor-pointer"
      >
        Logout
      </button>
      <button
        className="px-8 py-3 rounded bg-red-500 border border-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onDeleteAccount}
        disabled={teacherLoading}
      >
        {teacherLoading ? "Deleting..." : "Delete My Account"}
      </button>
    </div>
  );
};

export default AccountActions;
