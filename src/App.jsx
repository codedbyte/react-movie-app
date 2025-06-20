import React, {useEffect,  useState} from 'react'
import Search from './assets/components/Search.jsx'
import Spinner from './assets/components/Spinner.jsx';

const API_BASE_URL = 'https://api.themoviedb.org/3/';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [loadingState, setLoadingState] = useState(false);


   const fetchMovies = async () => {
    setLoadingState(true);
    setErrorMessage('');

    try{
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error ('Failed to Fetch Movies');
      }
      

      const data = await response.json();

      console.log(data);

      if (data.response === "False"){
        console.error(data.error || 'Failed to Fetch Movie');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
    }
    catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    }
    finally{
      setLoadingState(false);
    }
  }


  useEffect(() => {
    fetchMovies();
  }, [])

 
  return (


    <main>
      <div className="pattern"/>

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> you will enjoy without the Hassle. </h1>
        </header>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

        <section className="all-movies">
          <h2>All Movies</h2>

          {loadingState ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (<ul>
                {movieList.map((movie) => (
                  <p key={movie.id} className='text-white'>{movie.title}</p>
                ) )}
            </ul>)}
        </section>
      </div>
    </main>
  )
}

export default App