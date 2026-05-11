import 'leaflet-geosearch/dist/geosearch.css';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

const SearchControl = ({ setPosition }: { setPosition: (lat: number, lng: number) => void }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

      const searchControl = new (GeoSearchControl as any)({
      provider,
      style: 'bar',
      autoComplete: true,
      autoCompleteDelay: 250,
      showMarker: true,
      showPopup: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
    });

    map.addControl(searchControl);

    map.on('geosearch/showlocation', (result: any) => {
      const { x: lng, y: lat } = result.location;
      setPosition(lat, lng);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, setPosition]);

  return null;
};

export default SearchControl;
