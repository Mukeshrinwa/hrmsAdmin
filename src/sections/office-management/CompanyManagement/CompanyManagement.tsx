import 'leaflet/dist/leaflet.css';

import type { OfficeData } from 'src/Interface/company_table.interface';

import L from 'leaflet';
import React, { useState, useEffect } from 'react';
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

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface ShiftData {
  _id: string;
  name: string;
  start_time: string;
  end_time: string;
}

const OfficeManagementTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [officeData, setOfficeData] = useState<OfficeData[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<OfficeData | null>(null);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [shiftData, setShiftData] = useState<ShiftData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<OfficeData | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<OfficeData | null>(null);

  const { fetchofficeManagement, updateCompanyManagement, deleteofficeManagement } = OfficeManagementApi();
  const { fetchofficeShift } = shiftmanagenmetApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchofficeManagement();
        setOfficeData(data);
      } catch (error) {
        console.error('Error fetching office data:', error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchShiftData = async () => {
      try {
        const result = await fetchofficeShift();
        setShiftData(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Error fetching office Shift:", error);
        setShiftData([]);
      }
    };

    fetchShiftData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleMapIconClick = (office: OfficeData) => {
    setSelectedOffice(office);
    setMapDialogOpen(true);
  };

  const handleCloseMapDialog = () => {
    setMapDialogOpen(false);
    setSelectedOffice(null);
  };

  const handleEditClick = (office: OfficeData) => {
    console.log('Editing office data:', office);
    setSelectedLocation(office);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (office: OfficeData) => {
    setDeleteTarget(office);
    setDeleteModalOpen(true);
  };

  // Filter + Sort the officeData by createdAt descending (most recent first)
  const filteredAndSortedOfficeData = React.useMemo(
    () =>
      officeData
        .filter((office) => office.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate; // descending: recent first
        }),
    [officeData, searchTerm]
  );


  return (
    <>
      <Paper component="div" sx={{ width: '100%', p: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <TextField
                placeholder="Search..."
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
          <Grid item xs={12} sm={6} md={8} container justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="gridicons:add-outline" />}
              onClick={() => setAddModalOpen(true)}
            >
              Add New Location
            </Button>
          </Grid>
        </Grid>
        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
          <Table stickyHeader aria-label="office management table" sx={{ minWidth: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ minWidth: '200px' }}>Office Name</TableCell>
                <TableCell align="center" sx={{ minWidth: '150px' }}>Location</TableCell>
                <TableCell align="center" sx={{ minWidth: '200px' }}>Shift Name</TableCell>
                <TableCell align="center" sx={{ minWidth: '150px' }}>Status</TableCell>
                <TableCell align="center" sx={{ minWidth: '120px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedOfficeData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((office) => (
                  <TableRow hover key={office._id}>
                    <TableCell align="center">{office.name}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        aria-label="show on map"
                        onClick={() => handleMapIconClick(office)}
                      >
                        <Iconify icon="solar:streets-map-point-linear" />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      {Array.isArray(shiftData) && shiftData.length > 0
                        ? shiftData.map((s) => s.name).join(", ")
                        : "No Shifts"}
                    </TableCell>

                    <TableCell align="center">
                      {office.status ? (
                        <Button variant="contained" color="success" size="small">
                          Active
                        </Button>
                      ) : (
                        <Button variant="contained" color="error" size="small">
                          Inactive
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(office)}
                        >
                          <Iconify icon="eva:edit-outline" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(office)}
                        >
                          <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredAndSortedOfficeData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <AddLocationModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSuccess={() => {
            setAddModalOpen(false);
            fetchofficeManagement().then(setOfficeData);
          }}
        />
        {selectedLocation && (
          <EditLocationModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            initialData={selectedLocation}
            updateCompanyManagement={updateCompanyManagement}
            onSuccess={() => {
              setEditModalOpen(false);
              fetchofficeManagement().then(setOfficeData);
            }}
          />
        )}
        {deleteTarget && (
          <DeleteLocationModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            officeId={deleteTarget._id}
            officeName={deleteTarget.name}
            deleteofficeManagement={deleteofficeManagement}
            onDeleteSuccess={() => {
              fetchofficeManagement().then(setOfficeData);
            }}
          />
        )}
      </Paper>

      {/* Map Dialog */}
      {/* Map Dialog */}
      <Dialog open={mapDialogOpen} onClose={handleCloseMapDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedOffice?.name} Location
          <IconButton
            aria-label="close"
            onClick={handleCloseMapDialog}
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

        <DialogContent sx={{ height: '500px' }}>
          {/* Check if coordinates are available */}
          {selectedOffice?.coordinates ? (
            <MapContainer
              center={[
                selectedOffice.coordinates.latitude ?? 0,
                selectedOffice.coordinates.longitude ?? 0
              ]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              <Marker
                position={[
                  selectedOffice.coordinates.latitude ?? 0,
                  selectedOffice.coordinates.longitude ?? 0
                ]}
              >
                <Popup>
                  <b>{selectedOffice.name}</b><br />
                  Latitude: {selectedOffice.coordinates.latitude}<br />
                  Longitude: {selectedOffice.coordinates.longitude}<br />
                  Radius: {selectedOffice?.geofence?.radius ?? 0} meters<br />
                </Popup>
              </Marker>

              <Circle
                center={[
                  selectedOffice.coordinates.latitude ?? 0,
                  selectedOffice.coordinates.longitude ?? 0
                ]}
                radius={selectedOffice?.geofence?.radius ?? 0}
                pathOptions={{
                  color: '#1976d2',
                  fillColor: '#1976d2',
                  fillOpacity: 0.2,
                }}
              />
            </MapContainer>
          ) : (
            <p
              style={{
                textAlign: "center",
                marginTop: "200px",
                fontSize: "18px",
                color: "gray"
              }}
            >
              No location found for this office.
            </p>
          )}
        </DialogContent>
      </Dialog>

    </>
  );
};

export default OfficeManagementTable;
