    import React, { useState } from 'react'
    import Banner from '../assets/Banner/Vibly Banner.jpg'
    import { IoIosSearch } from "react-icons/io";
    
    const Search = () => {
        const tags=[
            {
                id: 1,
                name: 'All'
            },
            {
                id: 1,
                name: 'Life Style'
            },
            {
                id: 1,
                name: 'Travel'
            },
            {
                id: 1,
                name: 'Food & Recipes'
            },
            {
                id: 1,
                name: 'Technology'
            },
            {
                id: 1,
                name: 'Fashion & Beauty'
            },
        ]
        const [activeIndex,setActiveIndex]=useState(0);
      return (
        <div className='flex justify-center mt-10 flex-col px-[70] md:px-[250px]'>
            <img src={Banner} className='rounded-2xl w-350 h-120 shadow-lg'/>
            <div className='bg-white shadow-lg p-4 rounded-lg mt-[-20px] mx-[25%] flex items-center'>
                <IoIosSearch className='text-[20px] text-gray-800 h-5 w-12'/>
                <input type='text' placeholder='Search' className='outline-none'/>
            </div>
            <div className='flex gap-20 justify-center mt-7'>
                {tags.map((item,index)=>(
                    <ul onClick={()=>setActiveIndex(index)} className={`${index==activeIndex?'hover:text-green-400 hover:font-bold':null} cursor-pointer hover:scale-110`}>
                        <li>{item.name}</li>
                    </ul>
                ))}
            </div>
        </div>
      )
    }
    
    export default Search