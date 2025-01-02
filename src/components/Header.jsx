import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios.config";
import { useAuthContext } from "../context/AuthContext";
import { useModalContext } from "../context/ModalContext";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const navigate = useNavigate();
  const {loggedInUserId,setLoggedInUserId,albumOwnerId } = useAuthContext();
  const location = useLocation();

  const {openModal} = useModalContext();

  useEffect(()=>{
    if(!loggedInUserId){
      setLoggedInUserId(localStorage.getItem('userId'));
    }
  },[loggedInUserId,setLoggedInUserId])

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });

    // Navigate to login or home page
    navigate("/login");
  };

  const handleCreateAlbum = async () => {
    try {
      await axiosInstance.post("/api/albums", {
        name: albumName,
        description: albumDescription,
      });
      setIsModalOpen(false);
      setAlbumName("");
      setAlbumDescription("");
      window.location.reload();
    } catch (error) {
      console.error("Error creating album:", error);
    }
  };

  return (
    <header className="bg-light">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Kaviospix
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
            {location.pathname.includes('/images') && loggedInUserId === albumOwnerId && <li className="nav-item">
                <button
                  className="btn nav-link text-primary"
                  onClick={openModal}
                >
                  Add Image
                </button>
              </li>}
              {loggedInUserId && <li className="nav-item">
                <button
                  className="btn nav-link text-primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create Album
                </button>
              </li>}
              {loggedInUserId && <li className="nav-item">
                <button className="btn nav-link text-primary" onClick={handleLogout}>
                  Logout
                </button>
              </li>}
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Album</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label htmlFor="albumName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="albumName"
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                />
                <label htmlFor="albumDescription" className="form-label mt-3">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="albumDescription"
                  value={albumDescription}
                  onChange={(e) => setAlbumDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateAlbum}
                >
                  Create Album
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
