/**
 * Example: How to upload course images from the frontend
 *
 * Teachers have two options:
 * 1. Upload an image file from their device
 * 2. Provide an image URL
 */

import axios from "../api/axios";

// Option 1: Upload image file
export const uploadCourseImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post("/courses/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Response will contain the uploaded image URL
    return response.data.data.url; // e.g., "/uploads/courses/image-123456.jpg"
  } catch (error) {
    throw error;
  }
};

// Option 2: Create course with uploaded image
export const createCourseWithImage = async (courseData, imageFile) => {
  const formData = new FormData();

  // Add course data
  formData.append("title", courseData.title);
  formData.append("description", courseData.description);
  formData.append("price", courseData.price);
  formData.append("duration", courseData.duration);
  formData.append("level", courseData.level);
  formData.append("category", courseData.category);

  // Add image file if provided
  if (imageFile) {
    formData.append("thumbnail", imageFile);
  }

  // Add other optional fields
  if (courseData.objectives) {
    formData.append("objectives", JSON.stringify(courseData.objectives));
  }
  if (courseData.curriculum) {
    formData.append("curriculum", JSON.stringify(courseData.curriculum));
  }
  if (courseData.tools) {
    formData.append("tools", JSON.stringify(courseData.tools));
  }

  try {
    const response = await axios.post("/courses", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Option 3: Create course with URL (no file upload)
export const createCourseWithURL = async (courseData) => {
  try {
    const response = await axios.post("/courses", {
      ...courseData,
      thumbnail_url: courseData.imageUrl, // Provide URL instead of file
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Example React component usage:
/*
const CourseForm = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [useUpload, setUseUpload] = useState(true); // Toggle between upload/URL

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (courseData) => {
    if (useUpload && imageFile) {
      // Upload file
      await createCourseWithImage(courseData, imageFile);
    } else if (!useUpload && imageUrl) {
      // Use URL
      await createCourseWithURL({ ...courseData, imageUrl });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <input 
            type="radio" 
            checked={useUpload} 
            onChange={() => setUseUpload(true)} 
          />
          Upload Image
        </label>
        <label>
          <input 
            type="radio" 
            checked={!useUpload} 
            onChange={() => setUseUpload(false)} 
          />
          Use Image URL
        </label>
      </div>

      {useUpload ? (
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
        />
      ) : (
        <input 
          type="url" 
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      )}
      
      {/* Other course fields... *\/}
      <button type="submit">Create Course</button>
    </form>
  );
};
*/
