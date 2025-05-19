import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [activeTag, setActiveTag] = useState("All");
  const [selectedBlog, setSelectedBlog] = useState(null);

  const tags = [
    "All",
    "Life Style",
    "Travel",
    "Food & Recipes",
    "Technology",
    "Fashion & Beauty",
  ];

  const fetchBlogs = async (category) => {
    try {
      const response = await axios.get("http://localhost:8081/blogs", {
        params: { category },
      });
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs(activeTag);
  }, [activeTag]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const handleBlogClick = (blogId) => {
    const blog = blogs.find((b) => b.blogid === blogId);
    setSelectedBlog(blog);
  };

  const closeModal = () => {
    setSelectedBlog(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await axios.delete(`http://localhost:8081/api/myblog/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };


  const handleUpdate = (blogId) => {
    navigate(`/adminupdate/${blogId}`);
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 text-black px-6 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2  bg-green-800 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-6 justify-center mt-6 flex-wrap">
        {tags.map((tag, index) => (
          <div
            key={index}
            onClick={() => setActiveTag(tag)}
            className={`cursor-pointer text-[15px] ${
              activeTag === tag ? "text-green-600 font-bold" : "text-gray-700"
            } hover:scale-110 transition-transform text-9xl`}
          >
            {tag}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-10">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog.blogid}
              className="relative m-4 bg-green-300 p-4 rounded-2xl"
            >
              <img
                src={`http://localhost:8081/uploads/${blog.image}`}
                className="w-full h-[200px] object-cover rounded-2xl cursor-pointer"
                alt="Blog"
                onClick={() => handleBlogClick(blog.blogid)}
              />
              <h3 className="text-xl font-bold mt-3">{blog.title}</h3>
              <p className="line-clamp-6 mt-2">{blog.content}</p>
              <p className="text-sm text-gray-600 mt-2">
                Posted by <span className="font-semibold">{blog.username}</span> on{" "}
                {new Date(blog.date).toLocaleDateString()}
              </p>

              <div className="flex gap-4 mt-3">
                <button
                  onClick={() => handleUpdate(blog.blogid)}
                  className=" bg-green-700 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(blog.blogid)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">No blogs found.</p>
        )}
      </div>

      {selectedBlog && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-2xl flex justify-center items-center z-50">
          <div className="bg-gray-300 rounded-xl p-6 w-[45%] relative">
            <button
              className="absolute top-2 right-4 text-black text-2xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={`http://localhost:8081/uploads/${selectedBlog.image}`}
              className="w-full h-[300px] object-cover rounded-lg"
              alt="Detail"
            />
            <h2 className="text-2xl font-bold mt-4">{selectedBlog.title}</h2>
            <p className="mt-3 whitespace-pre-wrap">{selectedBlog.content}</p>
            <p className="mt-3 text-sm text-gray-500">
              Posted by{" "}
              <span className="font-semibold">{selectedBlog.username}</span> on{" "}
              {new Date(selectedBlog.date).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
