import { FaGoogle } from "react-icons/fa";
const Login = () => {
    const authenticateViaOAuth = async (method) => {
      try {
        window.location.href = `https://memories-be-xi.vercel.app/api/auth/${method}`;
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
        <div className="bg-dark text-light min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <h1 className="text-center mb-4">Welcome to Memories</h1>
        <div className="d-flex align-items-center gap-3">
          <button
            onClick={() => authenticateViaOAuth('google')}
            className="btn btn-light text-dark d-flex align-items-center gap-2"
          >
            <FaGoogle className="fs-5" />
            Login with Google
          </button>
        </div>
      </div>
      
    );
  };

  export default Login;