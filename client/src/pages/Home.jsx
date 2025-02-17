import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  SwiperCore.use([Navigation]);

  console.log(saleListings);

  useEffect(() => {
    setLoading(true);
    const fetchListings = async () => {
      try {
        const [offerResponse, rentResponse, saleResponse] = await Promise.all([
          fetch('/api/listing/get?offer=true&limit=4'),
          fetch('/api/listing/get?type=rent&limit=4'),
          fetch('/api/listing/get?type=sale&limit=4'),
        ]);
  
        const offerData = await offerResponse.json();
        const rentData = await rentResponse.json();
        const saleData = await saleResponse.json();
  
        setOfferListings(offerData);
        setRentListings(rentData);
        setSaleListings(saleData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Set loading to false once fetch is complete
      }
    };
    fetchListings();
  }, []);

  return (
    <div>
      { /* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your
          <span className='text-slate-500'> dream</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          ChristianEstate is the best place to find your dream home.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link to={'/search'} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Let's get started...
        </Link>
      </div>

      {loading && (
        <div className="text-center py-10">
          <p>Loading listings...</p>
        </div>
      )}

      { /* swiper */}
      <div className='max-w-6xl mx-auto px-3'>
        <Swiper navigation={true}>
          {
            offerListings && offerListings.length > 0 && 
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}} 
                className='h-[500px]' 
                key={listing._id}></div>
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
      
      
      { /* listing results for offer, sale and rent */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        { offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className=''>
              <h2 className='text-3xl font-semibold text-slate-600'>Recent Offers</h2>
              <Link className='text-m text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        { rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className=''>
              <h2 className='text-3xl font-semibold text-slate-600'>Recent Places for Rent</h2>
              <Link className='text-m text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        { saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className=''>
              <h2 className='text-3xl font-semibold text-slate-600'>Recent Places for Sale</h2>
              <Link className='text-m text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
