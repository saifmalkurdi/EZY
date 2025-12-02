import React from "react";
import Modal from "../Modal";

const PlanModal = ({
  isOpen,
  onClose,
  onSubmit,
  planForm,
  setPlanForm,
  featureInput,
  setFeatureInput,
  editingPlanId,
}) => {
  const addFeature = () => {
    if (featureInput.text.trim()) {
      setPlanForm({
        ...planForm,
        features: [...planForm.features, featureInput],
      });
      setFeatureInput({ text: "", icon: "" });
    }
  };

  const removeFeature = (index) => {
    setPlanForm({
      ...planForm,
      features: planForm.features.filter((_, i) => i !== index),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPlanId ? "Edit Plan" : "Create New Plan"}
      className="max-w-2xl"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            required
            value={planForm.title}
            onChange={(e) =>
              setPlanForm({ ...planForm, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              required
              step="0.01"
              value={planForm.price}
              onChange={(e) =>
                setPlanForm({ ...planForm, price: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (days)
            </label>
            <input
              type="number"
              required
              value={planForm.duration_days}
              onChange={(e) =>
                setPlanForm({ ...planForm, duration_days: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={planForm.is_highlighted}
              onChange={(e) =>
                setPlanForm({ ...planForm, is_highlighted: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Highlighted Plan
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Feature text"
              value={featureInput.text}
              onChange={(e) =>
                setFeatureInput({ ...featureInput, text: e.target.value })
              }
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <ul className="space-y-1">
            {planForm.features.map((feature, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span>{feature.text}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-[#003D7A] text-white rounded-md hover:bg-[#002855]"
          >
            {editingPlanId ? "Update Plan" : "Create Plan"}
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

export default PlanModal;
