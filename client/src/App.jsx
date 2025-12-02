import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import { UserProvider } from "./contexts/UserContext";
import { NotificationProvider } from "./contexts/NotificationContext";

// Lazy load page components for better performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CourseSelector = lazy(() => import("./pages/CourseSelector"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const FAQ = lazy(() => import("./pages/FAQ"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Pricing = lazy(() => import("./pages/Pricing"));

function App() {
  const token = useSelector((state) => state.auth.token);

  return (
    <UserProvider>
      <NotificationProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8B36]"></div>
            </div>
          }
        >
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/course-selector" element={<CourseSelector />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route
                path="/login"
                element={!token ? <Login /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/register"
                element={!token ? <Register /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/dashboard"
                element={token ? <Dashboard /> : <Navigate to="/login" />}
              />
            </Route>
          </Routes>
        </Suspense>
      </NotificationProvider>
    </UserProvider>
  );
}

export default App;
