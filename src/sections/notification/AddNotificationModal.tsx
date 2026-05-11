import React, { useState, useEffect } from 'react';

import { Box, Grid, Modal, Button, TextField, Typography, Autocomplete } from '@mui/material';

import useDepartmentsApi from 'src/Api/all_departments/useDepartmentsApi';
import useAnnouncementsApi from 'src/Api/announcements/useAnnouncementsApi';

interface AddNotificationModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: () => void;
}

interface Employee {
    _id: string;
    first_name: string;
    last_name: string;
}

// Update this interface to match the API response exactly
interface Department {
    _id?: string; // Make _id optional to match the API
    name: string;
    department_id: string;
}

const AddNotificationModal: React.FC<AddNotificationModalProps> = ({ open, onClose, onAdd }) => {
    const { addAnnouncement, fetchAllEmployees } = useAnnouncementsApi();
    const { fetchAllDepartments } = useDepartmentsApi();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [notification, setNotification] = useState({
        title: '',
        content: '',
        author_id: '',
        audience: [] as string[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNotification({ ...notification, [name]: value });
    };

    const handleAdd = async () => {
        try {
            await addAnnouncement(notification);
            onAdd();
            onClose();
        } catch (error) {
            console.error('Error adding notification:', error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const employeeData = await fetchAllEmployees();
                setEmployees(employeeData);
                
                const departmentData = await fetchAllDepartments();
                // Add type assertion if needed
                setDepartments(departmentData.data as Department[]); 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                borderRadius: '12px',
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography variant="h6" component="h2">
                    Add Announcement
                </Typography>
                <Grid container spacing={2} mt={2}>
                    <Grid item xs={12}>
                        <Autocomplete
                            options={employees}
                            getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Author"
                                    variant="outlined"
                                />
                            )}
                            onChange={(event, newValue) => {
                                setNotification({ ...notification, author_id: newValue?._id || '' });
                            }}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={notification.title}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Content"
                            name="content"
                            multiline
                            rows={4}
                            value={notification.content}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            options={departments}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Audience (Departments)"
                                    variant="outlined"
                                />
                            )}
                            onChange={(event, newValue) => {
                                setNotification({ 
                                    ...notification, 
                                    audience: newValue.map((dept) => dept._id || '') 
                                });
                            }}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                        />
                    </Grid>
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} color="secondary" sx={{ mr: 2 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} variant="contained" color="primary">
                        Add Announcement
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddNotificationModal;