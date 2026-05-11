import 'leaflet/dist/leaflet.css';

import type { FormData, AddLocationModalProps } from 'src/Interface/Office_table.interface';

import L from 'leaflet';
import React, { useState, useEffect } from 'react';
import { Popup, Marker, Circle, TileLayer, MapContainer, useMapEvents } from 'react-leaflet';

import {
  Box,
  Grid,
  Dialog,
  Button,
  Slider,
  TextField,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import shiftmanagenmetApi from 'src/Api/shift_management/shiftmanagenmetApi';
import OfficeManagementApi from 'src/Api/office_Management/OfficeManagementApi';

import { Iconify } from 'src/components/iconify';

import SearchControl from './SearchControl';

// Leaflet Marker Fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Location marker
const LocationMarker = ({
  setPosition,
  position,
}: {
  setPosition: (lat: number, lng: number) => void;
  position: { lat: number; lng: number } | null;
}) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
};

const AddLocationModal: React.FC<AddLocationModalProps> = ({ open, onClose, onSuccess }) => {
  const { addCompanyLoction } = OfficeManagementApi();
  const { fetchofficeShift } = shiftmanagenmetApi();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    code: '',
    latitude: '',
    longitude: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    postal_code: '',
    radius: 150,
    status: true,
    default_shift: '',
    available_shifts: [],
  });

  const [mapOpen, setMapOpen] = useState(false);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [shifts, setShifts] = useState<any[]>([]);
  console.log(shifts, " Shifts Data");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Radius slider handler
  const handleRadiusChange = (event: Event, newValue: number | number[]) => {
    setFormData((prev) => ({
      ...prev,
      radius: newValue as number,
    }));
  };

  // Set map selected position
  const handleSetPosition = async (lat: number, lng: number) => {
    setPosition({ lat, lng });

    setFormData((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));

    // Reverse Geocoding
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      setFormData((prev) => ({
        ...prev,
        address: data.display_name || '',
        city: data.address?.city || data.address?.town || data.address?.village || '',
        state: data.address?.state || '',
        country: data.address?.country || 'India',
        postal_code: data.address?.postcode || '',
      }));
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  // SUBMIT — Backend Required JSON Format
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!position) throw new Error('Please select a location on the map');

      const officeData = {
        name: formData.name,

        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.postal_code,
        },

        coordinates: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        },

        timezone: 'Asia/Kolkata',
        isHeadOffice: false,
        geofenceEnabled: true,
        geofenceRadius: formData.radius,
      };

      console.log('Submitting:', officeData);

      await addCompanyLoction(officeData);

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load shifts
  useEffect(() => {
    const fetchShiftData = async () => {
      try {
        const response = await fetchofficeShift();
        if (response) setShifts(response);
      } catch (error) {
        console.error('Shift fetch failed:', error);
      }
    };

    fetchShiftData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Main Dialog */}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Office Location</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField name="name" label="Office Name" fullWidth value={formData.name} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Location"
                fullWidth
                value={position ? `${formData.latitude}, ${formData.longitude}` : ''}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <IconButton onClick={() => setMapOpen(true)} color="primary">
                      <Iconify icon="solar:streets-map-point-linear" width={24} height={24} />
                    </IconButton>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField name="address" label="Street Address" fullWidth value={formData.address} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="city" label="City" fullWidth value={formData.city} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="state" label="State" fullWidth value={formData.state} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="country" label="Country" fullWidth value={formData.country} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="postal_code"
                label="ZIP Code"
                fullWidth
                value={formData.postal_code}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom>Geofence Radius: {formData.radius}m</Typography>
              <Slider
                value={formData.radius}
                onChange={handleRadiusChange}
                step={10}
                min={50}
                max={2000}
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading || !position}>
            {loading ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Map Dialog */}
      <Dialog open={mapOpen} onClose={() => setMapOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Select Location
          <IconButton
            aria-label="close"
            onClick={() => setMapOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'gray' }}
          >
            <Iconify icon="mdi:close" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ height: '400px' }}>
          <Box sx={{ height: '80%', width: '100%' }}>
            <MapContainer center={[28.6139, 77.209]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <LocationMarker setPosition={handleSetPosition} position={position} />
              <SearchControl setPosition={handleSetPosition} />

              {position && (
                <Circle
                  center={[position.lat, position.lng]}
                  radius={formData.radius}
                  pathOptions={{ color: '#1976d2', fillOpacity: 0.4 }}
                />
              )}
            </MapContainer>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setMapOpen(false)} disabled={!position}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddLocationModal;
