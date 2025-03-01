import { useEffect, useState, useMemo, useRef } from 'react';
import DefaultText from '../components/DefaultText';
import { ArrowDown, ArrowUp, DogIcon } from 'lucide-react';
import { motion } from "motion/react"
import _ from 'lodash'
import DefaultInput from '../components/DefaultInput';
import search, { getAvailableBreeds, getMatch, SortType } from '../services/search';
import { baseURL, Dog } from '../services';
import ResultItem from '../components/ResultItem';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import DefaultButton from '../components/DefaultButton';
import { logout } from '../services/auth';
import axios from 'axios';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import LocationSearchBox from '../components/LocationSearchBox';
import AgeInputFields from '../components/AgeInputFields';

export default function App() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useState('');
  const navigate = useNavigate();
  const [loggedUser] = useState(user.username || 'Champ');
  const [allBreeds, setAllBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [sortType, setSortType] = useState<SortType>(SortType.breed);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [results, setResults] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [match, setMatch] = useState('');
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const [ageMin, setMinAge] = useState(0);
  const [ageMax, setMaxAge] = useState(15);
  const [isAscending, setIsAscending] = useState(true);

  const handleSortToggle = () => {
    setIsAscending(!isAscending);
  };


  const handleAddFavorite = (dog: Dog, isFavorite: boolean) => {
    if (isFavorite) {
      console.info(isFavorite)
      dispatch(removeFavorite(dog));
    } else {
      dispatch(addFavorite(dog));
    }
  };

  const onLogout = () => {
    logout(dispatch, navigate);
  };

  const handleMinAgeChange = (value: number) => {
    setMinAge(value);
  };

  const handleMaxAgeChange = (value: number) => {
    setMaxAge(value);
  };

  const loadDogs = async (reset?: boolean) => {
    setIsLoading(true);
    await search(
      navigate,
      dispatch,
      sortType,
      isAscending ? 'asc' : 'desc',
      currentPage,
      {
        breeds: selectedBreeds.length ? selectedBreeds : undefined,
        ageMin,
        ageMax,
      }
    ).then(async ({ resultIds, totalPages }) => {
      await axios.post(`${baseURL}/dogs`, resultIds, {
        withCredentials: true
      }).then((response) => {
        const filtered = response.data.filter((item: Dog) =>
        (item?.breed?.toLowerCase().includes(searchParams.toLowerCase())
          || item?.name?.toLowerCase().includes(searchParams.toLowerCase())))
        console.info({ currentPage, totalPages }, filtered.length === 0 && currentPage < totalPages)
        if (filtered.length === 0 && currentPage < totalPages) {
          setCurrentPage(prev => prev + 1);
        } else {
          const newResults = reset ? response.data : [
            ...results,
            ...response.data.filter((dog: Dog) => !results.some(existingDog => existingDog.id === dog.id))
          ];
          setResults(newResults);
          setIsLoading(false);
        }
      }).catch();
      setTotalPages(totalPages);
    });
  };

  const debouncedLoadDogs = useMemo(() => _.debounce(loadDogs, 300), [loadDogs]);

  const findMyDog = async () => {
    const resultIds = favorites.map(dog => dog.id);
    await getMatch(resultIds).then((match) => {
      setMatch(match);
      const matchIndex = favorites.findIndex(dog => dog.id === match);
      if (matchIndex !== -1 && scrollRef.current) {
        const resultElement = scrollRef.current.children[matchIndex] as HTMLElement;
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  useEffect(() => {
    debouncedLoadDogs(currentPage === totalPages);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    debouncedLoadDogs(true);
  }, [selectedBreeds.length, sortType, ageMin, ageMax, isAscending]);

  const filteredTrivia = results.filter((item: Dog) =>
  (item?.breed?.toLowerCase().includes(searchParams.toLowerCase())
    || item?.name?.toLowerCase().includes(searchParams.toLowerCase()))
  );

  const paginatedTrivia = filteredTrivia.slice(0, currentPage * 100);

  const sortedBreeds = useMemo(() => {
    return allBreeds.map((breed) => (
      <DefaultText
        key={breed}
        onClick={() => {
          setSelectedBreeds(selectedBreeds.includes(breed)
            ? selectedBreeds.filter(b => b !== breed)
            : [...selectedBreeds, breed]
          );
        }}
        className={`
          ${selectedBreeds.includes(breed) ? 'bg-[var(--accent-vivid)]' : 'bg-[var(--bg-mid)]'} 
          hover:bg-[var(--accent-vivid)]
          rounded-lg p-2 font-bold cursor-pointer`
        }
      >
        {breed}
      </DefaultText>
    ));
  }, [allBreeds, selectedBreeds]);

  useEffect(() => {
    getAvailableBreeds(dispatch).then((breeds) => {
      setAllBreeds(breeds);
    });
  }, []);

  return (
    <div className="min-h-screen font-display">
      <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center flex-row gap-3 justify-between">
            <div className='flex flex-col'>
              <DogIcon size={80} color='var(--text-primary)' />
              <DefaultText weight='bold' fontSize='large' className="text-5xl text-[var(--accent-vivid)]">HOME DOG</DefaultText>
              <DefaultText weight='bold' className="mt-2 text-[var(--text-muted)]">Where happy tails begin.</DefaultText>
            </div>
            <div className='flex items-end flex-col'>
              <DefaultText fontSize='medium' weight='bold' className="mt-2 text-[var(--text-muted)]">Hey {loggedUser}!</DefaultText>
              <DefaultButton className='bg-[transparent] text-[var(--accent-vivid)]' onClick={onLogout}>Logout</DefaultButton>
            </div>
          </div>
        </div>
      </header>
      <main className={`flex flex-col ${'max-w-[80%]'} mx-auto px-4 py-8 fade-style`}>
        <DefaultText className='flex justify-center mb-8' weight='bold' fontSize='medium'>Find Your Forever Friend</DefaultText>
        <DefaultInput
          placeholder='Search...'
          className='rounded-none rounded-t-lg text-lg'
          value={searchParams}
          onChange={(e) => setSearchParams(e.target.value)}
        />
        <div className='flex flex-row bg-[var(--bg-secondary)] rounded-b-lg' style={{ maxHeight: 'calc(100vh - 400px)', minHeight: results.length ? 200 : undefined }}>
          <div className='p-6 overflow-y-auto mx-auto'>
            <LocationSearchBox />
            <div className='flex flex-row gap-2 justify-between'>
              <DefaultText weight='bold' className='text-[var(--text-secondary)]'>Sort By</DefaultText>
              <div className='flex flex-row gap-2' onClick={handleSortToggle}>
                <DefaultText className="hover:text-[var(--accent-vivid)] cursor-pointer" weight='bold'>{isAscending ? 'Ascending' : 'Descending'}</DefaultText>
                {isAscending && <ArrowUp className="hover:text-[var(--accent-vivid)] cursor-pointer" color='var(--text-primary)' />}
                {!isAscending && <ArrowDown className="hover:text-[var(--accent-vivid)] cursor-pointer" color='var(--text-primary)' />}
              </div>
            </div>
            {Object.values(SortType).map((sort) =>
              <DefaultText
                key={sort}
                onClick={() => {
                  setSortType(prev => prev !== sort ? sort : SortType.breed);
                }}
                className={`
                ${sortType === sort ? 'bg-[var(--accent-vivid)]' : 'bg-[var(--bg-mid)]'} 
                hover:bg-[var(--accent-vivid)]
                rounded-lg p-2 font-bold cursor-pointer my-2`
                }
              >
                {sort.charAt(0).toUpperCase() + sort.slice(1)}
              </DefaultText>
            )}
            <AgeInputFields
              ageMin={ageMin}
              ageMax={ageMax}
              onMinAgeChange={handleMinAgeChange}
              onMaxAgeChange={handleMaxAgeChange}
            />
            <details open className='mt-4'>
              <summary className='cursor-pointer text-[var(--text-secondary)] font-bold'>Filter By Breed</summary>
              <div className='flex flex-wrap gap-2 overflow-y-auto mt-2'>
                {sortedBreeds}
              </div>
            </details>
          </div>
          <div
            className='p-6 fade-style overflow-y-auto mx-auto'
            id='result-view'
            style={favorites.length > 0 ? { flex: '0 0 50%' } : { flex: '0 0 70%' }}
          >
            {paginatedTrivia.map((dog) => {
              const isFavorite = favorites.some(fav => fav.id === dog.id)
              return (
                <ResultItem
                  key={dog.id}
                  dog={dog}
                  onFavorite={() => handleAddFavorite(dog, isFavorite)}
                  isFavorite={isFavorite}
                />
              )
            })}
            {paginatedTrivia.length === 0 && !isLoading && <DefaultText className='text-[var(--text-muted)] font-bold'>No Results</DefaultText>}
            {currentPage < totalPages && (
              <div className='flex justify-center mt-4'>
                {isLoading && <motion.div
                  className="h-2 bg-[var(--accent-vivid)] mt-4 rounded-md"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentPage / totalPages) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />}
                {!isLoading && <DefaultButton
                  className='bg-[transparent]' onClick={() => {
                    setCurrentPage(prev => prev + 1)
                  }}>
                  Load More
                </DefaultButton>}
              </div>
            )}
          </div>
          {favorites.length > 0 && (
            <div ref={scrollRef} className='p-6 overflow-y-auto mx-auto' style={{ flex: '0 0 30%' }}>
              <DefaultButton className='mb-4' onClick={findMyDog}>Auto Match</DefaultButton>
              <DefaultText weight='bold' className='text-[var(--text-secondary)]'>Favorites</DefaultText>
              {favorites.map((dog) => {
                return (
                  <ResultItem
                    key={dog.id}
                    dog={dog}
                    isMatch={dog.id === match}
                    inFavoritesSection
                    onFavorite={() => handleAddFavorite(dog, true)}
                  />
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
