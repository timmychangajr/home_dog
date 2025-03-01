import React, { useState } from 'react';
import DefaultInput from './DefaultInput';
import DefaultText from './DefaultText';
import DefaultButton from './DefaultButton';
import axios from 'axios';
import { baseURL } from '../services';

const disclaimer = `
Comment to employer:

I was in the middle of testing POST params for \`location/search\` endpoint and started receiving an error stating that the CORS policy was blocking the request. Even when adding \`Access-Control-Allow-Origin: *\` to the headers, the error persisted. Would love to get your thoughts on how to resolve this issue. As for review, this component will have to remain incomplete, as I'm afraid I'll waste more time.
`

const stateAbbreviations = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland', 'MA': 'Massachusetts',
  'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana',
  'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico',
  'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota',
  'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington',
  'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
};

interface GeoBoundingBox {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  bottom_left?: { lat: number; lon: number };
  top_right?: { lat: number; lon: number };
  bottom_right?: { lat: number; lon: number };
  top_left?: { lat: number; lon: number };
}

interface SearchParams {
  city?: string;
  states?: string[];
  geoBoundingBox?: GeoBoundingBox;
  size?: number;
  from?: number;
}

export default function LocationSearchBox() {
  const [city, setCity] = useState('');
  const [lat, setLatitude] = useState('');
  const [lon, setLongitude] = useState('');

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLatitude(e.target.value);
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLongitude(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const params = {
      geoBoundingBox: {
        bottom_left: { lat: parseFloat(lat), lon: parseFloat(lon) },
        top_right: { lat: parseFloat(lat), lon: parseFloat(lon) },
      }
    } as SearchParams;

    // try {
    //   const response = await axios.post(`${baseURL}/locations/search`, params, {
    //     withCredentials: true
    //   });
    //   console.log(response.data);
    // } catch (error) {
    //   console.error('Error fetching locations:', error);
    // }
  };

  const locationFilters = [
    { name: 'city', label: 'Chicago, IL', type: 'text', onChange: handleCityChange },
    { name: 'lat', label: 'Latitude', type: 'text', onChange: handleLatitudeChange },
    { name: 'long', label: 'Longitude', type: 'text', onChange: handleLongitudeChange },
  ]

  return (
    <form onSubmit={handleSubmit}>
      <DefaultText weight="bold" className='mb-2'>Filter By Location</DefaultText>
      {locationFilters.map((filter, index) =>
        <div className='flex flex-row mb-2' key={index}>
          <DefaultInput
            className="h-10"
            placeholder={filter.label}
            type={filter.type}
            name={filter.name}
            onChange={filter.onChange}
          />
        </div>
      )}
      <DefaultButton className="my-4" onClick={() => alert(disclaimer)}type="submit">Apply</DefaultButton>
    </form>
  );
};