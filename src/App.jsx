/* eslint-disable no-cond-assign */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce} from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';


const API_BASE_URL = `https://api.themoviedb.org/3/`;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
                    method: 'GET',
                    headers: {
                      accept: 'application/json',
                      Authorization: `Bearer ${API_KEY}`
                    }
}

const App = () => {
  const[debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const[searchTerm, setSearchTerm] = useState('')

  const[movieList, setMovieList] = useState([]);
  const[errorMessage, setErrorMessage] = useState('');
  const[isLoading, setIsLoading]= useState(false) ;

  const[trendingMovies, setTrendingMovies] = useState([]);
  


  //Debounce the  search term to making use many API request
  //by waiting for the user to stop the typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm),500, [searchTerm]);

  const fetchMovies = async(query = '') =>{
    setIsLoading(true);
    setErrorMessage('');
      try{
          const endpoint = query
           ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
           : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

          const response = await fetch (endpoint, API_OPTIONS);
          if(!response.ok){
            throw new Error ('Failed the fetch movies...');
          }
          const data = await response.json();
          if(data.Response == 'False'){
            setErrorMessage(data.Error || 'Failed the fetch error Movie');
            setMovieList([]);
            return;
          }
          setMovieList(data.results || []);
          // updateSearchCount();
          if(query && data.results.length > 0){
            await updateSearchCount(query, data.results[0]);
          }

      }catch(error){
        console.error(`Error fetching movies: ${error}`);
        setErrorMessage('Error Fetching movies.Please try again');
      }finally{
        setIsLoading(false);
      }
    } 

  const loadingTrendingMovies = async()=>{
    try{
        const movies = await getTrendingMovies();
        setTrendingMovies(movies || []);

    }catch(error){
      console.error(`Error fetching trending movies : ${error}`);
    }
  } 
  
  
  useEffect(() =>{
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm]);

  useEffect(() =>{
    loadingTrendingMovies();
  },[]);  

  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movies</span> You&lsquo;ll all Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {
                trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index +1 }</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))
              }
            </ul>
          </section>           
          )
         }



        <section className='all-movies'>
        <h2 >All Movies</h2>
          {
            isLoading? (
              <Spinner/>
              
          ) : errorMessage ?(
            <p className='text-red'>{errorMessage}</p>
          ) : (
            <ul>
              {
                movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}/>
                ))
              }
            </ul>
          )
          }  
      </section>
      </div>
      
      
      
    </main>
  )
}

export default App