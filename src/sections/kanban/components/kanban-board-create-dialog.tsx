import { mutate } from 'swr';
import { useState, useCallback } from 'react';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import axios from 'src/utils/axios';
// ----------------------------------------------------------------------

interface Props {
  open: boolean;
  onClose: VoidFunction;
}

export default function KanbanBoardCreateDialog({ open, onClose }: Props) {
  const [boardName, setBoardName] = useState('');

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setBoardName(event.target.value);
  }, []);

  const handleCreateBoard = useCallback(async () => {
    try {
      if (!boardName.trim()) {
        return;
      }

      await axios.post('/board/board', {
        name: boardName.trim(),
      });

      // Revalidate the boards list
      mutate('/board');
      
      setBoardName('');
      onClose();
    } catch (error) {
      console.error('Error creating board:', error);
    }
  }, [boardName, onClose]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Create New Board</DialogTitle>
      
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Board Name"
          margin="dense"
          value={boardName}
          onChange={handleChange}
          placeholder="Enter board name"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleCreateBoard} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
