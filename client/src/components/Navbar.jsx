import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser, logout } from "../store/slices/authSlice";
import { useUser } from "../contexts/UserContext";
import { useNotifications } from "../contexts/NotificationContext";
import Button from "./Button";
import NotificationDropdown from "./NotificationDropdown";
import logo from "../assets/images/logo.png";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  // Use shared notification context
  const notifications = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
    } catch {
      // API call failed, but still logout locally
    }
    dispatch(logout());
    setShowDropdown(false);
    navigate("/");
  };

  const isCourseDetail = location.pathname.startsWith("/course/");
  const isFAQ = location.pathname === "/faq";
  const isContact = location.pathname === "/contact";
  const isPricing = location.pathname === "/pricing";

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Course Selector", path: "/course-selector" },
    { name: "Courses", path: "/courses" },
    { name: "Pricing", path: "/pricing" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact us", path: "/contact" },
  ];

  return (
    <nav
      className={`py-4 px-4 md:px-8 ${
        isDashboard ? "fixed bg-white shadow-md" : "absolute"
      } top-0 left-0 right-0 z-50`}
    >
      <div className="flex items-center justify-between max-w-[1400px] mx-auto">
        <NavLink to="/" className="shrink-0">
          <img src={logo} alt="EZY Skills" className="h-12 md:h-16 w-auto" />
        </NavLink>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 mx-8">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? `text-sm font-bold cursor-pointer ${
                        isCourseDetail || isFAQ || isContact || isPricing
                          ? "text-white"
                          : "text-[#F2831F]"
                      } transition-colors duration-300 whitespace-nowrap`
                    : `text-sm font-medium cursor-pointer ${
                        isCourseDetail || isFAQ || isContact || isPricing
                          ? "text-gray-200 hover:text-white"
                          : "text-gray-600 hover:text-[#F98149]"
                      } transition-colors duration-300 whitespace-nowrap`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {isAuthenticated ? (
            <>
              {/* Notification Icon - Only on Dashboard */}
              {isDashboard && notifications && (
                <NotificationDropdown
                  notifications={notifications.notifications || []}
                  unreadCount={notifications.unreadCount || 0}
                  notificationLoading={
                    notifications.notificationLoading || false
                  }
                  onMarkAsRead={notifications.handleMarkAsRead}
                  onMarkAllAsRead={notifications.handleMarkAllAsRead}
                  onDeleteNotification={notifications.handleDeleteNotification}
                  onClearAll={notifications.clearAllNotifications}
                />
              )}
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Settings"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#666"
                  strokeWidth="2"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" fill="#666" />
                    <path
                      d="M4 20c0-4 3.5-7 8-7s8 3 8 7"
                      stroke="#666"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/dashboard");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FF6B35]/10 cursor-pointer transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#FF6B35]/10 cursor-pointer transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                to="/login"
                className={
                  isCourseDetail || isFAQ || isContact || isPricing
                    ? "bg-transparent! text-white! border-white! hover:bg-transparent! hover:text-white!"
                    : ""
                }
              >
                Log In
              </Button>
              <Button
                variant={
                  isCourseDetail || isFAQ || isContact || isPricing
                    ? "outline"
                    : "primary"
                }
                to="/register"
                className={
                  isCourseDetail || isFAQ || isContact || isPricing
                    ? "bg-white! text-black! border-0! border-transparent! hover:bg-white! hover:text-black!"
                    : ""
                }
              >
                Create Account
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {isMobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "block text-sm font-bold text-[#F2831F] transition-colors duration-300"
                      : "block text-sm font-medium text-gray-600 hover:text-[#F98149] transition-colors duration-300"
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-2 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    {user.full_name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/dashboard");
                  }}
                  className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-[#FF6B35]/10 rounded cursor-pointer transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-[#FF6B35]/10 rounded cursor-pointer transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  to="/login"
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Button>
                <Button
                  variant="primary"
                  to="/register"
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create Account
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
