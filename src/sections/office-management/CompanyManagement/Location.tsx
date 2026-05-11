// import 'leaflet/dist/leaflet.css';
// import 'leaflet-geosearch/dist/geosearch.css';

// import type { LatLng } from 'leaflet';

// import React, { useState } from 'react';
// import { Popup, Marker, Circle,useMap, TileLayer, MapContainer ,useMapEvents } from 'react-leaflet';
// import { SearchControl as LeafletSearchControl, OpenStreetMapProvider as LeafletOpenStreetMapProvider } from 'leaflet-geosearch';

// import { Box } from '@mui/material';

// interface LocationProps {
//   value: number;
//   locationName:string;
//   setLocationName:(locationName: string) => void;
// }

// interface SearchChangeInfo {
//   latLng: LatLng;
//   info: string | string[];
//   raw: Record<string, unknown>;
// }

// const Location: React.FC<LocationProps> = ({ value ,locationName,setLocationName}) => {
//   const initialPosition: [number, number] = [26.9352, 75.749];
//   const [position, setPosition] = useState<[number, number]>(initialPosition);
   
//   const radius = value;
//   const fetchAddress = async (lat: number, lng: number) => {
//     try {
//       const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
//       const data = await response.json();
//       const address = data.display_name || 'Address not found';
//       setLocationName(address);
//     } catch (error) {
//       console.error('Error fetching address:', error);
//       setLocationName('Error fetching address');
//     }
//   };
//   const handleSearchChange = (info: SearchChangeInfo) => {
//     setPosition([info.latLng.lat, info.latLng.lng]);
//   };

//   const CustomSearchControl = () => {
//     const map = useMap();

//     React.useEffect(() => {
//       const provider = new (LeafletOpenStreetMapProvider as any)();
//       const searchControl = new (LeafletSearchControl as any)({
//         provider,
//         style: 'bar',
//         showMarker: true,
//         showPopup: false,
//         autoClose: true,
//         retainZoomLevel: false,
//         animateZoom: true,
//         keepResult: true,
//       });

//       map.addControl(searchControl);
//       map.on('geosearch/showlocation', (result: any) => {
//         handleSearchChange({
//           latLng: result.location,
//           info: result.query,
//           raw: result.raw,
//         });
//       });

//       return () => {
//         map.removeControl(searchControl);
//       };
//     }, [map]);

//     return null;
//   };
//   const MapEvents = () => {
//     useMapEvents({
//       click(e) {
//         const { lat, lng } = e.latlng;
//         setPosition([lat, lng]);
//         fetchAddress(lat, lng);
//       },
//     });
//     return null;
//   };
//   return (
//     <Box sx={{ position: 'relative', width: '100%', borderRadius: '10px' }}>
//       <MapContainer center={position} zoom={15} style={{ height: '400px', width: '100%',borderRadius:'10px' }}>
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//          <MapEvents />
//         <CustomSearchControl />
//         <Marker position={position}>
//           <Popup>
//             {locationName}
//           </Popup>
//         </Marker>
//         <Circle
//           center={position} 
//           radius={radius}
//           pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
//         />
//       </MapContainer>
//     </Box>
//   );
// };

// export default Location;