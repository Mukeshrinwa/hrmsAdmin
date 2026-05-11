import type { IKanbanAssignee } from 'src/types/kanban';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetEmployees } from 'src/actions/kanban';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

type Props = {
  open: boolean;
  onClose: () => void;
  assignee?: IKanbanAssignee[];
  onAssign?: (employeeId: IKanbanAssignee) => void;
  onUnassign?: (employeeId: string) => void;
};

export function KanbanContactsDialog({ assignee = [], open, onClose, onAssign, onUnassign }: Props) {
  const [searchContact, setSearchContact] = useState('');
  const { employees, employeesLoading } = useGetEmployees();

  const handleSearchContacts = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchContact(event.target.value);
  }, []);

  const dataFiltered = applyFilter({ inputData: employees, query: searchContact });
  const notFound = !dataFiltered.length && !!searchContact;

  if (employeesLoading) {
    return (
      <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        Employees <Typography component="span">({employees.length})</Typography>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2.5 }}>
        <TextField
          fullWidth
          value={searchContact}
          onChange={handleSearchContacts}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {notFound ? (
          <SearchNotFound query={searchContact} sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar sx={{ height: ITEM_HEIGHT * 6, px: 2.5 }}>
            <Box component="ul">
              {dataFiltered.map((contact) => {
                const checked = assignee.map((person) => person.id).includes(contact.id);

                return (
                  <Box
                    component="li"
                    key={contact.id}
                    sx={{
                      gap: 2,
                      display: 'flex',
                      height: ITEM_HEIGHT,
                      alignItems: 'center',
                    }}
                  >
                    <Avatar src={contact.avatarUrl} />

                    <ListItemText
                      primaryTypographyProps={{ typography: 'subtitle2', sx: { mb: 0.25 } }}
                      secondaryTypographyProps={{ typography: 'caption' }}
                      primary={contact.first_name}
                      secondary={contact.email}
                    />

                    <Button
                      size="small"
                      color={checked ? 'primary' : 'inherit'}
                      startIcon={
                        <Iconify
                          width={16}
                          icon={checked ? 'eva:checkmark-fill' : 'mingcute:add-line'}
                          sx={{ mr: -0.5 }}
                        />
                      }
                      onClick={() => {
                        if (checked) {
                          onUnassign?.(contact._id);
                        } else {
                          onAssign?.(contact);
                        }
                      }}
                    >
                      {checked ? 'Assigned' : 'Assign'}
                    </Button>
                  </Box>
                );
              })}
            </Box>
          </Scrollbar>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  query: string;
  inputData: IKanbanAssignee[];
};

function applyFilter({ inputData, query }: ApplyFilterProps) {
  if (query) {
    inputData = inputData.filter(
      (contact) =>
        contact.first_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        contact.email.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
