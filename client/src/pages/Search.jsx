import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const response = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await response.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();

  }, [location.search]);


  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if(id === 'all' || id === 'rent' || id === 'sale') {
      setSidebarData((prevSidebarData) => ({
        ...prevSidebarData,
        type: id,
      }));
    }

    if (id === 'searchTerm') {
      setSidebarData((prevSidebarData) => ({
        ...prevSidebarData,
        searchTerm: value,
      }));
    }

    if (id === 'parking' || id === 'furnished' || id === 'offer') {
      setSidebarData((prevSidebarData) => ({
        ...prevSidebarData,
        [id]: checked || checked === 'true' ? true : false,
      }));
    }

    if (id === 'sort_order') {
      const sort = value.split('_')[0] || 'createdAt';
      const order = value.split('_')[1] || 'desc';

      setSidebarData((prevSidebarData) => ({
        ...prevSidebarData,
        sort,
        order,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const limit = 9;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('startIndex', startIndex);
    urlParams.set('limit', limit);
    const searchQuery = urlParams.toString();
    const response = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await response.json();
    if (data.length < limit) {
      setShowMore(false);
    }
    setListings((previousListings) => [...previousListings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold' htmlFor='search'>Search:</label>
            <input 
              type='text'
              placeholder='Search...'
              id='searchTerm'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-5 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='all' 
                className='w-5' 
                checked={sidebardata.type === 'all'}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='rent' 
                className='w-5' 
                checked={sidebardata.type === 'rent'}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='sale' 
                className='w-5' 
                checked={sidebardata.type === 'sale'}
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='offer' 
                className='w-5' 
                checked={sidebardata.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-5 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='parking' 
                className='w-5' 
                checked={sidebardata.parking}
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='furnished' 
                className='w-5'
                checked={sidebardata.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className='flex gap-4 flex-wrap items-center'>
            <label className='font-semibold'>Sort:</label>
            <select 
              onChange={handleChange}
              value={`${sidebardata.sort}_${sidebardata.order}`}
              id='sort_order' 
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>Search</button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listings found!</p>
          )}

          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
          )}

          {!loading && listings && listings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}

          {showMore && (
            <button onClick={onShowMoreClick} className='text-green-700 text-center p-7 hover:underline w-full'>Show more</button>
          )}
        </div>
      </div>
    </div>
  )
}
