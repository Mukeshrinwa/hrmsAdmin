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
    Autocomplete,
    DialogContent,
    DialogActions
} from '@mui/material';

import shiftmanagenmetApi from 'src/Api/shift_management/shiftmanagenmetApi';
import OfficeManagementApi from 'src/Api/office_Management/OfficeManagementApi';

import { Iconify } from 'src/components/iconify';

import SearchControl from './SearchControl'

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
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
            <Popup>Selected Location</Popup>
        </Marker>
    );
};

const AddLocationModal: React.FC<AddLocationModalProps> = ({ open, onClose, onSuccess }) => {
    const { addofficeManagement } = OfficeManagementApi();
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
        available_shifts: []
    });


    const [mapOpen, setMapOpen] = useState(false);
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [shifts, setShifts] = useState<any[]>([]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRadiusChange = (event: Event, newValue: number | number[]) => {
        setFormData((prev) => ({
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
                address: data.display_name || "",
                city: data.address?.city || data.address?.town || data.address?.village || "",
                state: data.address?.state || "",
                country: data.address?.country || "India",
                postal_code: data.address?.postcode || ""
            }));
        } catch (error) {
            console.error("Error fetching address details:", error);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Validate required fields
            if (!position) {
                throw new Error('Please select a location on the map');
            }

            if (!formData.default_shift) {
                throw new Error('Please select a default shift');
            }

            if (formData.available_shifts.length === 0) {
                throw new Error('Please select at least one available shift');
            }

            // Ensure default shift is included in available shifts
            const availableShifts = Array.from(new Set([
                formData.default_shift,
                ...formData.available_shifts
            ]));

            const officeData = {
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
                availabe_shifts: availableShifts,
            };

            console.log('Submitting:', officeData);
            await addofficeManagement(officeData);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error adding location:', error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchShiftData = async () => {
            try {
                const response = await fetchofficeShift();
                if (response && response) {
                    setShifts(response);
                }
            } catch (error) {
                console.error('Failed to fetch shifts', error);
            }
        };

        fetchShiftData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Add New Office Location</DialogTitle>
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
                            <Autocomplete
                                options={shifts}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(event, newValue) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        default_shift: newValue ? newValue._id : ''
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Default Shift"
                                        fullWidth
                                        required
                                        error={!formData.default_shift}
                                        helperText={!formData.default_shift ? "Please select a default shift" : ""}
                                    />
                                )}
                                isOptionEqualToValue={(option, value) => option._id === value._id}
                            />
                        </Grid>

                        {/* Available Shifts Selector */}
                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                options={shifts}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(event, newValue) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        available_shifts: newValue.map(shift => shift._id)
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Available Shifts"
                                        fullWidth
                                        required
                                        error={formData.available_shifts.length === 0}
                                        helperText={formData.available_shifts.length === 0 ? "Please select at least one shift" : ""}
                                    />
                                )}
                                isOptionEqualToValue={(option, value) => option._id === value._id}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="code"
                                label="Code"
                                fullWidth
                                value={formData.code}
                                onChange={handleChange}
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
                        disabled={loading || !position}
                    >
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
                            center={[28.6139, 77.2090]}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />

                            {/* Location marker */}
                            <LocationMarker
                                setPosition={handleSetPosition}
                                position={position}
                            />

                            {/* Add Search here */}
                            <SearchControl setPosition={handleSetPosition} />

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

export default AddLocationModal;
