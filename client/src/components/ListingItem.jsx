import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import defaultListingPhoto from '../assets/default-listing-photo.jpeg';
import { FaBed, FaBath, FaParking, FaChair } from 'react-icons/fa';

export default function ListingItem({ listing }) {
  return (
    <div className='bg-gray-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] flex flex-col'>
      <Link to={`/listing/${listing._id}`} className='flex flex-col h-full'>
        <img
          src={listing.imageUrls[0] || defaultListingPhoto}
          alt={listing.name}
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full flex-grow'>
          <p className='truncate text-lg font-semibold text-slate-700'>{listing.name}</p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>{listing.address}</p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2 flex-grow'>{listing.description}</p>
          {/* Add padding between description and price */}
          <div className='mt-4'>
            {/* <p className='text-slate-500 font-semibold'>
              ${' '}
              {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p> */}
            <p className='text-slate-500 font-semibold'>
              {listing.offer ? (
                <>
                  <span className='text-slate-500 line-through mr-2'>
                    ${' '}{listing.regularPrice.toLocaleString('en-US')}
                  </span>
                  <span className='text-green-700 font-bold'>
                    ${' '}{listing.discountPrice.toLocaleString('en-US')}
                  </span>
                </>
              ) : (
                <span className='text-slate-500'>
                  ${' '}{listing.regularPrice.toLocaleString('en-US')}
                </span>
              )}
              {listing.type === 'rent' && ' / month'}
            </p>

            <div className='text-slate-700 grid grid-cols-2 grid-rows-2 gap-y-1
             mt-2'>
              <div className='font-bold text-xs flex gap-1 items-center'>
                <FaBed className='text-m' />
                {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : `${listing.bedrooms} Bedroom`}
              </div>
              <div className={`font-semibold text-xs flex items-center gap-1 ${listing.parking ? 'text-green-700' : ''}`}>
                <FaParking className='text-m' />
                {listing.parking ? 'Parking Spot' : 'No Parking Spot'}
              </div>
              <div className='font-bold text-xs flex gap-1 items-center'>
                <FaBath className='text-m' />
                {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : `${listing.bathrooms} Bathroom`}
              </div>
              <div className={`font-semibold text-xs flex items-center gap-1 ${listing.parking ? 'text-green-700' : ''}`}>               
                <FaChair className='text-m' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}           
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
