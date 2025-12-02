import React from "react";
import Modal from "../Modal";

const TeacherModal = ({
  isOpen,
  onClose,
  onSubmit,
  teacherForm,
  setTeacherForm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Teacher Account">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={teacherForm.full_name}
            onChange={(e) =>
              setTeacherForm({ ...teacherForm, full_name: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={teacherForm.email}
            onChange={(e) =>
              setTeacherForm({ ...teacherForm, email: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={teacherForm.password}
            onChange={(e) =>
              setTeacherForm({ ...teacherForm, password: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={teacherForm.phone}
            onChange={(e) =>
              setTeacherForm({ ...teacherForm, phone: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-[#003D7A] text-white rounded-md hover:bg-[#002855]"
          >
            Create Teacher
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TeacherModal;
