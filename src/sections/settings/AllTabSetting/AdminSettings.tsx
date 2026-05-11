import type { FormData, FormData2 } from 'src/Interface/Interface';

import * as React from 'react';

import { TabList } from '@mui/lab';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { Stack, Alert, Button, TextField } from '@mui/material';

import useUpdatePasswordApi from 'src/Api/passUpdate/updatepasswordApi';

export default function AdminSettings() {
  const [values, setValues] = React.useState('1');
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    lastname: '',
    mobile: '',
    email: '',
  });
  const [formData2, setFormData2] = React.useState<FormData2>({
    oldpassword: '',
    newpassword: '',
    confirmpassword: '',
  });
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);

  const { updatepassword, meApi } = useUpdatePasswordApi();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValues(newValue);
    setError(null);
    setSuccess(null);
  };

  const handleChangeInp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeInp2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData2(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitPersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Personal Info submitted:', formData);
    // Add your personal info submission logic here
  };

  const handleSubmitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData2.oldpassword || !formData2.newpassword || !formData2.confirmpassword) {
      setError('All fields are required');
      return;
    }

    if (formData2.newpassword !== formData2.confirmpassword) {
      setError("New password and confirm password don't match!");
      return;
    }

    if (!userId) {
      setError('User ID not found');
      return;
    }

    try {
      await updatepassword({
        oldPassword: formData2.oldpassword,
        newPassword: formData2.newpassword
      }, userId);

      setSuccess('Password updated successfully!');
      setFormData2({
        oldpassword: '',
        newpassword: '',
        confirmpassword: '',
      });
    } catch (err) {
      setError('Failed to update password. Please check your old password.');
      console.error('Password update error:', err);
    }
  };

  React.useEffect(() => {
    const fetchUserId = async () => {
      try {
        const data = await meApi();
        setUserId(data.user._id);

        const nameParts = data.user.username.split(' ');
        setFormData({
          name: nameParts[0] || '',
          lastname: nameParts.slice(1).join(' ') || '',
          mobile: data.user.mobile || '',
          email: data.user.email || '',
        });
      } catch (err) {
        console.error('Failed to fetch user ID:', err);
      }
    };

    fetchUserId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={values}>
        <TabList
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          onChange={handleChange}
          aria-label="Settings Tabs"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            width: { xs: '100%', sm: '50%', md: '50%' },
          }}
        >
          <Tab label="Personal Information" value="1" />
          <Tab label="Change Password" value="2" />
        </TabList>

        <TabPanel value="1">
          <Box
            component="form"
            onSubmit={handleSubmitPersonalInfo}
            sx={{ display: 'flex', flexDirection: 'column', mt: 3, gap: '20px' }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                sx={{ width: { xs: '100%', sm: '50%' } }}
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChangeInp}
                variant="standard"
              />
              <TextField
                sx={{ width: { xs: '100%', sm: '50%' } }}
                label="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleChangeInp}
                variant="standard"
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                sx={{ width: { xs: '100%', sm: '50%' } }}
                type="tel"
                label="Mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChangeInp}
                variant="standard"
              />
              <TextField
                sx={{ width: { xs: '100%', sm: '50%' } }}
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChangeInp}
                variant="standard"
                disabled={!formData.email} // Disable if email isn't available
              />
            </Stack>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Update Information
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value="2">
          <Box
            component="form"
            onSubmit={handleSubmitPasswordChange}
            sx={{ display: 'flex', flexDirection: 'column', mt: 3, gap: '20px' }}
          >
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                type="text"
                label="Old Password"
                name="oldpassword"
                value={formData2.oldpassword}
                onChange={handleChangeInp2}
                variant="outlined"
                required
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                sx={{ width: { xs: '100%', sm: '50%' } }}
                type="text"
                label="New Password"
                name="newpassword"
                value={formData2.newpassword}
                onChange={handleChangeInp2}
                variant="outlined"
                required
              />
              <TextField
                sx={{ width: { xs: '100%', sm: '50%' } }}
                type="password"
                label="Confirm Password"
                name="confirmpassword"
                value={formData2.confirmpassword}
                onChange={handleChangeInp2}
                variant="outlined"
                required
              />
            </Stack>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Update Password
            </Button>
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
}