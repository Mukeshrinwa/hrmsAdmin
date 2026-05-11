import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Popup, Marker, Circle, useMap, TileLayer, MapContainer } from 'react-leaflet';

import loctionApi from 'src/Api/location/loctionApi';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const radius = 500;

const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center[0] !== 0 && center[1] !== 0) {
      map.flyTo(center, 15); 
    }
  }, [center, map]);

  return null;
};

const Location: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { AllloctionfetchEmployee } = loctionApi();
  const [center, setCenter] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const fetchLocation = async () => {
      if (id) {
        const response = await AllloctionfetchEmployee(id);
        console.log('API Response:', response);

        const location = response?.data?.[0];
        if (location?.latitude && location?.longitude) {
          console.log('Setting Center:', location.latitude, location.longitude);
          setCenter([location.latitude, location.longitude]);
        } else {
          console.log('No valid location found.');
        }
      }
    };

    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div style={{ position: 'relative' }}>
      {center[0] !== 0 && center[1] !== 0 && (
        <MapContainer
          center={center}
          zoom={15}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapUpdater center={center} />
          <Marker position={center}>
            <Popup>Your Location</Popup>
          </Marker>
          <Circle
            center={center}
            radius={radius}
            pathOptions={{
              color: 'blue',
              fillColor: 'blue',
              fillOpacity: 0.2,
              weight: 2,
              opacity: 0.8,
            }}
          />
        </MapContainer>
      )}
    </div>
  );
};

export default Location;
