import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, clearError } from "../store/slices/authSlice";
import Button from "../components/Button";
import google from "../assets/images/google.svg";
import facebook from "../assets/images/facebook.png";
import apple from "../assets/images/apple.svg";
import Frame from "../assets/images/Frame.png";

function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    remember: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        registerUser({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          role: "customer",
        })
      );
      if (registerUser.fulfilled.match(resultAction)) {
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      }
    } catch (err) {
      // Error is handled by Redux
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-[1400px] mx-auto px-8 py-16 pt-50 items-center">
      <div className="flex items-center justify-center">
        <div className="w-[585px] min-h-[800px] bg-white p-12 rounded-[43px] shadow-lg">
          <h1 className="text-[32px] text-center font-bold text-[#003D7A] mb-8">
            Create <span className="text-[#F98149]">Account</span>
          </h1>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-5">
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border-b border-black-500 border-opacity-50 text-[15px] focus:outline-none focus:border-[#F98149] transition-colors"
              />
            </div>

            <div className="mb-5">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border-b border-black-500 border-opacity-50 text-[15px] focus:outline-none focus:border-[#FF6B35] transition-colors"
              />
            </div>

            <div className="mb-5">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border-b border-black-500 border-opacity-50 text-[15px] focus:outline-none focus:border-[#F98149] transition-colors"
              />
            </div>

            <div className="flex items-center mb-6">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="cursor-pointer"
                />
                Remember Me
              </label>
            </div>

            <div className="flex justify-center flex-col items-center gap-4 ">
              <Button
                type="submit"
                disabled={loading}
                variant="secondary"
                className="w-[175px] h-[38px] py-4 text-base"
              >
                {loading ? "Loading..." : "Create Account"}
              </Button>

              <p className="text-sm text-gray-600 text-center">
                Already Created?{" "}
                <Link to="/login" className=" font-semibold hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </form>

          <div className="flex items-center justify-center gap-4 my-6">
            <div className="w-[121.49px] border-t border-gray-300"></div>
            <span className="text-sm text-gray-400">or</span>
            <div className="w-[121.49px] border-t border-gray-300"></div>
          </div>

          <div className="flex gap-4 mb-6">
            <button className="w-full px-4 py-3.5 bg-[#F3F3F3] border  border-gray-300 rounded-lg font-medium text-[15px] flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer">
              <img src={google} alt="Google icon" className="w-5 h-5" />
              Sign in
            </button>

            <button className="w-full px-4 py-3.5 border border-gray-300 rounded-lg font-medium text-[15px] flex items-center justify-center gap-3  bg-[#3575DC] hover:bg-[#2868c7] transition-colors cursor-pointer">
              <img src={facebook} alt="Facebook icon" className="w-5 h-5" />
              Sign in
            </button>

            <button className="w-full px-4 py-3.5 bg-[#404040] text-white rounded-lg font-medium text-[15px] flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors cursor-pointer">
              <img src={apple} alt="Apple icon" className="w-5 h-5" />
              Sign in
            </button>
          </div>

          <p className="text-center text-[13px] w-[268px] mx-auto text-gray-600  leading-relaxed mb-4">
            By continuing you agree to the{" "}
            <Link to="/terms" className="text-[#FF6B35] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-[#FF6B35] hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center">
        <img src={Frame} alt="Frame" className="w-full" />
      </div>
    </div>
  );
}

export default Register;
