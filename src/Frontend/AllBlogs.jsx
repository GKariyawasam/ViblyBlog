import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllBlogs = ({ blogs, onBlogClick, selectedBlog, closeModal, activeTag, setActiveTag }) => {

  const tags = [
    'All',
    'Life Style',
    'Travel',
    'Food & Recipes',
    'Technology',
    'Fashion & Beauty',
  ];

  const fetchBlogs = async (category) => {
    try {
      const response = await axios.get('http://localhost:8081/blogs', {
        params: { category },
      });
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  return (
    <div>
      <div className="flex gap-6 justify-center mt-10 flex-wrap">
        {tags.map((tag, index) => (
          <div
            key={index}
            onClick={() => setActiveTag(tag)}
            className={`cursor-pointer text-[15px] ${
              activeTag === tag ? 'text-green-600 font-bold' : 'text-gray-700'
            } hover:scale-110 transition-transform`}
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
              className="m-4 bg-green-300 p-4 rounded-2xl cursor-pointer"
              onClick={() => onBlogClick(blog.blogid)}
            >
              <img
                src={`http://localhost:8081/uploads/${blog.image}`}
                className="w-full h-[200px] object-cover rounded-2xl"
                alt="Blog"
              />
              <h3 className="text-xl font-bold mt-3">{blog.title}</h3>
              <p className="line-clamp-6 mt-2">{blog.content}</p>
              <p className="text-sm text-gray-600 mt-2">
                {new Date(blog.date).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">No blogs found.</p>
        )}
      </div>

      {selectedBlog && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-2xl flex justify-center items-center z-50">
          <div className="bg-gray-300 rounded-xl p-6 w-[45%] relative mt-46 mb-46">
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
