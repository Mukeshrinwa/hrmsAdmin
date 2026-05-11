import type { Dayjs } from 'dayjs';
import type { SelectChangeEvent } from '@mui/material';
import type { Asset, AddForm, Employee, ReturnAssetData, MaintenanceHistory } from 'src/Interface/asset-managementinterfaces';

import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Grid,
  Chip,
  Menu,
  Table,
  Button,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  IconButton,
  FormControl,
  TableContainer,
  InputAdornment
} from '@mui/material';

import assetsApi from 'src/Api/asset-management/assetsApi';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import AddAssetModal from './AddAssetModal';
import AssignAssetModal from './AssignAssetModal';
import DeleteAssetModal from './DeleteAssetModal';
import UpdateAssetModal from './UpdateAssetModal';
import CollectAssetModal from './CollectAssetModal';
import MaintenanceHistoryModal from './MaintenanceHistoryModal';

const AssetList = () => {
  const { GetAssetByID, fetchAssetsData, addassingAssets, fetchAllEmployees, assingAssets, collectAsset, deleteAssets, updateAssets } = assetsApi();
  const [openCollectModal, setOpenCollectModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [assetToUpdate, setAssetToUpdate] = useState<Asset | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceHistory[]>([]);
  // Assign Asset state
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    assignedTo: '',
    assignmentDate: dayjs().format('YYYY-MM-DD'),
    expectedReturnDate: dayjs().add(6, 'month').format('YYYY-MM-DD'),
    notes: ''
  });

  const [addForm, setAddForm] = useState<AddForm>({
    name: '',
    category: '',
    assetType: '',
    serialNumber: '',
    purchaseDate: new Date().toISOString(),
    warrantyExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'AVAILABLE',
    purchasePrice: 0,
    currentValue: 0,
    condition: 'NEW',
    location: '',
    notes: '',
    branchId: '',
    departmentId: ''
  });


  const openMenu = Boolean(anchorEl);

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const assetsList = await fetchAssetsData();
        setAssets(assetsList);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetchAllEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };


  // Collect Asset handlers
  const handleOpenCollectModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setOpenCollectModal(true);
  };

  const handleCloseCollectModal = () => {
    setOpenCollectModal(false);
    setSelectedAsset(null);
  };

  const handleConfirmCollect = async (returnData: ReturnAssetData) => {
    if (!selectedAsset) return;

    try {
      await collectAsset(returnData, selectedAsset._id);

      const response = await fetchAssetsData();
      // Updated to handle the new API response structure
      if (response.data && response.data.assets) {
        setAssets(response.data.assets);
      } else if (Array.isArray(response.data)) {
        setAssets(response.data);
      }

      handleCloseCollectModal();
    } catch (error) {
      console.error('Error collecting asset:', error);
    }
  };

  const handleOpenAssignModal = (asset: Asset) => {
    setSelectedAsset(asset);
    fetchEmployees();
    setOpenAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setOpenAssignModal(false);
    setSelectedAsset(null);
    setAssignmentForm({
      assignedTo: '',
      assignmentDate: new Date().toISOString().split('T')[0],
      expectedReturnDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleAssignmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssignmentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name: string, value: Dayjs | null) => {
    if (value) {
      setAssignmentForm(prev => ({
        ...prev,
        [name]: value.format('YYYY-MM-DD')
      }));
    }
  };

  const handleAddDateChange = (name: string, value: Dayjs | null) => {
    if (value) {
      setAddForm(prev => ({
        ...prev,
        [name]: value.format('YYYY-MM-DD')
      }));
    }
  };

  const handleAssignAsset = async () => {
    if (!selectedAsset) return;

    try {
      const assignmentData = {
        assignedTo: assignmentForm.assignedTo,
        assignmentDate: assignmentForm.assignmentDate,
        expectedReturnDate: assignmentForm.expectedReturnDate,
        notes: assignmentForm.notes
      };

      await assingAssets(assignmentData, selectedAsset._id);

      // Refresh assets list
      const response = await fetchAssetsData();
      // Updated to handle the new API response structure
      if (response.data && response.data.assets) {
        setAssets(response.data.assets);
      } else if (Array.isArray(response.data)) {
        setAssets(response.data);
      }

      handleCloseAssignModal();
    } catch (error) {
      console.error('Error assigning asset:', error);
    }
  };

  // Delete Asset handlers
  const handleDeleteAsset = (id: string) => {
    setAssetToDelete(id);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!assetToDelete) return;

    try {
      await deleteAssets(assetToDelete);

      // Refresh assets list after deletion
      const response = await fetchAssetsData();
      // Updated to handle the new API response structure
      if (response.data && response.data.assets) {
        setAssets(response.data.assets);
      } else if (Array.isArray(response.data)) {
        setAssets(response.data);
      }

      setOpenDeleteModal(false);
      setAssetToDelete(null);
      toast.success('Asset Deleted successfully')
    } catch (error) {
      toast.error('Error Deleting Asset')
      console.error('Error deleting asset:', error);
    }
  };

  const handleCloseAddAssignModal = () => {
    setOpenAssignModal(false);
    setAddForm({
      name: '',
      category: '',
      assetType: '',
      serialNumber: '',
      purchaseDate: new Date().toISOString(),
      warrantyExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'AVAILABLE',
      purchasePrice: 0,
      currentValue: 0,
      condition: 'NEW',
      location: '',
      notes: '',
      branchId: '',
      departmentId: ''
    });
  };

  const handleSubmitaddAssign = async () => {
    try {
      const assetData = {
        assetCode: addForm.serialNumber,
        assetType: addForm.assetType,   // 👈 FIXED
        assetName: addForm.name,
        serialNumber: addForm.serialNumber,
        purchaseDate: addForm.purchaseDate,
        purchasePrice: Number(addForm.purchasePrice),
        warrantyExpiryDate: addForm.warrantyExpiry,
        condition: addForm.condition,
        notes: addForm.notes,

        category: addForm.category,  // 👈 NOW DIFFERENT FROM assetType

        location: {
          branchId: addForm.branchId,
          departmentId: addForm.departmentId,
        }
      };


      await addassingAssets(assetData);
      toast.success("Asset added successfully");

      const updatedAssets = await fetchAssetsData();
      setAssets(updatedAssets.data?.assets || updatedAssets.data || []);

      handleCloseAddAssignModal();
    } catch (error) {
      toast.error("Error adding asset");
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddForm(prev => ({
      ...prev,
      [name]: name === 'purchasePrice' || name === 'currentValue'
        ? Number(value)
        : value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setAddForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenUpdateModal = (asset: Asset) => {
    setAssetToUpdate(asset);
    setOpenUpdateModal(true);
  };

  const handleUpdateAsset = async (updateData: any) => {
    if (!assetToUpdate) return;

    try {
      await updateAssets(assetToUpdate._id, updateData);

      // Refresh assets list
      const response = await fetchAssetsData();
      // Updated to handle the new API response structure
      if (response.data && response.data.assets) {
        setAssets(response.data.assets);
      } else if (Array.isArray(response.data)) {
        setAssets(response.data);
      }

      setOpenUpdateModal(false);
      setAssetToUpdate(null);
      toast.success('Updating Asset successfully')
    } catch (error) {
      console.error('Error updating asset:', error);
      toast.error('Error updating asset')
    }
  };

  // Menu handlers
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, asset: Asset) => {
    setAnchorEl(event.currentTarget);
    setCurrentAsset(asset);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentAsset(null);
  };

  const handleOpenHistoryModal = async (assetId: string) => {
    try {
      const response = await GetAssetByID(assetId);
      if (response.data && response.data.maintenanceHistory) {
        setMaintenanceHistory(response.data.maintenanceHistory);
        setOpenHistoryModal(true);
      } else {
        setMaintenanceHistory([]);
        setOpenHistoryModal(true);
        toast.info('No maintenance history found for this asset');
      }
    } catch (error) {
      console.error('Error fetching maintenance history:', error);
      toast.error('Error fetching maintenance history');
    }
  };

  // Fix: Added missing '$' sign in template literal
  const formatAssignedToName = (asset: Asset) => {
    if (asset.assignedTo && typeof asset.assignedTo === 'object') {
      const assignedTo = asset.assignedTo as any;
      return `${assignedTo.first_name} ${assignedTo.last_name} (${assignedTo.employee_id})`;
    }
    return 'Not assigned';
  };

  return (
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
              onClick={() => setOpenAssignModal(true)}
            >
              Add Asset
            </Button>
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '25%', minWidth: 150 }}>Asset ID</TableCell>
                <TableCell sx={{ width: '25%', minWidth: 150 }}>Asset Type</TableCell>
                <TableCell sx={{ width: '25%', minWidth: 150 }}>Asset Name</TableCell>
                <TableCell sx={{ width: '10%', minWidth: 150 }}>Notes</TableCell>
                <TableCell sx={{ width: '10%', minWidth: 150 }}>Status</TableCell>
                <TableCell sx={{ width: '10%', minWidth: 150 }}>Assigned To</TableCell>
                <TableCell sx={{ width: '10%', minWidth: 150 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset._id}>
                  <TableCell>{asset.serialNumber || asset.assetCode || 'N/A'}</TableCell>
                  <TableCell>{asset.assetType || asset.category || 'N/A'}</TableCell>
                  <TableCell>{asset.assetName || asset.name || 'N/A'}</TableCell>
                  <TableCell>{asset.notes || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={asset.status}
                      color={getStatusColor(asset.status)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {formatAssignedToName(asset)}
                  </TableCell>
                  <TableCell>
                    {asset.status === 'ASSIGNED' ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenCollectModal(asset)}
                      >
                        Collect Asset
                      </Button>
                    ) : (
                      <>
                        <IconButton
                          aria-label="more"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={(e) => handleMenuClick(e, asset)}
                        >
                          <Iconify icon="material-symbols:more-vert" />
                        </IconButton>
                        <Menu
                          id="long-menu"
                          anchorEl={anchorEl}
                          keepMounted
                          open={openMenu && currentAsset?._id === asset._id}
                          onClose={handleMenuClose}
                          PaperProps={{
                            style: {
                              maxHeight: 48 * 4.5,
                              width: '20ch',
                            },
                          }}
                        >
                          <MenuItem onClick={() => {
                            if (currentAsset) {
                              handleOpenHistoryModal(currentAsset._id);
                            }
                            handleMenuClose();
                          }}>
                            <Iconify icon="material-symbols:history" sx={{ mr: 1 }} />
                            History
                          </MenuItem>
                          <MenuItem onClick={() => {
                            if (currentAsset) {
                              handleOpenAssignModal(currentAsset);
                            }
                            handleMenuClose();
                          }}>
                            <Iconify icon="gridicons:add-outline" sx={{ mr: 1 }} />
                            Assign
                          </MenuItem>
                          <MenuItem onClick={() => {
                            if (currentAsset) {
                              handleOpenUpdateModal(currentAsset);
                            }
                            handleMenuClose();
                          }}>
                            <Iconify icon="eva:edit-2-outline" sx={{ mr: 1 }} />
                            Edit
                          </MenuItem>
                          <MenuItem onClick={() => {
                            if (currentAsset) {
                              handleDeleteAsset(currentAsset._id);
                            }
                            handleMenuClose();
                          }}>
                            <Iconify icon="weui:delete-outlined" sx={{ mr: 1 }} />
                            Delete
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <AddAssetModal
        open={openAssignModal && !selectedAsset}
        onClose={handleCloseAddAssignModal}
        onSubmit={handleSubmitaddAssign}
        formData={addForm}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onDateChange={handleAddDateChange}
      />
      <CollectAssetModal
        open={openCollectModal}
        onClose={handleCloseCollectModal}
        onConfirm={handleConfirmCollect}
        selectedAsset={selectedAsset}
      />

      <AssignAssetModal
        open={openAssignModal && !!selectedAsset}
        onClose={handleCloseAssignModal}
        onAssign={handleAssignAsset}
        selectedAsset={selectedAsset}
        employees={employees}
        assignmentForm={assignmentForm}
        onAssignmentChange={handleAssignmentChange}
        onDateChange={handleDateChange}
      />

      <DeleteAssetModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
      <UpdateAssetModal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        onSubmit={handleUpdateAsset}
        selectedAsset={assetToUpdate}
      />
      <MaintenanceHistoryModal
        open={openHistoryModal}
        onClose={() => setOpenHistoryModal(false)}
        maintenanceHistory={maintenanceHistory}
      />
    </Card>
  );
};

export default AssetList;