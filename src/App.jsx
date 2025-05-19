import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Frontend/Login';
import Signup from './Frontend/Signup'; 
import Home from './Frontend/Home';
import Blog from './Frontend/Blog'
import Profile from './Frontend/Profile'
import MyBlog from './Frontend/MyBlog'
import UpdateBlog from './Frontend/UpdateBlog'
import BlogDetail from './Frontend/BlogDetail'
import Admin from './Frontend/Admin'
import AdminUpdate from './Frontend/AdminUpdate';


const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/blog' element={<Blog />}></Route>
        <Route path='/myBlog' element={<MyBlog />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/updateblog/:id' element={<UpdateBlog />}></Route>
        <Route path='/blogdetail/:id' element={<BlogDetail />}></Route>
        <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        <Route path='adminupdate/:id' element={<AdminUpdate />} />
      </Routes>
    </Router>
  );
};

export default App;
