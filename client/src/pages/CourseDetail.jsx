import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseById } from "../store/slices/courseSlice";
import { purchaseCourse } from "../store/slices/purchaseSlice";
import { getImageUrl } from "../utils/imageUtils";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";
import Button from "../components/Button";
import CourseEnquiryModal from "../components/CourseEnquiryModal";
import CloudDownloadIcon from "../components/icons/CloudDownloadIcon";
import bg from "../assets/images/bg.png";
import dots5 from "../assets/illustrations/dots5.svg";
import angular from "../assets/logos/angular.svg";
import react from "../assets/logos/react.svg";
import vue from "../assets/logos/vue.svg";
import python from "../assets/logos/python.svg";
import coreui from "../assets/logos/coreui.svg";
import aws from "../assets/logos/aws.svg";
import powerBi from "../assets/logos/powerBi.svg";
import testing from "../assets/logos/testing.svg";
import pin from "../assets/icons/pin.svg";
import screen from "../assets/icons/screen.svg";

const courseLogos = {
  "angular.svg": angular,
  "react.svg": react,
  "vue.svg": vue,
  "python.svg": python,
  "coreui.svg": coreui,
  "aws.svg": aws,
  "powerBi.svg": powerBi,
  "testing.svg": testing,
};

function CourseDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCourse, loading, error } = useSelector(
    (state) => state.courses
  );
  const { user } = useSelector((state) => state.auth);
  const { loading: purchasing } = useSelector((state) => state.purchase);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const { toast, showToast, hideToast } = useToast();

  const handleEnrollNow = async () => {
    if (!user) {
      showToast("Please login to enroll in this course", "error");
      navigate("/login");
      return;
    }

    if (user.role !== "customer") {
      showToast("Only customers can purchase courses", "error");
      return;
    }

    if (!selectedCourse) return;

    if (confirm(`Confirm enrollment in ${selectedCourse.title}?`)) {
      try {
        const result = await dispatch(purchaseCourse(selectedCourse.id));
        if (purchaseCourse.fulfilled.match(result)) {
          showToast(
            "Enrollment request submitted! You will get access after teacher approval. Check your dashboard for status.",
            "success"
          );
          navigate("/dashboard");
        } else {
          showToast(
            result.payload || "Failed to submit enrollment request",
            "error"
          );
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        showToast("Failed to submit enrollment request", "error");
      }
    }
  };

  useEffect(() => {
    if (id) {
      // Validate that ID is numeric
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId) && numericId > 0) {
        dispatch(fetchCourseById(numericId));
      }
    }
  }, [dispatch, id]);

  // Get course logo: prioritize thumbnail_url, fallback to icon
  const courseLogo = selectedCourse?.thumbnail_url
    ? getImageUrl(selectedCourse.thumbnail_url)
    : selectedCourse?.icon
    ? courseLogos[selectedCourse.icon]
    : null;

  // Dynamic course content based on course type
  const getCourseContent = (course) => {
    const courseType =
      course?.icon || course?.title?.toLowerCase() || "angular";

    if (courseType.includes("angular") || courseType.includes("Angular")) {
      return [
        {
          id: 1,
          title: "HTML",
          topics: [
            "Introduction",
            "What is Application?",
            "Tags & Attributes",
            "Programming",
            "Audio",
            "Video",
            "Graphics",
          ],
        },
        { id: 2, title: "CSS" },
        { id: 3, title: "Bootstrap" },
        { id: 4, title: "Javascript" },
        { id: 5, title: "DOM" },
        { id: 6, title: "Angular JS" },
        { id: 7, title: "Environment" },
        { id: 8, title: "MVC Architecture" },
        { id: 9, title: "Directives" },
        { id: 10, title: "Modules" },
        { id: 11, title: "Dependency Injection" },
      ];
    } else if (courseType.includes("react") || courseType.includes("React")) {
      return [
        {
          id: 1,
          title: "HTML & CSS Fundamentals",
          topics: ["HTML5", "CSS3", "Responsive Design", "Flexbox", "Grid"],
        },
        { id: 2, title: "JavaScript ES6+" },
        { id: 3, title: "React Fundamentals" },
        { id: 4, title: "Components & Props" },
        { id: 5, title: "State Management" },
        { id: 6, title: "Hooks" },
        { id: 7, title: "React Router" },
        { id: 8, title: "Context API" },
        { id: 9, title: "Redux Toolkit" },
        { id: 10, title: "API Integration" },
        { id: 11, title: "Testing" },
        { id: 12, title: "Deployment" },
      ];
    } else if (courseType.includes("python") || courseType.includes("Python")) {
      return [
        {
          id: 1,
          title: "Python Basics",
          topics: ["Variables", "Data Types", "Operators", "Control Flow"],
        },
        { id: 2, title: "Data Structures" },
        { id: 3, title: "Functions" },
        { id: 4, title: "Object-Oriented Programming" },
        { id: 5, title: "File Handling" },
        { id: 6, title: "Exception Handling" },
        { id: 7, title: "Modules & Packages" },
        { id: 8, title: "Data Analysis" },
        { id: 9, title: "Web Development" },
        { id: 10, title: "Machine Learning" },
        { id: 11, title: "API Development" },
        { id: 12, title: "Database Integration" },
      ];
    } else if (courseType.includes("vue") || courseType.includes("Vue")) {
      return [
        {
          id: 1,
          title: "HTML & CSS",
          topics: ["HTML5", "CSS3", "SCSS/SASS", "Responsive Design"],
        },
        { id: 2, title: "JavaScript Fundamentals" },
        { id: 3, title: "Vue.js Basics" },
        { id: 4, title: "Vue Components" },
        { id: 5, title: "Vue Router" },
        { id: 6, title: "Vuex (State Management)" },
        { id: 7, title: "Composition API" },
        { id: 8, title: "Vue CLI" },
        { id: 9, title: "API Integration" },
        { id: 10, title: "Testing" },
        { id: 11, title: "Build & Deployment" },
      ];
    } else {
      // Default content
      return [
        {
          id: 1,
          title: "Fundamentals",
          topics: ["Introduction", "Setup", "Basic Concepts"],
        },
        { id: 2, title: "Core Concepts" },
        { id: 3, title: "Advanced Topics" },
        { id: 4, title: "Projects" },
        { id: 5, title: "Best Practices" },
      ];
    }
  };

  const courseContent = getCourseContent(selectedCourse);

  // Dynamic objectives based on course type
  const getCourseObjectives = (course) => {
    const courseType =
      course?.icon || course?.title?.toLowerCase() || "angular";

    if (courseType.includes("angular") || courseType.includes("Angular")) {
      return [
        "Utilizing AngularJS formats adequately",
        "Questioning and adjusting information in various structures including getting to be plainly gifted with the API",
        "Quickly making perplexing structures",
        "Understanding two-way data binding",
        "Presenting route usefulness in web applications",
        "Overseeing conditions with Injection frameworks",
        "Securing web applications from dangers and pernicious clients",
        "Building different AngularJS orders",
        "Organizing the web application utilizing the vigorous index structure",
        "Organizing, composing, and ultimately sending the application",
      ];
    } else if (courseType.includes("react") || courseType.includes("React")) {
      return [
        "Master React fundamentals and component-based architecture",
        "Implement state management with hooks and context",
        "Build responsive user interfaces with modern CSS",
        "Integrate with REST APIs and handle asynchronous operations",
        "Apply best practices for performance optimization",
        "Implement routing and navigation in React applications",
        "Write clean, maintainable, and testable React code",
        "Deploy React applications to production environments",
        "Work with popular React libraries and tools",
        "Build real-world projects from concept to deployment",
      ];
    } else if (courseType.includes("python") || courseType.includes("Python")) {
      return [
        "Master Python programming fundamentals and syntax",
        "Implement data structures and algorithms efficiently",
        "Build web applications with Flask/Django frameworks",
        "Work with databases and implement data persistence",
        "Apply Python in data analysis and machine learning",
        "Develop REST APIs and microservices",
        "Implement automated testing and debugging techniques",
        "Deploy Python applications to production servers",
        "Follow Python best practices and coding standards",
        "Build scalable and maintainable Python applications",
      ];
    } else if (courseType.includes("vue") || courseType.includes("Vue")) {
      return [
        "Master Vue.js fundamentals and reactive data binding",
        "Build component-based user interfaces",
        "Implement state management with Vuex",
        "Create single-page applications with Vue Router",
        "Apply modern CSS frameworks and styling techniques",
        "Integrate with REST APIs and handle data fetching",
        "Implement form validation and user input handling",
        "Optimize Vue applications for performance",
        "Write unit and integration tests for Vue components",
        "Deploy Vue applications to production environments",
      ];
    } else {
      return [
        "Master fundamental concepts and best practices",
        "Build practical projects and real-world applications",
        "Implement industry-standard development workflows",
        "Apply modern development tools and technologies",
        "Develop problem-solving and debugging skills",
        "Create maintainable and scalable code",
        "Work effectively in development teams",
        "Deploy applications to production environments",
        "Stay updated with latest industry trends",
        "Build a strong portfolio of completed projects",
      ];
    }
  };

  const objectives = getCourseObjectives(selectedCourse);

  // Dynamic projects based on course type
  const getCourseProjects = (course) => {
    const courseType =
      course?.icon || course?.title?.toLowerCase() || "angular";

    if (courseType.includes("angular") || courseType.includes("Angular")) {
      return [
        {
          title: "Angular Hello World Project",
          description:
            "Hello, World offers a tremendous approach to start with AngularJS. We will start with Angular and Typescript.",
        },
        {
          title: "Angular Bare Bones Project",
          description:
            "Learn the fundamental structure and core concepts of Angular applications from the ground up.",
        },
        {
          title: "Data Binding in Forms",
          description:
            "Master Angular's powerful data binding capabilities and form handling techniques.",
        },
        {
          title: "Angular Projects On Local Storage",
          description:
            "Build applications that persist data using browser local storage with Angular.",
        },
        {
          title: "Angular5 in Patterns",
          description:
            "Explore advanced design patterns and best practices in Angular 5 development.",
        },
        {
          title: "NgRX Libraries",
          description:
            "Implement state management using NgRX for complex Angular applications.",
        },
        {
          title: "Admin Panel Framework",
          description:
            "Create comprehensive admin dashboards with Angular components and routing.",
        },
        {
          title: "AngularJS in Patterns",
          description:
            "Apply design patterns to create maintainable and scalable AngularJS applications.",
        },
      ];
    } else if (courseType.includes("react") || courseType.includes("React")) {
      return [
        {
          title: "React Todo App",
          description:
            "Build a complete todo application with React hooks, state management, and local storage.",
        },
        {
          title: "E-commerce Product Catalog",
          description:
            "Create a product catalog with shopping cart functionality and search features.",
        },
        {
          title: "Weather Dashboard",
          description:
            "Build a weather application that fetches data from APIs and displays forecasts.",
        },
        {
          title: "Social Media Feed",
          description:
            "Create a social media feed with posts, likes, comments, and user interactions.",
        },
        {
          title: "Task Management System",
          description:
            "Develop a comprehensive task management app with drag-and-drop functionality.",
        },
        {
          title: "Blog Platform",
          description:
            "Build a full-featured blog with user authentication, posts, and comments.",
        },
        {
          title: "Real-time Chat Application",
          description:
            "Create a real-time chat app using React and WebSocket connections.",
        },
        {
          title: "Data Visualization Dashboard",
          description:
            "Build interactive charts and graphs to visualize complex data sets.",
        },
      ];
    } else if (courseType.includes("python") || courseType.includes("Python")) {
      return [
        {
          title: "Python Calculator",
          description:
            "Build a command-line calculator with basic and advanced mathematical operations.",
        },
        {
          title: "File Organizer Script",
          description:
            "Create an automated file organizer that sorts files by type and date.",
        },
        {
          title: "Web Scraper",
          description:
            "Build a web scraper to extract data from websites and store it in databases.",
        },
        {
          title: "Data Analysis Dashboard",
          description:
            "Create visualizations and analysis tools for large datasets using pandas and matplotlib.",
        },
        {
          title: "REST API Server",
          description:
            "Develop a RESTful API server with Flask/Django for web applications.",
        },
        {
          title: "Machine Learning Model",
          description:
            "Build and train machine learning models for prediction and classification tasks.",
        },
        {
          title: "Automated Testing Framework",
          description:
            "Create a comprehensive testing framework for Python applications.",
        },
        {
          title: "Database Management System",
          description:
            "Design and implement a database system with CRUD operations and queries.",
        },
      ];
    } else if (courseType.includes("vue") || courseType.includes("Vue")) {
      return [
        {
          title: "Vue Todo Application",
          description:
            "Build a reactive todo app with Vue's data binding and component system.",
        },
        {
          title: "Vue E-commerce Store",
          description:
            "Create a modern e-commerce platform with Vue components and Vuex.",
        },
        {
          title: "Vue Blog Platform",
          description:
            "Develop a content management system for blogs with Vue Router and Composition API.",
        },
        {
          title: "Vue Dashboard",
          description:
            "Build an admin dashboard with charts, tables, and data visualization.",
        },
        {
          title: "Vue Chat Application",
          description:
            "Create a real-time chat app using Vue and WebSocket technology.",
        },
        {
          title: "Vue Music Player",
          description:
            "Develop a music player with playlist management and audio controls.",
        },
        {
          title: "Vue Task Manager",
          description:
            "Build a project management tool with drag-and-drop task organization.",
        },
        {
          title: "Vue Weather App",
          description:
            "Create a weather application with location-based forecasts and maps.",
        },
      ];
    } else {
      return [
        {
          title: "Getting Started Project",
          description:
            "Build your first application to understand the basic concepts and workflow.",
        },
        {
          title: "Intermediate Project",
          description:
            "Apply intermediate concepts to build more complex applications.",
        },
        {
          title: "Advanced Application",
          description:
            "Create a comprehensive application showcasing advanced techniques.",
        },
        {
          title: "Portfolio Project",
          description:
            "Build a showcase project to demonstrate your skills to potential employers.",
        },
        {
          title: "Real-world Application",
          description:
            "Develop an application that solves a real-world problem or need.",
        },
      ];
    }
  };

  // Dynamic section title based on course type
  const getProjectsSectionTitle = (course) => {
    const courseType =
      course?.icon || course?.title?.toLowerCase() || "angular";

    if (courseType.includes("angular") || courseType.includes("Angular")) {
      return "Angular JS Projects";
    } else if (courseType.includes("react") || courseType.includes("React")) {
      return "React Projects";
    } else if (courseType.includes("python") || courseType.includes("Python")) {
      return "Python Projects";
    } else if (courseType.includes("vue") || courseType.includes("Vue")) {
      return "Vue.js Projects";
    } else {
      return "Course Projects";
    }
  };

  const projectsSectionTitle = getProjectsSectionTitle(selectedCourse);

  const projects = getCourseProjects(selectedCourse);

  const toggleSection = (id) => {
    setOpenSections({ ...openSections, [id]: !openSections[id] });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading course details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Course not found</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section with Navbar integrated */}
      <div
        className="relative overflow-hidden pb-12 md:pb-16 lg:pb-20 rounded-b-[30px] md:rounded-b-[40px] lg:rounded-b-[50px] min-h-[400px] md:min-h-[500px] lg:min-h-[600px]"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-32 md:pt-44 lg:pt-56 pb-8 md:pb-12 lg:pb-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Course Icon */}
            <div className="flex justify-center">
              <div className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-2xl md:rounded-3xl flex items-center justify-center">
                {courseLogo ? (
                  <img
                    src={courseLogo}
                    alt={selectedCourse.title}
                    className="w-24 h-24 md:w-36 md:h-36 lg:w-48 lg:h-48 object-contain"
                  />
                ) : (
                  <svg
                    className="w-24 h-24 md:w-36 md:h-36 lg:w-48 lg:h-48 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Course Title */}
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                <span className="text-[#F98149]">{selectedCourse.title}:</span>
                <br />
                {selectedCourse.level || "Basic to Advance"}
                <br />
                Level Coding
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-start">
          {/* Left Column - About & Objectives */}
          <div className="lg:col-span-7 space-y-8 md:space-y-10 lg:space-y-12">
            {/* About The Course */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-[#F98149] mb-4 md:mb-6">
                About The Course
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                {selectedCourse.description ||
                  "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor"}
              </p>
            </section>

            {/* Objectives */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-[#F98149] mb-4 md:mb-6">
                Objectives
              </h2>
              <div className="space-y-2 md:space-y-3">
                {objectives.map((objective, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-[#46B734] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4 text-[#46B734]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-700 text-xs md:text-sm">
                      {objective}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Course Content */}
          <div className="lg:col-span-5">
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold text-[#F98149] mb-4 md:mb-6">
                Course Content
              </h2>

              {/* Decorative Dots - Top Right - Hidden on mobile */}
              <div className="absolute -right-20 top-20 z-10 hidden xl:block">
                <img src={dots5} alt="Decorative dots" className="w-16 h-60" />
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg max-h-[500px] md:max-h-[600px] overflow-y-auto relative z-10">
                {courseContent.map((section) => (
                  <div
                    key={section.id}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <span className="font-semibold text-[#003D7A] text-sm md:text-base text-left">
                        {String(section.id).padStart(2, "0")} {section.title}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${
                          openSections[section.id] ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openSections[section.id] && section.topics && (
                      <div className="px-4 md:px-5 pb-4 md:pb-5">
                        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-700">
                          {section.topics.map((topic, idx) => (
                            <div key={idx} className="flex items-center">
                              <span>{topic}</span>
                              {idx < section.topics.length - 1 && (
                                <span className="mx-2 font-bold">&gt;&gt;</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Decorative circle - Bottom Left - Hidden on mobile */}
              <div className="absolute -left-16 -bottom-16 w-32 h-32 border-24 border-[#FF914C] rounded-full hidden lg:block"></div>
            </div>
          </div>
        </div>

        {/* Projects Section  */}
        <div className="mt-12 md:mt-14 lg:mt-16">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FF6B35]">
              {projectsSectionTitle}
            </h2>
            <div className="flex-1 h-0.5 bg-[#FF6B35]"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {projects.map((project, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className="p-4 md:p-6">
                  {/* Icon with orange circular background */}
                  <div className="flex justify-start mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FF6B35] rounded-full flex items-center justify-center">
                      {courseLogo ? (
                        <img
                          src={courseLogo}
                          alt={selectedCourse?.title || "Course"}
                          className="w-6 h-6 md:w-8 md:h-8 filter brightness-0 invert"
                        />
                      ) : (
                        <svg
                          className="w-6 h-6 md:w-8 md:h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Project title */}
                  <h3 className="font-bold text-[#003D7A] text-base md:text-lg mb-2 md:mb-3 group-hover:text-[#FF6B35] transition-colors duration-300">
                    {project.title}
                  </h3>

                  {/* Project description */}
                  {project.description && (
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Notice */}
        {user?.role === "customer" && (
          <div className="mt-12 md:mt-14 lg:mt-16 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <div className="flex">
              <div className="shrink-0">
                <svg
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-blue-800">
                  Enrollment Requires Teacher Approval
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Please note: When you enroll in this course, your request
                    will be sent to the teacher for approval. You will receive a
                    notification once your enrollment is approved and gain
                    immediate access to the course content. You can track your
                    enrollment status in your dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section - Wanna check more about the course */}
        <div className="mt-8">
          <div
            className="rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center md:text-left">
                Wanna check more
                <br />
                about the course?
              </h2>
              <div className="flex flex-col gap-3 md:gap-4 w-full md:w-auto">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <button className="w-[276px] px-6 md:px-8 py-3 md:py-4 rounded-3xl font-semibold text-sm md:text-base bg-transparent text-[#FDFDFD] border-2 border-[#F98149] hover:bg-[#FF6B35]  transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <img src={screen} alt="" className=" h-5 md:w-6 md:h-6" />
                    Demo
                  </button>
                  <button
                    onClick={handleEnrollNow}
                    disabled={purchasing}
                    className="w-[276px] px-6 md:px-8 py-3 md:py-4 rounded-3xl font-semibold text-sm md:text-base bg-transparent text-[#FDFDFD] border-2 border-[#F98149] hover:bg-[#FF6B35] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <img src={pin} alt="" className="h-5 md:w-6 md:h-6" />
                    {purchasing ? "Processing..." : "Enroll Now"}
                  </button>
                </div>
                <button
                  className="w-[588px] px-6 md:px-8 py-3 md:py-4 rounded-[31px] font-semibold text-sm md:text-base bg-[#F98149] text-white hover:bg-[#FF6B35] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => setShowEnquiryModal(true)}
                >
                  <CloudDownloadIcon className="w-5 h-5 md:w-6 md:h-6" />
                  Download Curriculum
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tools & Platforms Section */}
        <div className="mt-12 md:mt-14 lg:mt-16 mb-12 md:mb-14 lg:mb-16">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#F98149]">
              Tools & Platforms
            </h2>
            <div className="flex-1 h-0.5 bg-[#FF6B35]"></div>
          </div>
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 md:pb-0 md:justify-between">
            <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-[#003D7A] rounded-full flex items-center justify-center shrink-0">
              <img
                src={coreui}
                alt="UI"
                className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16"
              />
            </div>
            <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-[#003D7A] rounded-full flex items-center justify-center shrink-0">
              <img
                src={angular}
                alt="Angular"
                className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16"
              />
            </div>
            <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-[#003D7A] rounded-full flex items-center justify-center shrink-0">
              <img
                src={aws}
                alt="Azure"
                className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16"
              />
            </div>
            <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-[#003D7A] rounded-full flex items-center justify-center shrink-0">
              <img
                src={python}
                alt="Unity"
                className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16"
              />
            </div>
            <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-[#003D7A] rounded-full flex items-center justify-center shrink-0">
              <img
                src={react}
                alt="React"
                className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16"
              />
            </div>
            <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-[#003D7A] rounded-full flex items-center justify-center shrink-0">
              <img
                src={vue}
                alt="C"
                className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Enquiry Modal */}
      {showEnquiryModal && (
        <CourseEnquiryModal
          course={selectedCourse}
          onClose={() => setShowEnquiryModal(false)}
        />
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.isOpen}
        onClose={hideToast}
      />
    </div>
  );
}

export default CourseDetail;
