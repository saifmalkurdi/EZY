import React from "react";

const UserProfile = ({ user }) => {
  if (!user) return null;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
      <h3 className="text-2xl font-semibold text-[#003D7A] mb-4">
        Welcome, {user.full_name}!
      </h3>
      <p className="text-gray-600 mb-2">
        <span className="font-medium">Email:</span> {user.email}
      </p>
      <p className="text-gray-600">
        <span className="font-medium">Role:</span> {user.role}
      </p>
    </div>
  );
};

export default UserProfile;
