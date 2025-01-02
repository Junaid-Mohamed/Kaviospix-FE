import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap'; // Assuming you are using react-bootstrap for the modal
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import "../App.css";
import axiosInstance from '../config/axios.config';
import { useAuthContext } from '../context/AuthContext';
import { useModalContext } from '../context/ModalContext';
import AddImage from './AddImage';

const ImageListing = () => {
  const { albumId } = useParams();
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [allUsers,setUsers] = useState([]);
  const [selectedOptions,setSelectedOptions] = useState([]);
  const [addComment,setAddComment] = useState(false)
  const [comment,setComment] = useState("");
  

  const {loggedInUserId,albumOwnerId } = useAuthContext();
  const {isModalOpen, closeModal} = useModalContext();

  useEffect(() => {
    (async () => {
      const response = await axiosInstance.get(`/api/albums/${albumId}/images`);
      setImages(response.data);
    })();
    (async()=>{
      const response = await axiosInstance.get(`api/users/all-users`);
      setUsers(response.data);
    })();
  }, [albumId]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const handleSelectionChange = (event) => {
    const options = Array.from(event.target.selectedOptions,(option)=> option.value);
    setSelectedOptions(options);
  }

  const handleShare = async() => {
    try {
      await axiosInstance.put(`/api/albums/${albumId}/share`,{emails:selectedOptions});
    } catch (error) {
      console.log('Error sharing the album with slected users',error)
    }
  }

  const handleFavorite = async(imageId,favorite)=>{
 
    try {
      await axiosInstance.put(`/api/albums/${albumId}/images/${imageId}/favorite`,{favorite});
      setImages(prevImages=>prevImages.map(image=>(
        image._id === imageId ? {...image,isFavorite:favorite} : image
      )))
    } catch (error) {
      console.log('Error adding favorite to the image',error)
    }
  }

  const handleAddComment = async(imageId) => {
    try {
      await axiosInstance.post(`/api/albums/${albumId}/images/${imageId}/comments`,{comment});
      setSelectedImage(prevImage=>({...prevImage,comments:[...prevImage.comments,comment]}))
      setAddComment(false);
    } catch (error) {
        console.log("error adding comment",error);
    }
  }

  const handleDeleteImage = async(imageId) =>{
    try {
      await axiosInstance.delete(`/api/albums/${albumId}/images/${imageId}`);
      setImages(prevImage=>prevImage.filter(image=>image._id!==imageId));
      handleCloseModal();
    } catch (error) {
        console.log("error adding comment",error);
    }
  }

  const handleFavorites = async() => {
      try {
      const response = await axiosInstance.get(`/api/albums/${albumId}/images/favorites`);
      setImages(response.data);
      } catch (error) {
        console.log("Error getting favorite images.",error);
      }
  }
  return (
    <div className="container my-4">
      <div className='d-flex items-center' >
      <h3>{images.length>0? `Images List in ${images[0]?.albumId?.name} Album`: ''}</h3>
      <button  onClick={handleFavorites} className='btn btn-info m-auto' >Favroites</button>
      </div>
      { loggedInUserId === albumOwnerId && <div className='my-4' >
      <div className='my-2 d-flex items-center' >
      <label>Share this Album with others</label>
      { selectedOptions.length>0 && <button onClick={handleShare} className='btn btn-primary m-auto' >Share</button>}
      </div>
      <select className='form-control' multiple value={selectedOptions} onChange={handleSelectionChange} >
        {allUsers.map(user=>(
          <option value={user.email} key={user._id} >{user.email}</option>
        ))}
        
      </select>
      </div>}
      <div className="my-4 row">
        {images.length>0 ? images.map((image) => (
          <div className="col-md-4" key={image.imageId}>
            <div
              className="card mb-4"
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => handleImageClick(image)}
            >
              {/* {favorite icon} */}
              <div
    onClick={(e) => {
      e.stopPropagation(); // Prevents the image click handler from triggering
      handleFavorite(image._id,!image.isFavorite);
    }}
    style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 10, // Ensures it's above the image
      cursor: 'pointer',
    }}
  >
    {image.isFavorite ? (
      <AiFillHeart color="red" size={24} />
    ) : (
      <AiOutlineHeart color="white" size={24} />
    )}
  </div>
              <img
                src={image.imageUrl}
                className="card-img-top"
                alt={image.name}
                style={{
                  transition: 'transform 0.2s ease',
                  width: '100%',
                  height:'300px'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  opacity: 0,
                  color: 'white',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'opacity 0.3s ease',
                }}
                className="image-overlay"
              >
                View Details
              </div>
            </div>
          </div>
        )):<h3>No Images to display</h3>}
      </div>
      
      {/* modal for Adding image. */}

      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Image</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <AddImage albumId={albumId} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Image Details */}
      {selectedImage && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedImage.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={selectedImage.imageUrl}
              className="card-img-top mb-3"
              alt={selectedImage.name}
              style={{ width: '100%', height: 'auto' }}
            />
            <p><strong>Size:</strong> {(selectedImage.size / 1024).toFixed(2)} KB</p>
            <div>
              <strong>Comments</strong>{' '}
              {selectedImage.comments.length > 0
                ? selectedImage.comments.map(comment=>(
                  <p key={comment} >{comment}</p>
                ))
                : 'No comments'}
            </div>
            <p><strong>Uploaded At:</strong> {new Date(selectedImage.uploadedAt).toLocaleString()}</p>
          </Modal.Body>
          <Modal.Footer>
            {addComment && <div className='' ><input type="text" value={comment} onChange={(e)=>setComment(e.target.value)} placeholder='comment' className='form-control' /><br/>
            <button onClick={()=>handleAddComment(selectedImage._id)} className='btn btn-primary' >Add</button>
            <button onClick={()=>setAddComment(false)} className='btn btn-secondary mx-3' >Cancel</button>
            </div>}
            {!addComment && <button onClick={()=>setAddComment(true)} className='btn btn-primary' >Add Comment</button> }
            
            {!addComment && <button onClick={()=>handleDeleteImage(selectedImage._id)} className='btn btn-danger' >Delete Image</button>}
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ImageListing;
