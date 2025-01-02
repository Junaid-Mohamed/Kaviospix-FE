//  create context

import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";

//  create context
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

//  custom hook to access the context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = ()=> useContext(AuthContext);

// context provider
export const AuthProvider = ({children}) => {

    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [albumOwnerId,setAlbumOwnerId] = useState(null);

    return(
        <AuthContext.Provider
        value={{
            loggedInUserId,
            setLoggedInUserId,
            albumOwnerId,
            setAlbumOwnerId
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

//  validate props
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
