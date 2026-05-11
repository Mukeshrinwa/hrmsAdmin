import 'leaflet/dist/leaflet.css';

import type { OfficeData } from 'src/Interface/Office_table.interface';

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
    DialogActions
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import SearchControl from './SearchControl';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


interface EditLocationModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData: OfficeData;
    updateofficeManagement: (_id: string, data: any) => Promise<any>;
}

const LocationMarker = ({ setPosition, position }: {
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
            <Popup>Office Location</Popup>
        </Marker>
    );
};

const EditLocationModal: React.FC<EditLocationModalProps> = ({
    open,
    onClose,
    onSuccess,
    initialData,
    updateofficeManagement
}) => {
    const [formData, setFormData] = useState({
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
        available_shifts: [] as string[]
    });

    const [mapOpen, setMapOpen] = useState(false);
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData && open) {
            const initPosition = {
                lat: initialData.location.latitude,
                lng: initialData.location.longitude
            };

            setPosition(initPosition);
            setFormData({
                name: initialData.name,
                code: initialData.code || '',
                latitude: initialData.location.latitude.toString(),
                longitude: initialData.location.longitude.toString(),
                address: initialData.location.address || '',
                city: initialData.location.city || '',
                state: initialData.location.state || '',
                country: initialData.location.country || 'India',
                postal_code: initialData.location.postal_code || '',
                radius: initialData.radius || 150,
                status: initialData.status !== undefined ? initialData.status : true,
                default_shift: initialData.default_shift || '',
                available_shifts: initialData.available_shifts || []
            });
        }
    }, [initialData, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRadiusChange = (event: Event, newValue: number | number[]) => {
        setFormData(prev => ({
            ...prev,
            radius: newValue as number
        }));
    };

    const handleSetPosition = async (lat: number, lng: number) => {
        setPosition({ lat, lng });
        setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString()
        }));

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();

            setFormData(prev => ({
                ...prev,
                address: data.display_name || prev.address,
                city: data.address?.city || data.address?.town || data.address?.village || prev.city,
                state: data.address?.state || prev.state,
                country: data.address?.country || prev.country,
                postal_code: data.address?.postcode || prev.postal_code
            }));
        } catch (error) {
            console.error("Error fetching address details:", error);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const updatedData = {
                name: formData.name,
                code: formData.code,
                location: {
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude),
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    postal_code: formData.postal_code
                },
                radius: formData.radius,
                status: formData.status,
                default_shift: formData.default_shift,
                available_shifts: formData.available_shifts
            };

            await updateofficeManagement(initialData._id, updatedData);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating location:', error);
            // Add error handling here
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit Office Location</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12}>
                            <TextField
                                name="name"
                                label="Office Name"
                                fullWidth
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="location"
                                label="Location"
                                fullWidth
                                value={position ? `${formData.latitude}, ${formData.longitude}` : ''}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <IconButton
                                            onClick={() => setMapOpen(true)}
                                            color="primary"
                                        >
                                            <Iconify icon="solar:streets-map-point-linear" width={24} height={24} />
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="address"
                                label="Address"
                                fullWidth
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="city"
                                label="City"
                                fullWidth
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="state"
                                label="State"
                                fullWidth
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="country"
                                label="Country"
                                fullWidth
                                value={formData.country}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="postal_code"
                                label="Postal Code"
                                fullWidth
                                value={formData.postal_code}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="radius"
                                label="Radius (meters)"
                                fullWidth
                                value={formData.radius}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <IconButton
                                            onClick={() => setMapOpen(true)}
                                            color="primary"
                                        >
                                            <Iconify icon="solar:ruler-pen-linear" width={24} height={24} />
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Map Dialog */}
            <Dialog open={mapOpen} onClose={() => setMapOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Edit Location
                    <IconButton
                        aria-label="close"
                        onClick={() => setMapOpen(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Iconify icon="mdi:close" />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ height: '400px' }}>
                    <Box sx={{ height: '80%', width: '100%' }}>
                        <MapContainer
                            center={position || [initialData.location.latitude, initialData.location.longitude]}
                            zoom={15}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />

                            {/* Search bar */}
                            <SearchControl setPosition={handleSetPosition} />

                            <LocationMarker
                                setPosition={handleSetPosition}
                                position={position}
                            />
                            {position && (
                                <Circle
                                    center={[position.lat, position.lng]}
                                    radius={formData.radius}
                                    pathOptions={{
                                        color: '#1976d2',
                                        fillColor: '#1976d2',
                                        fillOpacity: 0.5,
                                    }}
                                />
                            )}
                        </MapContainer>

                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography gutterBottom>Set Radius: {formData.radius}m</Typography>
                        <Slider
                            value={formData.radius}
                            onChange={handleRadiusChange}
                            aria-labelledby="radius-slider"
                            valueLabelDisplay="auto"
                            step={10}
                            marks
                            min={50}
                            max={1000}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setMapOpen(false)}
                        color="primary"
                        disabled={!position}
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EditLocationModal;