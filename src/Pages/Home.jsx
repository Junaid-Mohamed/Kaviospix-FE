import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../config/axios.config";
import { useAuthContext } from '../context/AuthContext';

const Home = () => {
  const [albums, setAlbums] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  // const loggedInUserId = localStorage.getItem("userId");

  const {loggedInUserId,setLoggedInUserId,setAlbumOwnerId} = useAuthContext();

  useEffect(() => {
    (async () => {
      const albums = await axiosInstance.get("/api/albums");
      setAlbums(albums.data);
    })();
    const getUser = async () => {
      const userId = await axiosInstance.get("/api/users");
      localStorage.setItem("userId", userId.data);
      setLoggedInUserId(userId.data);
    };
    if (!loggedInUserId) {
      getUser();
    }
  }, [loggedInUserId,setLoggedInUserId]);

  const handleEditClick = (album) => {
    setCurrentAlbum(album);
    setEditedDescription(album.description || "");
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await axiosInstance.put(`/api/albums/${currentAlbum._id}`, {
        description: editedDescription,
        ownerId:currentAlbum.ownerId
      });
  
      setAlbums((prevAlbums) =>
        prevAlbums.map((album) =>
          album._id === currentAlbum._id
            ? { ...album, description: editedDescription }
            : album
        )
      );
      setEditModalOpen(false);
      setCurrentAlbum(null);
    } catch (error) {
      console.error("Error updating album:", error);
    }
  };

  const handleDelete = async (albumId,ownerId) => {
      try{
        console.log(albumId,ownerId);
        await axiosInstance.delete(`/api/albums/${albumId}`,{params:{ownerId}})
        window.location.reload();
      }catch(error){
        console.log('Error deleting album',error);
      }
  }

  const handleViewAlbum = (ownerId) =>{
    setAlbumOwnerId(ownerId);
  }

  return (
    <div className="container my-4">
      <h1>Album List</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {albums.map((album) => (
          <div key={album._id} className="col">
            <div className="card h-100">
              <img
                src={`${
                  album.coverImage
                    ? album.coverImage
                    : `https://placehold.co/200?text=${album.name}`
                }`}
                className="card-img-top"
                alt={`${album.name}`}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{album.name}</h5>
                <p className="card-text">{album.description || ""}</p>
              </div>
              <div className="card-footer text-center">
                <Link
                  to={`/${album._id}/images`}
                  className="btn btn-primary btn-sm me-2"
                  onClick={()=>handleViewAlbum(album.ownerId)}
                >
                  View Album
                </Link>
                {loggedInUserId == album.ownerId && (
                  <button
                    onClick={() => handleEditClick(album)}
                    className="btn btn-secondary btn-sm me-2"
                  >
                    Edit
                  </button>
                )}
                {loggedInUserId == album.ownerId && (
                  <button onClick={()=>handleDelete(album._id,album.ownerId)} className="btn btn-danger btn-sm">Delete</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isEditModalOpen && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Album</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEditSubmit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
