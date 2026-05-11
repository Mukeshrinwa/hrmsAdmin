import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import * as React from 'react';

import {
  Box,
  Stack,
  Button,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import ShiftTable from '../SettingTables/ShiftTable';
import ShiftModal from '../SettingModal/Shift/ShiftModal';


const today = dayjs();
// const yesterday = dayjs().subtract(1, 'day');
// const todayStartOfTheDay = today.startOf('day');

export default function Shift() {
  const [open, setOpen] = React.useState(false);
  const [shift,setShift] = React.useState('')
  const [start, setStart] = React.useState<Dayjs | null>(dayjs(today));
  const [end, setEnd] = React.useState<Dayjs | null>(dayjs(today));
  const [punch, setPunch] = React.useState<Dayjs | null>(dayjs(today));
  const [fullTime, setFullTime] = React.useState<Dayjs | null>(dayjs(today));
  const [halfTime, setHalfTime] = React.useState<Dayjs | null>(dayjs(today));
  const [graceTime, setGraceTime] = React.useState<Dayjs | null>(dayjs(today));


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
          //  border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      >
        {/* Search With Button Flex Start */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          gap="10px"
        >
          <Button
            // component={RouterLink}
            // href={paths.dashboard.user.new}
            variant="contained"
            // sx={{ background: '#007C7C' }}
            startIcon={<Iconify icon="gg:add" />}
            onClick={handleClickOpen}
            color="primary"
          >
            Add New Shift
          </Button>
        </Stack>
        {/* Search With Button Flex End */}

        {/* Grid Start */}
        <Box
          sx={{
            mt: '10px',
          }}
        >
          <ShiftTable />
        </Box>
        {/* Grid End */}
      </Box>
      <ShiftModal 
      editmodal={editmodal}
       open={open}  
       handleClose={handleClose} 
       shift={shift} 
       start={start} 
       end={end} 
       punch={punch} 
       fullTime={fullTime} 
       halfTime={halfTime} 
       graceTime={graceTime}
       setShift={setShift} 
       setStart={setStart} 
       setEnd={setEnd} 
       setPunch={setPunch} 
       setFullTime={setFullTime} 
       setHalfTime={setHalfTime} 
       setGraceTime={setGraceTime}
       />

    </>
  );
}
