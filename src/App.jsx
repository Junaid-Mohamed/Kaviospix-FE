
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import AddImage from './Pages/AddImage'
import Home from './Pages/Home'
import ImageListing from './Pages/ImageListing'
import Login from './Pages/Login'




function App() {
  return (
    <div className='d-flex flex-column min-vh-100' >
   <Router>
   <Header/>
   <main className='' >  
   <Routes>
    <Route path='/' element={ <ProtectedRoute> <Home/></ProtectedRoute>} />
    <Route path='/:albumId/images' element={ <ProtectedRoute> <ImageListing/></ProtectedRoute>} />
    <Route path='/add-image' element={ <ProtectedRoute> <AddImage/></ProtectedRoute>} />
    <Route path='/login' element={<Login/>} />
   </Routes>
   </main>
   <Footer/>
   </Router>  
    </div>
  )
}

export default App
