import type { IKanbanTask } from 'src/types/kanban';
import type { UniqueIdentifier } from '@dnd-kit/core';
import type { Theme, SxProps } from '@mui/material/styles';

import { useSortable } from '@dnd-kit/sortable';
import React, { useState, useEffect, useCallback } from 'react';

import { useBoolean } from 'src/hooks/use-boolean';

import { deleteTask, updateTask } from 'src/actions/kanban';

import { toast } from 'src/components/snackbar';
import { imageClasses } from 'src/components/image';

import ItemBase from './item-base';
import { KanbanDetails } from '../details/kanban-details';

// ----------------------------------------------------------------------

type TaskItemProps = {
  disabled?: boolean;
  sx?: SxProps<Theme>;
  task: IKanbanTask | null; // Handle null or undefined
  columnId: UniqueIdentifier;
  boardId: string;
};

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500); // Wait 500ms to set mounted
    return () => clearTimeout(timeout); // Cleanup timeout
  }, []);

  return isMounted;
}

export function KanbanTaskItem({ task, disabled, columnId, boardId, sx }: TaskItemProps) {
  // Handle opening and closing task details modal
  const openDetails = useBoolean();

  // Drag-and-drop logic
  const { setNodeRef, listeners, isDragging, isSorting, transform, transition } = useSortable({
    id: task ? task.id : '', // Ensure task.id is valid when task is available
  });

  // Mounted status for drag animations
  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  // Always define callbacks to satisfy rules of hooks
  const handleDeleteTask = useCallback(async () => {
    if (!task) return; // Skip delete if task is undefined or null
    try {
      await deleteTask(columnId, task.id, boardId);
      toast.success('Task deleted successfully!', { position: 'top-center' });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task', { position: 'top-center' });
    }
  }, [columnId, task, boardId]);

  const handleUpdateTask = useCallback(async (taskData: IKanbanTask) => {
    try {
      await updateTask(columnId, boardId, taskData);
      toast.success('Task updated successfully!', { position: 'top-center' });
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task', { position: 'top-center' });
    }
  }, [columnId, boardId]);

  // Early return if task is missing
  if (!task) {
    console.error('Task is undefined or null in KanbanTaskItem');
    return null; // Do not render anything if task is invalid
  }

  return (
    <>
      {/* Task card */}
      <ItemBase
        ref={disabled ? undefined : setNodeRef} // Dragging ref
        task={task}
        onClick={openDetails.onTrue} // Open details modal
        stateProps={{
          transform,
          listeners,
          transition,
          sorting: isSorting,
          dragging: isDragging,
          fadeIn: mountedWhileDragging,
        }}
        sx={{
          ...(openDetails.value && { [`& .${imageClasses.root}`]: { opacity: 0.8 } }),
          ...sx,
        }}
      />

      {/* Task details modal */}
      <KanbanDetails
        task={task}
        openDetails={openDetails.value}
        onCloseDetails={openDetails.onFalse}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}
