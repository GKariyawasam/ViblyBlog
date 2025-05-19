import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Search from '../Components/Search';
import AllBlogs from '../Frontend/AllBlogs';
import axios from 'axios';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [activeTag, setActiveTag] = useState("All");

  useEffect(() => {
    axios.get('http://localhost:8081/blogs')
      .then(res => {
        setBlogs(res.data);
        setFilteredBlogs(res.data);
        fetchBlogsByCategory(activeTag);
      })
      .catch(err => console.error("Failed to fetch blogs:", err));
  }, [activeTag]);

  const handleBlogClick = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8081/api/blog/${id}`);
      setSelectedBlog(res.data[0]);
    } catch (err) {
      console.error("Failed to fetch blog details:", err);
    }
  };

  const fetchBlogsByCategory = async (category) => {
    try {
      const res = await axios.get(`http://localhost:8081/blogs`, {
        params: { category }
      });
      setBlogs(res.data);
    } catch (err) {
      console.error("Category fetch failed", err);
    }
  };

  const closeModal = () => {
    setSelectedBlog(null);
  };

  const handleSearch = async (query) => {
  if (!query) {
    fetchBlogsByCategory(activeTag);
  } else {
    try {
      const res = await axios.get(`http://localhost:8081/search?query=${query}`);
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
  }
};


  return (
    <div>
      <Header />
      <Search onSearch={handleSearch} />
      <AllBlogs
        blogs={blogs} 
        onBlogClick={handleBlogClick}
        selectedBlog={selectedBlog}
        closeModal={closeModal}
        setActiveTag={setActiveTag}
        activeTag={activeTag}
      />
    </div>
  );
};

export default Home;
