import React from 'react'
import Header from '../Components/Header'
import Search from '../Components/Search'
import AllBlogs from '../Frontend/AllBlogs'

const Home = () => {
  return (
    <div>
      <Header/>
      <Search />
      <AllBlogs />
    </div>
  )
}

export default Home