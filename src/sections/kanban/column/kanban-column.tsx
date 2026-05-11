import type { Theme, SxProps } from '@mui/material/styles';
import type { AnimateLayoutChanges } from '@dnd-kit/sortable';
import type { IKanbanTask, IKanbanColumn } from 'src/types/kanban';

import { useCallback } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';

import { useBoolean } from 'src/hooks/use-boolean';

import { createTask, clearColumn, deleteColumn, updateColumn } from 'src/actions/kanban';

import { toast } from 'src/components/snackbar';

import ColumnBase from './column-base';
import { KanbanTaskAdd } from '../components/kanban-task-add';
import { KanbanColumnToolBar } from './kanban-column-toolbar';

// ----------------------------------------------------------------------

type ColumnProps = {
  disabled?: boolean;
  sx?: SxProps<Theme>;
  tasks: IKanbanTask[];
  column: IKanbanColumn;
  children: React.ReactNode;
};

export function KanbanColumn({ children, column, tasks, disabled, sx }: ColumnProps) {
  const openAddTask = useBoolean();
  
  const { boardId } = column;

  const { attributes, isDragging, listeners, setNodeRef, transition, active, over, transform } =
    useSortable({
      id: column.id,
      data: { type: 'container', children: tasks },
      animateLayoutChanges,
    });

  const tasksIds = tasks.map((task) => task.id);

  const isOverContainer = over
    ? (column.id === over.id && active?.data.current?.type !== 'container') ||
      tasksIds.includes(over.id)
    : false;
    
  const handleUpdateColumn = useCallback(async (columnName: string) => {
    try {
      await updateColumn(column.id, columnName, boardId);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update column', { position: 'top-center' });
    }
  }, [column.id, boardId]);
    
  const handleClearColumn = useCallback(async () => {
    try {
      await clearColumn(column.id, boardId);
    } catch (error) {
      console.error(error);
      toast.error('Failed to clear column', { position: 'top-center' });
    }
  }, [column.id, boardId]);

  const handleDeleteColumn = useCallback(async () => {
    try {
      await deleteColumn(column.id, boardId);
      toast.success('Delete success!', { position: 'top-center' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete column', { position: 'top-center' });
    }
  }, [column.id, boardId]);
  
  const handleAddTask = useCallback(async (taskData: IKanbanTask) => {
    try {
      console.log('Creating task with:', {
        columnId: column.id,
        boardId,
        columnBoardId: column.boardId,
        column,
        taskData,
      });
      
      if (!boardId) {
        console.error('Board ID is missing in column:', column);
        toast.error('Cannot create task: Board ID is missing', { position: 'top-center' });
        return;
      }
      
      await createTask(column.id, boardId, taskData);
      openAddTask.onFalse();
      toast.success('Task created successfully', { position: 'top-center' });
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task', { position: 'top-center' });
    }
  }, [column, boardId, openAddTask]);

  return (
    <ColumnBase
      ref={disabled ? undefined : setNodeRef}
      sx={{ transition, transform: CSS.Translate.toString(transform), ...sx }}
      stateProps={{
        dragging: isDragging,
        hover: isOverContainer,
        handleProps: { ...attributes, ...listeners },
      }}
      slots={{
        header: (
          <KanbanColumnToolBar
            handleProps={{ ...attributes, ...listeners }}
            totalTasks={tasks.length}
            columnName={column.name}
            onUpdateColumn={handleUpdateColumn}
            onClearColumn={handleClearColumn}
            onDeleteColumn={handleDeleteColumn}
            onToggleAddTask={openAddTask.onToggle}
          />
        ),
        main: <>{children}</>,
        action: (
          <KanbanTaskAdd
            status={column.name}
            openAddTask={openAddTask.value}
            onAddTask={handleAddTask}
            onCloseAddTask={openAddTask.onFalse}
          />
        ),
      }}
    />
  );
}

// ----------------------------------------------------------------------

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });
