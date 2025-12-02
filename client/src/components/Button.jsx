import { Link } from "react-router-dom";
import { memo } from "react";

function Button({
  children,
  variant = "primary",
  to,
  onClick,
  type = "button",
  disabled,
  className = "",
}) {
  const baseStyles =
    "px-6 py-3 rounded-[8px] font-semibold text-[15px] transition-all duration-300 inline-flex items-center justify-center text-center cursor-pointer";

  const variants = {
    primary:
      "bg-[#F98149] text-white border-2 border-[#F98149] hover:bg-[#e55a2a] hover:border-[#e55a2a] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#F98149] w-[183px]",
    outline:
      "bg-white text-[#F98149] border-2 border-[#F98149] hover:bg-[#e55a2a] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed w-[183px]",
    secondary:
      "bg-[#003F7D] text-white border-2 border-[#003F7D] hover:bg-[#002d5c] hover:border-[#002d5c] disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const buttonClass = `${baseStyles} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={buttonClass}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
    >
      {children}
    </button>
  );
}

export default memo(Button);
