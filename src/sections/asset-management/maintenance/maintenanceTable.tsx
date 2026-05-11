import type { Asset } from 'src/Interface/asset-managementinterfaces';

import React, { useState, useEffect } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    Box,
    Card,
    Grid,
    Chip,
    Table,
    Stack,
    Button,
    TableRow,
    TextField,
    TableCell,
    TableHead,
    TableBody,
    Typography,
    IconButton,
    FormControl,
    TableContainer,
    InputAdornment,
} from '@mui/material';

import assetsApi from 'src/Api/asset-management/assetsApi';

import { Iconify } from 'src/components/iconify';

import AddMaintenanceModal from './AddMaintenanceModal';
import UpdateMaintenanceModal from './UpdateMaintenanceModal';

const MaintenanceTable = () => {
    const { fetchMaintenanceData, fetchMaintenancebystatus, AddMaintenance, updateAssets } = assetsApi();

    const [underRepairAssets, setUnderRepairAssets] = useState<Asset[]>([]);
    const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

    const handleOpenUpdateModal = (asset: Asset) => {
        setSelectedAsset(asset);
        setOpenUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false);
        setSelectedAsset(null);
    };

    const handleUpdateAsset = async (data: any) => {
        if (!selectedAsset) return;

        try {
            await updateAssets(selectedAsset._id, data);
            // Refresh both lists
            await fetchData();
        } catch (eror) {
            console.error('Error updating asset:', eror);
        }
    };

    const fetchData = async () => {
        try {
            const maintenanceAssets = await fetchMaintenanceData();
            console.log('UNDER_REPAIR assets from API:', maintenanceAssets);
            setUnderRepairAssets(Array.isArray(maintenanceAssets) ? maintenanceAssets : []);

            const availableAssetsData = await fetchMaintenancebystatus();
            console.log('AVAILABLE assets from API:', availableAssetsData);
            setAvailableAssets(Array.isArray(availableAssetsData) ? availableAssetsData : []);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpenAssignModal = () => {
        setOpenAssignModal(true);
    };

    const handleCloseAssignModal = () => {
        setOpenAssignModal(false);
    };

    const handleAddMaintenance = async (assetId: string, maintenanceData: {
        date: string;
        description: string;
        cost: number;
        performedBy: string;
        nextMaintenanceDate?: string;
    }) => {
        try {
            await AddMaintenance({
                date: maintenanceData.date,
                description: maintenanceData.description,
                cost: maintenanceData.cost,
                performedBy: maintenanceData.performedBy,
                nextMaintenanceDate: maintenanceData.nextMaintenanceDate
            }, assetId);

            // Refresh the lists
            await fetchData();

        } catch (err) {
            console.error('Error adding maintenance:', err);
        }
        handleCloseAssignModal();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'UNDER_REPAIR':
                return 'warning';
            case 'MAINTENANCE':
                return 'warning';
            case 'ASSIGNED':
                return 'success';
            case 'AVAILABLE':
                return 'info';
            case 'RETIRED':
                return 'error';
            default:
                return 'default';
        }
    };



    


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card>
                <Box sx={{ p: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4} mb={2}>
                            <FormControl fullWidth>
                                <TextField
                                    placeholder="Search by asset name, code, serial..."
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Iconify icon="eva:search-fill" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={8} container justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginRight: '20px' }}
                                startIcon={<Iconify icon="gridicons:add-outline" />}
                                onClick={handleOpenAssignModal}
                                disabled={availableAssets.length === 0}
                            >
                                Add Maintenance
                            </Button>
                        </Grid>
                    </Grid>

                    {/* UNDER REPAIR ASSETS SECTION */}
                    {underRepairAssets.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, color: 'warning.main' }}>
                                Assets Under Repair
                            </Typography>
                            <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                                <Table sx={{ minWidth: 1040 }} aria-label="under repair assets table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ width: '10%', minWidth: 150 }}>Asset Name</TableCell>
                                            <TableCell sx={{ width: '10%', minWidth: 150 }}>Asset Code</TableCell>
                                            <TableCell sx={{ width: '10%', minWidth: 150 }}>Asset Type</TableCell>
                                            <TableCell sx={{ width: '15%', minWidth: 200 }}>Serial Number</TableCell>
                                            <TableCell sx={{ width: '10%', minWidth: 100 }}>Condition</TableCell>
                                            <TableCell sx={{ width: '10%', minWidth: 150 }}>Status</TableCell>
                                            <TableCell sx={{ width: '10%', minWidth: 150 }}>Notes</TableCell>
                                            <TableCell sx={{ width: '10%', minWidth: 150 }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {underRepairAssets.map((asset) => (
                                            <TableRow key={asset._id}>
                                                <TableCell>{asset.assetName || 'N/A'}</TableCell>
                                                <TableCell>{asset.assetCode || 'N/A'}</TableCell>
                                                <TableCell>{asset.assetType || 'N/A'}</TableCell>
                                                <TableCell>{asset.serialNumber || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={asset.condition || 'UNKNOWN'}
                                                        size="small"
                                                        color={asset.condition === 'GOOD' ? 'success' : 'warning'}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={asset.status || 'UNKNOWN'}
                                                        color={getStatusColor(asset.status) as any}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{asset.notes || 'No notes'}</TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1}>
                                                        <IconButton
                                                            onClick={() => handleOpenUpdateModal(asset)}
                                                            size="small"
                                                        >
                                                            <Iconify icon="eva:edit-2-outline" />
                                                        </IconButton>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {/* AVAILABLE ASSETS SECTION */}
                    <Box>
                  
                        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                            <Table sx={{ minWidth: 1040 }} aria-label="available assets table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: '10%', minWidth: 150 }}>Asset Name</TableCell>
                                        <TableCell sx={{ width: '10%', minWidth: 150 }}>Asset Code</TableCell>
                                        <TableCell sx={{ width: '10%', minWidth: 150 }}>Asset Type</TableCell>
                                        <TableCell sx={{ width: '15%', minWidth: 200 }}>Serial Number</TableCell>
                                        <TableCell sx={{ width: '10%', minWidth: 100 }}>Condition</TableCell>
                                        <TableCell sx={{ width: '10%', minWidth: 150 }}>Status</TableCell>
                                        <TableCell sx={{ width: '10%', minWidth: 150 }}>Notes</TableCell>
                                        <TableCell sx={{ width: '10%', minWidth: 150 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {availableAssets.length > 0 ? (
                                        availableAssets.map((asset) => (
                                            <TableRow key={asset._id}>
                                                <TableCell>{asset.assetName || 'N/A'}</TableCell>
                                                <TableCell>{asset.assetCode || 'N/A'}</TableCell>
                                                <TableCell>{asset.assetType || 'N/A'}</TableCell>
                                                <TableCell>{asset.serialNumber || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={asset.condition || 'UNKNOWN'}
                                                        size="small"
                                                        color={asset.condition === 'GOOD' ? 'success' : 'warning'}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={asset.status || 'UNKNOWN'}
                                                        color={getStatusColor(asset.status) as any}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{asset.notes || 'No notes'}</TableCell>
                                                <TableCell>
                                                 
                                                        <IconButton
                                                            onClick={() => handleOpenUpdateModal(asset)}
                                                            size="small"
                                                        >
                                                            <Iconify icon="eva:edit-2-outline" />
                                                        </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center">
                                                <Typography variant="body1" color="textSecondary">
                                                    No available assets found
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                    All assets are either under repair or assigned.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>

                <AddMaintenanceModal
                    open={openAssignModal}
                    onClose={handleCloseAssignModal}
                    onAddMaintenance={handleAddMaintenance}
                    assets={availableAssets.map(asset => ({
                        _id: asset._id,
                        name: asset.assetName || 'Unnamed Asset',
                        serialNumber: asset.serialNumber || 'No Serial'
                    }))}
                />
                <UpdateMaintenanceModal
                    open={openUpdateModal}
                    onClose={handleCloseUpdateModal}
                    onSubmit={handleUpdateAsset}
                    selectedAsset={selectedAsset}
                />
            </Card>
        </LocalizationProvider>
    );
};

export default MaintenanceTable;