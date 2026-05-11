// MaintenanceHistoryModal.tsx
import type { MaintenanceHistory } from 'src/Interface/asset-managementinterfaces';

import React from 'react';

import {
  Table,
  Paper,
  Dialog,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer
} from '@mui/material';

interface MaintenanceHistoryModalProps {
  open: boolean;
  onClose: () => void;
  maintenanceHistory: MaintenanceHistory[];
}

const MaintenanceHistoryModal: React.FC<MaintenanceHistoryModalProps> = ({
  open,
  onClose,
  maintenanceHistory
}) => (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Maintenance History</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Performed By</TableCell>
                <TableCell>Next Maintenance Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maintenanceHistory.map((history, index) => (
                <TableRow key={index}>
                  <TableCell>{history.date}</TableCell>
                  <TableCell>{history.description}</TableCell>
                  <TableCell>{history.cost}</TableCell>
                  <TableCell>{history.performedBy}</TableCell>
                  <TableCell>{history.nextMaintenanceDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );


export default MaintenanceHistoryModal;