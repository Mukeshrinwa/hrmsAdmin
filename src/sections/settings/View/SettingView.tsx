import React, { useState } from 'react';

import {
  Box,
  Paper,
  Typography,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard/main';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import Other from '../AllTabSetting/Other';
import LeaveType from '../AllTabSetting/LeaveType';
import AdminSettings from '../AllTabSetting/AdminSettings';

export function SettingView() {
  const [index, setIndex] = useState(1);
  return (
    <Box>
      <DashboardContent>
        <Paper component="div" sx={{ p: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>

          <CustomBreadcrumbs
            heading="Settings"
            links={[
              { name: '' },
            ]}
            sx={{ mb: { xs: 3, md: 5 } }}
          />
          <Typography sx={{ width: '100%', m: 'auto', mb: 2, }}>Admin Details</Typography>

          <Box
            sx={{
              p: '10px',
              m: 'auto',
              width: '100%',
              borderRadius: 2,
              // border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
            }}
          >
            <Box
              sx={{
                mt: '10px',
                width: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                alignItems: 'start',
                gap: '10px',
              }}
            >
              <Box
                sx={{
                  width: { xs: '100%', sm: '100%', md: '200px', lg: '200px', },
                  minWidth: '200px',
                  borderRadius: '10px',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    p: '10px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'left',
                    gap: '10px',
                    cursor: 'pointer',
                  }}
                  bgcolor={index === 1 ? 'primary.main' : ''}
                  onClick={() => setIndex(1)}
                >
                  <Iconify
                    sx={{ cursor: 'pointer', color: index === 1 ? 'white' : '' }}
                    icon="material-symbols:admin-panel-settings-outline"
                  />
                  <Typography sx={{ color: index === 1 ? 'white' : '' }}>Admin Details</Typography>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    p: '10px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'left',
                    gap: '10px',
                    cursor: 'pointer',
                  }}
                  bgcolor={index === 5 ? 'primary.main' : ''}
                  onClick={() => setIndex(5)}
                >
                  <Iconify
                    sx={{ cursor: 'pointer', color: index === 5 ? 'white' : '' }}
                    icon="fontisto:holiday-village"
                  />
                  <Typography sx={{ color: index === 5 ? 'white' : '' }}>Leave Types</Typography>
                </Box>

                <Box
                  sx={{
                    width: '100%',
                    p: '10px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'left',
                    gap: '10px',
                    cursor: 'pointer',
                  }}
                  bgcolor={index === 6 ? 'primary.main' : ''}
                  onClick={() => setIndex(6)}
                >
                  <Iconify
                    sx={{ cursor: 'pointer', color: index === 6 ? 'white' : '' }}
                    icon="heroicons:ellipsis-horizontal-20-solid"
                  />
                  <Typography sx={{ color: index === 6 ? 'white' : '' }}>Other</Typography>
                </Box>
              </Box>

              {index === 1 && (
                <Box sx={{ width: '100%' }}>
                  <AdminSettings />
                </Box>
              )}

              {index === 5 && (
                <Box sx={{ overflow: 'hidden', width: { xs: '100%', sm: '100%', md: 'calc(100%-270px)', lg: 'calc(100%-270px)' } }}>
                  <LeaveType />
                </Box>
              )}
              {index === 6 && (
                <Box sx={{ overflow: 'hidden', width: { xs: '100%', sm: '100%', md: 'calc(100%-270px)', lg: 'calc(100%-270px)' } }}>
                  <Other />
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </DashboardContent>

    </Box>
  );
}
