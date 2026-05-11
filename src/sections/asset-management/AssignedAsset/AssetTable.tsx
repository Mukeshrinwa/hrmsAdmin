import type { Asset, Employee, ReturnAssetData } from 'src/Interface/asset-managementinterfaces';

import React, { useState, useEffect } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    Box,
    Card,
    Grid,
    Table,
    Button,
    TableRow,
    TextField,
    TableCell,
    TableHead,
    TableBody,
    Typography,
    FormControl,
    TableContainer,
    InputAdornment,
} from '@mui/material';

import assetsApi from 'src/Api/asset-management/assetsApi';

import { Iconify } from 'src/components/iconify';

import AssignAssetModal from './AssignAssetModal';
import CollectAssetModal from './CollectAssetModal';

const AssetTable = () => {
    const { fetchAssetsDataAssigned, assingAssets, fetchAllEmployees, collectAsset } = assetsApi();

    const [assets, setAssets] = useState<Asset[]>([]);
    const [unassignedAssets, setUnassignedAssets] = useState<Asset[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    const [openCollectModal, setOpenCollectModal] = useState(false);
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            
            try {
                const assetsArray = await fetchAssetsDataAssigned();
                
                // Check if assetsArray is an array and not empty
                if (Array.isArray(assetsArray)) {
                    const assignedAssets = assetsArray.filter((asset: Asset) => asset.assignedTo !== null);
                    const unassigned = assetsArray.filter((asset: Asset) => asset.assignedTo === null);
                    setAssets(assignedAssets);
                    setUnassignedAssets(unassigned);
                    
                    if (assignedAssets.length === 0 && unassigned.length === 0) {
                        // No data is available, but this is not an error
                        console.log('No assets found in the system');
                    }
                } else {
                    // If assetsArray is not an array, set empty arrays
                    setAssets([]);
                    setUnassignedAssets([]);
                    console.log('No assets data received');
                }

                const employeesResponse = await fetchAllEmployees();
                setEmployees(employeesResponse.data);

            } catch (err) {
                console.error('Error fetching data:', err);
                // Only show error if there's an actual API error
            } 
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpenCollectModal = (asset: Asset) => {
        setSelectedAsset(asset);
        setOpenCollectModal(true);
    };

    const handleCloseCollectModal = () => {
        setOpenCollectModal(false);
        setSelectedAsset(null);
    };

    const handleOpenAssignModal = () => {
        setOpenAssignModal(true);
    };

    const handleCloseAssignModal = () => {
        setOpenAssignModal(false);
    };

    const handleConfirmCollect = async (returnData: ReturnAssetData) => {
        if (!selectedAsset) return;

        try {
            await collectAsset(returnData, selectedAsset._id);

            const assetsArray = await fetchAssetsDataAssigned();
            
            if (Array.isArray(assetsArray)) {
                const assignedAssets = assetsArray.filter((asset: Asset) => asset.assignedTo !== null);
                const unassigned = assetsArray.filter((asset: Asset) => asset.assignedTo === null);
                setAssets(assignedAssets);
                setUnassignedAssets(unassigned);
            }

            handleCloseCollectModal();
        } catch (err) {
            console.error('Error collecting asset:', err);
        }
    };

    const handleAssignAsset = async (assignmentData: {
        selectedAssetId: string;
        selectedEmployeeId: string;
        assignmentDate: string;
        expectedReturnDate?: string;
        notes: string;
    }) => {
        try {
            await assingAssets({
                assignedTo: assignmentData.selectedEmployeeId,
                assignmentDate: assignmentData.assignmentDate,
                expectedReturnDate: assignmentData.expectedReturnDate,
                notes: assignmentData.notes
            }, assignmentData.selectedAssetId);

            // Refresh the asset list
            const assetsArray = await fetchAssetsDataAssigned();
            
            if (Array.isArray(assetsArray)) {
                const assignedAssets = assetsArray.filter((asset: Asset) => asset.assignedTo !== null);
                const unassigned = assetsArray.filter((asset: Asset) => asset.assignedTo === null);
                setAssets(assignedAssets);
                setUnassignedAssets(unassigned);
            }
        } catch (err) {
            console.error('Error assigning asset:', err);
        }
        handleCloseAssignModal()
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'Invalid Date';
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
                                    placeholder="Search..."
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
                            >
                                Assign Asset
                            </Button>
                        </Grid>
                    </Grid>

                    <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                        <Table sx={{ minWidth: 1040 }} aria-label="assets table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: '25%', minWidth: 250 }}>Employee Name/ID</TableCell>
                                    <TableCell sx={{ width: '10%', minWidth: 200 }}>Asset Type</TableCell>
                                    <TableCell sx={{ width: '15%', minWidth: 50 }}>Model</TableCell>
                                    <TableCell sx={{ width: '20%', minWidth: 150 }}>Notes</TableCell>
                                    <TableCell sx={{ width: '15%', minWidth: 150 }}>Assigned On</TableCell>
                                    <TableCell sx={{ width: '20%', minWidth: 150 }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {assets.length > 0 ? (
                                    assets.map((asset) => (
                                        <TableRow key={asset._id}>
                                            <TableCell sx={{ width: '25%' }}>
                                                {asset.assignedTo?.first_name} {asset.assignedTo?.last_name}
                                                {asset.assignedTo?.employee_id && ` (${asset.assignedTo.employee_id})`}
                                            </TableCell>
                                            <TableCell sx={{ width: '10%' }}>{asset.assetType}</TableCell>
                                            <TableCell sx={{ width: '15%' }}>{asset.modelNumber} ({asset.serialNumber})</TableCell>
                                            <TableCell sx={{ width: '20%' }}>{asset.notes}</TableCell>
                                            <TableCell sx={{ width: '15%' }}>{formatDate(asset.assignmentDate)}</TableCell>
                                            <TableCell sx={{ width: '20%' }}>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => handleOpenCollectModal(asset)}
                                                    size="small"
                                                >
                                                    Collect Asset
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <Typography variant="body1" color="textSecondary">
                                                No assigned assets found
                                            </Typography>
                                            {unassignedAssets.length > 0 && (
                                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                    You have {unassignedAssets.length} unassigned assets available.
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <CollectAssetModal
                    open={openCollectModal}
                    onClose={handleCloseCollectModal}
                    onConfirm={handleConfirmCollect}
                    selectedAsset={selectedAsset}
                />

                <AssignAssetModal
                    open={openAssignModal}
                    onClose={handleCloseAssignModal}
                    onAssign={handleAssignAsset}
                    unassignedAssets={unassignedAssets}
                    employees={employees}
                />
            </Card>
        </LocalizationProvider>
    );
};

export default AssetTable;
