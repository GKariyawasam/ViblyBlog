import React, { useState, useEffect } from 'react';
import Banner from '../assets/Banner/Vibly Banner.jpg';
import { IoIosSearch } from "react-icons/io";
import axios from 'axios';

const Search = ({ onSearch }) => {
   const [input, setInput] = useState('');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(input);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [input]);


  
  return (
    <div className='flex flex-col items-center mt-10 px-[70px] md:px-[250px] relative'>
      <img src={Banner} className='rounded-2xl w-350 h-120 shadow-lg' alt="Banner" />
       <div className='bg-white shadow-lg p-4 rounded-lg mt-[-20px] mx-[25%] flex items-center w-[50%] relative'>
        <IoIosSearch className='text-[20px] text-gray-800 mr-4'/>
        <input
          type='text'
          placeholder='Search blog title...'
          className='outline-none w-full'
          value={input}
          onChange={(e) => setInput(e.target.value)}
      />
    </div>

      
    </div>
  );
};

export default Search;
