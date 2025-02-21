/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className='search'>
        <div>
            <img src="search.svg" alt="search" />
            <input type="text"
            placeholder='Search the thousands of movies'
            value={searchTerm}
            onChange={(e)=> setSearchTerm(e.target.value)} />
        </div>
    </div>
  )
}

export default Search