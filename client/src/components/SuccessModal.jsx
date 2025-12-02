import Modal from "./Modal";
import Button from "./Button";

function SuccessModal({
  isOpen,
  onClose,
  message = "Thanks for your interest",
  subMessage = "we will get back to you soon",
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#A3D977] rounded-full flex items-center justify-center animate-scale-in">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-[#003D7A] mb-2">{message}</h2>
        <p className="text-gray-600 mb-8">{subMessage}</p>

        {/* OK Button */}
        <Button variant="primary" onClick={onClose} className="px-12">
          Ok
        </Button>
      </div>

      {/* Move animation CSS to global or module CSS file */}
    </Modal>
  );
}

export default SuccessModal;
