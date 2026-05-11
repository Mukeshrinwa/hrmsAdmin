import 'leaflet/dist/leaflet.css';

import type { OfficeData } from 'src/Interface/company_table.interface';

import L from 'leaflet';
import React, { useState, useEffect } from 'react';
import { Popup, Marker, Circle, TileLayer, MapContainer, useMapEvents } from 'react-leaflet';

import {
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
    updateCompanyManagement: (locationId: string, data: any) => Promise<any>;
}

const LocationMarker = ({ setPosition, position }: any) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng.lat, e.latlng.lng);
        }
    });

    return position ? (
        <Marker position={position}>
            <Popup>Office Location</Popup>
        </Marker>
    ) : null;
};

const EditLocationModal: React.FC<EditLocationModalProps> = ({
    open,
    onClose,
    onSuccess,
    initialData,
    updateCompanyManagement
}) => {

    const [formData, setFormData] = useState({
        name: "",
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        radius: 150
    });

    const [mapOpen, setMapOpen] = useState(false);
    const [position, setPosition] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData && open) {
            setFormData({
                name: initialData.name,
                street: initialData.address?.street || "",
                city: initialData.address?.city || "",
                state: initialData.address?.state || "",
                country: initialData.address?.country || "",
                zipCode: initialData.address?.zipCode || "",
                latitude: initialData.coordinates.latitude.toString(),
                longitude: initialData.coordinates.longitude.toString(),
                radius: initialData.geofence?.radius || 150
            });

            setPosition({
                lat: initialData.coordinates.latitude,
                lng: initialData.coordinates.longitude
            });
        }
    }, [initialData, open]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRadiusChange = (event: any, newValue: any) => {
        setFormData(prev => ({
            ...prev,
            radius: newValue
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
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();

            setFormData(prev => ({
                ...prev,
                street: data.address?.road || prev.street,
                city: data.address?.city || data.address?.town || data.address?.village || prev.city,
                state: data.address?.state || prev.state,
                country: data.address?.country || prev.country,
                zipCode: data.address?.postcode || prev.zipCode
            }));
        } catch (err) {
            console.log("Address fetch error:", err);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        const payload = {
            name: formData.name,
            address: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                zipCode: formData.zipCode
            },
            coordinates: {
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            },
            geofence: {
                enabled: true,
                radius: formData.radius
            }
        };

        try {
            await updateCompanyManagement(initialData._id, payload);
            onSuccess();
            onClose();
        } catch (error) {
            console.log("Error updating:", error);
        }

        setLoading(false);
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
                                label="Coordinates"
                                fullWidth
                                value={`${formData.latitude}, ${formData.longitude}`}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <IconButton onClick={() => setMapOpen(true)}>
                                            <Iconify icon="solar:streets-map-point-linear" />
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                name="street"
                                label="Street"
                                fullWidth
                                value={formData.street}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                name="city"
                                label="City"
                                fullWidth
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                name="state"
                                label="State"
                                fullWidth
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                name="country"
                                label="Country"
                                fullWidth
                                value={formData.country}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                name="zipCode"
                                label="Zip Code"
                                fullWidth
                                value={formData.zipCode}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography gutterBottom>Geofence Radius: {formData.radius} meters</Typography>

                            <Slider
                                value={formData.radius}
                                onChange={handleRadiusChange}
                                min={50}
                                max={1000}
                                step={10}
                                valueLabelDisplay="auto"
                            />
                        </Grid>
                    </Grid>

                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Map Popup */}
            <Dialog open={mapOpen} onClose={() => setMapOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Select Location
                    <IconButton
                        onClick={() => setMapOpen(false)}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <Iconify icon="mdi:close" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ height: 400 }}>
                    <MapContainer
                        center={position || [28.7, 77.1]}
                        zoom={15}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        <SearchControl setPosition={handleSetPosition} />

                        <LocationMarker setPosition={handleSetPosition} position={position} />

                        {position && (
                            <Circle
                                center={position}
                                radius={formData.radius}
                                pathOptions={{
                                    color: "#1976d2",
                                    fillColor: "#1976d2",
                                    fillOpacity: 0.4
                                }}
                            />
                        )}
                    </MapContainer>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EditLocationModal;
