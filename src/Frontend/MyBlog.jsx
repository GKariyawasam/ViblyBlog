import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Components/Header';
import { Link, useNavigate } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";

const MyBlog = () => {
  const [myblogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const fetchBlogs = () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error("No user ID found in localStorage.");
      return;
    }

    axios.get(`http://localhost:8081/api/myblog?userId=${userId}`)
      .then(res => setBlogs(res.data))
      .catch(err => console.error("Failed to fetch blogs:", err));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await axios.delete(`http://localhost:8081/api/myblog/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/updateblog/${id}`);
  };

  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-10 md:px-15 lg:px-3">
        {myblogs.map((blog) => (
          <div key={blog.id} className='m-4 cursor-pointer bg-green-300 p-4 rounded-2xl'>
            <img src={`http://localhost:8081/uploads/${blog.image}`} className='w-full h-[300px] rounded-2xl object-cover' />
            <h3 className="text-xl font-bold mt-3">{blog.title}</h3>
            <h3 className='line-clamp-6 mt-3'>{blog.content}</h3>
            <h4 className="text-sm text-gray-500 mt-3">{new Date(blog.date).toLocaleString()}</h4>

            <div className='flex items-center mt-4'>
              {/* <button onClick={() => handleUpdate(blog.blogid)} className='bg-green-800 text-white px-4 py-2 rounded flex flex-col w-30'><Link to={`/updateblog/${blog.blogid}`}><CiEdit />Edit</Link></button> */}
              <button onClick={() => handleUpdate(blog.blogid)} className='bg-green-800  w-25 text-white px-4 py-2 rounded flex'><CiEdit className='mt-1 gap-1.5 ml-2.5'/>Edit</button>
              <button onClick={() => handleDelete(blog.blogid)} className='bg-red-500 w-25 text-white px-4 py-2 ml-4 rounded flex'><RiDeleteBin6Line className='mt-1 gap-1.5'/>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBlog;
