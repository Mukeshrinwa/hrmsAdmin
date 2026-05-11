import React from 'react';

import {
  Box,
  Stack,
  Button,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import DesignationTable from '../SettingTables/DesignationTable';
import DesignationModal from '../SettingModal/Designation/DesignationModal';


export default function Designation() {
  const [open, setOpen] = React.useState(false);
  const [designation, setDesignation] = React.useState('');


  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const editmodal:boolean=false;
  return (
    <>
      <Box
        sx={{
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          gap="10px"
        >
            <Button
            
              variant="contained"
              startIcon={<Iconify icon="gg:add" />}
              onClick={handleClickOpen}
              color='primary'
            >
              Add Designation
            </Button>

        </Stack>
       
        <Box
          sx={{
            mt: '10px',
          }}
        >
          <DesignationTable />
        </Box>
        {/* Grid End */}
      </Box>
      <DesignationModal editmodal={editmodal} open={open} handleClose={handleClose} setDesignation={setDesignation} designation={designation} />
      </>
  );
}

