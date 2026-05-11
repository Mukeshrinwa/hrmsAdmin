import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import React, { useMemo, useState, useEffect } from 'react';
import { Popup, Marker, Circle, TileLayer, MapContainer } from 'react-leaflet';

import {
  Grid,
  Paper,
  Table,
  Dialog,
  Button,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  IconButton,
  DialogTitle,
  FormControl,
  DialogContent,
  TableContainer,
  InputAdornment,
  TablePagination,
} from '@mui/material';

import shiftmanagenmetApi from 'src/Api/shift_management/shiftmanagenmetApi';
import OfficeManagementApi from 'src/Api/office_Management/OfficeManagementApi';

import { Iconify } from 'src/components/iconify';

import AddLocationModal from './AddLocationModal';
import EditLocationModal from './EditLocationModal';
import DeleteLocationModal from './DeleteLocationModal';

// Fix Leaflet Marker Icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// NEW INTERFACE FOR BRANCHES DATA
interface BranchData {
  _id: string;
  name: string;
  code: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  radius: number;
  status: boolean;
  createdAt: any;
  default_shift: string;
  available_shifts: never[];
}

interface ShiftData {
  _id: string;
  name: string;
  start_time: string;
  end_time: string;
}

const OfficeManagementTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [officeData, setOfficeData] = useState<BranchData[]>([]);
  const [shiftData, setShiftData] = useState<ShiftData[]>([]);


  console.log(shiftData, 'shiftData');

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedOffice, setSelectedOffice] = useState<BranchData | null>(null);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<BranchData | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BranchData | null>(null);

  const { fetchBranchManagement, updateofficeManagement, deleteofficeManagement } = OfficeManagementApi();
  const { fetchofficeShift } = shiftmanagenmetApi();

  // FETCH BRANCHES
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchBranchManagement();
        const branches = result?.company?.branches || [];
        setOfficeData(branches);
      } catch (err) {
        console.error('Error fetching branches:', err);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FETCH SHIFTS
  useEffect(() => {
    const fetchShiftData = async () => {
      try {
        const result = await fetchofficeShift();
        setShiftData(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error('Error fetching shifts:', err);
      }
    };

    fetchShiftData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditClick = (branch: BranchData) => {
    setSelectedLocation(branch);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (branch: BranchData) => {
    setDeleteTarget(branch);
    setDeleteModalOpen(true);
  };

  const handleMapIconClick = (branch: BranchData) => {
    setSelectedOffice(branch);
    setMapDialogOpen(true);
  };

  const handleCloseMapDialog = () => {
    setMapDialogOpen(false);
    setSelectedOffice(null);
  };

  // SEARCH + SORT
  const filteredAndSorted = useMemo(() => officeData.filter((o) =>
    o.name.toLowerCase().includes(searchTerm.toLowerCase())
  ), [officeData, searchTerm]);

  return (
    <>
      <Paper sx={{ width: '100%', p: 2, boxShadow: '0px 4px 20px rgba(0,0,0,0.1)' }}>
        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <TextField
                placeholder="Search Branch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

          <Grid item xs={12} sm={6} md={8} container justifyContent="flex-end">
            <Button
              variant="contained"
              startIcon={<Iconify icon="gridicons:add-outline" />}
              onClick={() => setAddModalOpen(true)}
            >
              Add New Branch
            </Button>
          </Grid>
        </Grid>

        {/* TABLE */}
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center">Branch Name</TableCell>
                <TableCell align="center">Location</TableCell>
                <TableCell align="center">Branch Code</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredAndSorted
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((branch) => (
                  <TableRow hover key={branch._id}>
                    <TableCell align="center">{branch.name}</TableCell>

                    <TableCell align="center">
                      <IconButton onClick={() => handleMapIconClick(branch)}>
                        <Iconify icon="solar:streets-map-point-linear" />
                      </IconButton>
                    </TableCell>

                    <TableCell align="center">{branch.code}</TableCell>

                    <TableCell align="center">
                      {branch.status ? (
                        <Button color="success" variant="contained" size="small">
                          Active
                        </Button>
                      ) : (
                        <Button color="error" variant="contained" size="small">
                          Inactive
                        </Button>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEditClick(branch)}>
                          <Iconify icon="eva:edit-outline" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDeleteClick(branch)}>
                          <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredAndSorted.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
        />

        {/* Add Modal */}
        <AddLocationModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSuccess={() => fetchBranchManagement().then((r) => setOfficeData(r.company.branches))}
        />

        {/* Edit Modal */}
        {selectedLocation && (
          <EditLocationModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            initialData={selectedLocation}
            updateofficeManagement={updateofficeManagement}
            onSuccess={() => fetchBranchManagement().then((r) => setOfficeData(r.company.branches))}
          />
        )}

        {/* Delete Modal */}
        {deleteTarget && (
          <DeleteLocationModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            officeId={deleteTarget._id}
            officeName={deleteTarget.name}
            deleteofficeManagement={deleteofficeManagement}
            onDeleteSuccess={() =>
              fetchBranchManagement().then((r) => setOfficeData(r.company.branches))
            }
          />
        )}
      </Paper>

      {/* MAP DIALOG */}
      <Dialog open={mapDialogOpen} onClose={handleCloseMapDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedOffice?.name} - Location
          <IconButton
            onClick={handleCloseMapDialog}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <Iconify icon="mdi:close" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ height: 500 }}>
          {selectedOffice?.location && (
            <MapContainer
              center={[
                selectedOffice.location.latitude,
                selectedOffice.location.longitude,
              ]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <Marker
                position={[
                  selectedOffice.location.latitude,
                  selectedOffice.location.longitude,
                ]}
              >
                <Popup>
                  <b>{selectedOffice.name}</b>
                  <br />
                  Code: {selectedOffice.code}
                </Popup>
              </Marker>

              <Circle
                center={[
                  selectedOffice.location.latitude,
                  selectedOffice.location.longitude,
                ]}
                radius={selectedOffice.radius || 150}
                pathOptions={{
                  color: '#1976d2',
                  fillColor: '#1976d2',
                  fillOpacity: 0.2,
                }}
              />
            </MapContainer>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OfficeManagementTable;
