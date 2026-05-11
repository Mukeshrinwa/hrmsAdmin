import * as React from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import { Switch, Typography } from '@mui/material';

import settingsApi from 'src/Api/settings/settingsApi';
import { LanguagePopover } from 'src/layouts/components/language-popover'; 

const style = {
  py: 0,
  p: '10px',
  width: '100%',
  maxWidth: '100%',
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
};

interface LanguageOption {
  value: string;
  label: string;
  countryCode: string;
}


export default function Other() {
  const [settings, setSettings] = React.useState({
    language: 'en',
    mobileNotification: false,
    desktopNotification: false,
    emailNotification: false
  });

  const { fetchSetting, updateSetting } = settingsApi();

  const data: LanguageOption[] = [
    { value: 'en', label: 'English', countryCode: 'GB' },
    { value: 'hindi', label: 'Hindi', countryCode: 'In' },
  ];

  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetchSetting();
        setSettings({
          language: response.settings.language,
          mobileNotification: response.settings.mobileNotification,
          desktopNotification: response.settings.desktopNotification,
          emailNotification: response.settings.emailNotification
        });
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };

    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLanguageChange = async (newLanguage: string) => {
    try {
      await updateSetting({ ...settings, language: newLanguage });
      setSettings(prev => ({ ...prev, language: newLanguage }));
    } catch (err) {
      console.error('Failed to update language:', err);
    }
  };

  const handleNotificationChange = async (field: string, value: boolean) => {
    try {
      const updatedSettings = { ...settings, [field]: value };
      await updateSetting(updatedSettings);
      setSettings(updatedSettings);
    } catch (err) {
      console.error(`Failed to update ${field}:`, err);
    }
  };
 

  return (
    <List sx={style}>
      <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontWeight: '600' }}>Appearance</Typography>
        </Box>
      </ListItem>
      <Divider variant="middle" component="li" />
      <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontWeight: '600' }}>Language</Typography>
          <Typography sx={{ fontWeight: '300', color: '#A2A1A8' }}>Select your language</Typography>
        </Box>
        <LanguagePopover
          data-slot="localization"
          data={data}
          {...{
            currentLanguage: settings.language,
            onLanguageChange: handleLanguageChange
          } as any}
        />
      </ListItem>
      <Divider variant="middle" component="li" />
      <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontWeight: '600' }}>Mobile Push Notifications</Typography>
          <Typography sx={{ fontWeight: '300', color: '#A2A1A8' }}>
            Receive push notification
          </Typography>
        </Box>
        <Switch
          checked={settings.mobileNotification}
          onChange={(e) => handleNotificationChange('mobileNotification', e.target.checked)}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </ListItem>
      <Divider variant="middle" component="li" />
      <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontWeight: '600' }}>Desktop Notification</Typography>
          <Typography sx={{ fontWeight: '300', color: '#A2A1A8' }}>
            Receive push notification in desktop
          </Typography>
        </Box>
        <Switch
          checked={settings.desktopNotification}
          onChange={(e) => handleNotificationChange('desktopNotification', e.target.checked)}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </ListItem>
      <Divider variant="middle" component="li" />
      <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontWeight: '600' }}>Email Notifications</Typography>
          <Typography sx={{ fontWeight: '300', color: '#A2A1A8' }}>
            Receive email notification
          </Typography>
        </Box>
        <Switch
          checked={settings.emailNotification}
          onChange={(e) => handleNotificationChange('emailNotification', e.target.checked)}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </ListItem>
    </List>
  );
}