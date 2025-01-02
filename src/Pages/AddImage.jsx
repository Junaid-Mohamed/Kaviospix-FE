import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios.config";
import { useModalContext } from "../context/ModalContext";

// eslint-disable-next-line react/prop-types
const AddImage = ({albumId}) => {
  const [imageFile, setImageFile] = useState(null);
  const [tags, setTags] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const {closeModal} = useModalContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that an image file is selected
    if (!imageFile) {
      alert("Please select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("tags", tags.split(",").map((tag) => tag.trim()));
    formData.append("isFavorite", isFavorite);

    // console.log(formData);
    // Uncomment when ready to integrate with API
    try {
      await axiosInstance.post(`/api/albums/${albumId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Image added successfully!");
      closeModal();
      navigate(`/${albumId}/images`);
    } catch (error) {
      console.error("Error adding image:", error);
      alert("Failed to add image.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      alert("Please upload a valid image file.");
      setImageFile(null);
    }
  };

  return (
    <div className="container ">
      <h2 className="text-center">Add New Image</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="imageFile" className="form-label">
            Select Image File
          </label>
          <input
            type="file"
            className="form-control"
            id="imageFile"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tags" className="form-label">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            className="form-control"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isFavorite"
            checked={isFavorite}
            onChange={(e) => setIsFavorite(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="isFavorite">
            Mark as Favorite
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Image
        </button>
      </form>
    </div>
  );
};

export default AddImage;
