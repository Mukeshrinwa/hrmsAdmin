import type { BoxProps } from '@mui/material/Box';
import type { IKanbanColumn } from 'src/types/kanban';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { inputBaseClasses } from '@mui/material/InputBase';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { useBoolean } from 'src/hooks/use-boolean';

import { createColumn } from 'src/actions/kanban';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface KanbanColumnAddProps extends BoxProps {
  boardId?: string;
}

export function KanbanColumnAdd({ sx, boardId, ...other }: KanbanColumnAddProps) {
  const [columnName, setColumnName] = useState('');
  const openAddColumn = useBoolean();

  const handleChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setColumnName(event.target.value);
  }, []);

  const handleCreateColumn = useCallback(async () => {
    try {
      if (!boardId) {
        console.error('Board ID is required to create a column');
        return;
      }

      const columnData: IKanbanColumn = {
        name: columnName.trim() ? columnName : 'Untitled',
        boardId,
        columnName: columnName.trim() ? columnName : 'Untitled',
        id: ''
      };
  
      await createColumn(columnData);
  
      setColumnName('');
      openAddColumn.onFalse();
    } catch (error) {
      console.error(error);
    }
  }, [columnName, openAddColumn, boardId]);
  
  const handleKeyUpCreateColumn = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleCreateColumn();
      }
    },
    [handleCreateColumn]
  );

  const handleCancel = useCallback(() => {
    setColumnName('');
    openAddColumn.onFalse();
  }, [openAddColumn]);

  return (
    <>
      <Box sx={{ width: 'var(--column-width)', flex: '0 0 auto', ...sx }} {...other}>
        {openAddColumn.value ? (
          <ClickAwayListener onClickAway={handleCancel}>
            <TextField
              autoFocus
              fullWidth
              placeholder="Untitled"
              value={columnName}
              onChange={handleChangeName}
              onKeyUp={handleKeyUpCreateColumn}
              helperText="Press Enter to create the column."
              sx={{ [`& .${inputBaseClasses.input}`]: { typography: 'h6' } }}
            />
          </ClickAwayListener>
        ) : (
          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="mingcute:add-line" sx={{ mr: -0.5 }} />}
            onClick={openAddColumn.onTrue}
          >
            Add column
          </Button>
        )}
      </Box>
      <Box sx={{ width: '1px', flexShrink: 0 }} />
    </>
  );
}
