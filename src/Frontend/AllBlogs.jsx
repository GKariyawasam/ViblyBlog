import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/api/blogs')
      .then(res => setBlogs(res.data))
      .catch(err => console.error("Failed to fetch blogs:", err));
  }, []);

  const handleBlogClick = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8081/api/blog/${id}`);
      setSelectedBlog(res.data[0]); // Make sure your backend returns an array
    } catch (err) {
      console.error("Failed to fetch blog details:", err);
    }
  };

  const closeModal = () => {
    setSelectedBlog(null);
  };

  return (
    <div>
      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-10">
        {blogs.map((blog) => (
          <div
            key={blog.blogid}
            className="m-4 bg-green-300 p-4 rounded-2xl cursor-pointer"
            onClick={() => handleBlogClick(blog.blogid)}
          >
            <img
              src={`http://localhost:8081/uploads/${blog.image}`}
              className="w-full h-[300px] object-cover rounded-2xl"
              alt="Blog"
            />
            <h3 className="text-xl font-bold mt-3">{blog.title}</h3>
            <p className="line-clamp-3 mt-2">{blog.content}</p>
            <p className="text-sm text-gray-600 mt-2">
              {new Date(blog.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-gray-200 rounded-xl p-6 max-w-2xl w-[90%] relative mt-6 mb-6">
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
              {new Date(selectedBlog.date).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
