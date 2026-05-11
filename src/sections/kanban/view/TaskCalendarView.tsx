import type { IKanbanTask, IKanbanBoard, IKanbanColumn } from 'src/types/kanban';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
  CollisionDetection,
} from '@dnd-kit/core';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSensor,
  DndContext,
  useSensors,
  MouseSensor,
  TouchSensor,
  closestCenter,
  pointerWithin,
  KeyboardSensor,
  rectIntersection,
  getFirstCollision,
  MeasuringStrategy,
} from '@dnd-kit/core';

import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useBoolean } from 'src/hooks/use-boolean';

import { hideScrollY } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { moveTask, moveColumn, useGetBoard, useGetBoards } from 'src/actions/kanban';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { kanbanClasses } from '../classes';
import { coordinateGetter } from '../utils';
import { KanbanColumn } from '../column/kanban-column';
import { KanbanTaskItem } from '../item/kanban-task-item';
import { KanbanColumnAdd } from '../column/kanban-column-add';
import { KanbanColumnSkeleton } from '../components/kanban-skeleton';
import { KanbanDragOverlay } from '../components/kanban-drag-overlay';
import KanbanBoardCreateDialog from '../components/kanban-board-create-dialog';

// ----------------------------------------------------------------------

const PLACEHOLDER_ID = 'placeholder';

const cssVars = {
  '--item-gap': '16px',
  '--item-radius': '12px',
  '--column-gap': '24px',
  '--column-width': '336px',
  '--column-radius': '16px',
  '--column-padding': '20px 16px 16px 16px',
};

export function TaskCalendarView(): JSX.Element {
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');
  const [columnFixed, setColumnFixed] = useState(true);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const openCreateBoard = useBoolean();

  const { boards, boardsLoading } = useGetBoards();
  const { board, boardLoading, boardEmpty } = useGetBoard(selectedBoardId);

  const recentlyMovedToNewContainer = useRef(false);
  const lastOverId = useRef<UniqueIdentifier | null>(null);

  const columnIds = useMemo(() => 
    board?.columns?.map((column: IKanbanColumn) => column.id) || [], 
    [board?.columns]
  );

  // Set initial board when boards are loaded
  useEffect(() => {
    if (!selectedBoardId && Array.isArray(boards) && boards.length > 0) {
      console.log('Setting initial board ID:', {
        availableBoards: boards,
        initialBoardId: boards[0]._id
      });
      setSelectedBoardId(boards[0]._id);
    }
  }, [boards, selectedBoardId]);

  useEffect(() => {
    console.log('Board data updated:', {
      selectedBoardId,
      boardData: board,
      boardLoading,
      boardEmpty
    });
  }, [selectedBoardId, board, boardLoading, boardEmpty]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const isSortingContainer = activeId ? columnIds.some(id => id === activeId) : false;

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter })
  );

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in board.tasks) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (column) => column.id in board.tasks
          ),
        });
      }

      const pointerIntersections = pointerWithin(args);

      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        if (overId in board.tasks) {
          const columnItems = board.tasks[overId].map((task: { id: UniqueIdentifier }) => task.id);

          if (columnItems.length > 0) {
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (column) => column.id !== overId && columnItems.includes(column.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, board?.tasks]
  );

  const findColumn = (id: UniqueIdentifier) => {
    if (id in board.tasks) {
      return id;
    }

    return Object.keys(board.tasks).find((key) =>
      board.tasks[key].map((task: { id: UniqueIdentifier }) => task.id).includes(id)
    );
  };

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    const overId = over?.id;

    if (overId == null || active.id in board.tasks) {
      return;
    }

    const overColumn = findColumn(overId);
    const activeColumn = findColumn(active.id);

    if (!overColumn || !activeColumn) {
      return;
    }

    if (activeColumn !== overColumn) {
      const activeItems = board.tasks[activeColumn].map((task: { id: UniqueIdentifier }) => task.id);
      const overItems = board.tasks[overColumn].map((task: { id: UniqueIdentifier }) => task.id);
      const overIndex = overItems.indexOf(overId);
      const activeIndex = activeItems.indexOf(active.id);

      let newIndex: number;

      if (overId in board.tasks) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      recentlyMovedToNewContainer.current = true;

      const updateTasks = {
        ...board.tasks,
        [activeColumn]: board.tasks[activeColumn].filter((task: { id: UniqueIdentifier }) => task.id !== active.id),
        [overColumn]: [
          ...board.tasks[overColumn].slice(0, newIndex),
          board.tasks[activeColumn][activeIndex],
          ...board.tasks[overColumn].slice(newIndex, board.tasks[overColumn].length),
        ],
      };

      moveTask(updateTasks, selectedBoardId);
    }
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id in board.tasks && over?.id) {
      const activeIndex = columnIds.findIndex(id => id === active.id);
      const overIndex = columnIds.findIndex(id => id === over.id);

      if (!board?.columns) return;
      
      // Ensure each column has the boardId before moving
      const updateColumns = arrayMove(board.columns as IKanbanColumn[], activeIndex, overIndex)
        .map(column => ({
          ...column,
          boardId: selectedBoardId
        }));
        
      if (selectedBoardId) {
        console.log('Moving columns:', {
          activeIndex,
          overIndex,
          updateColumns
        });
        moveColumn(updateColumns);
      }
    }

    const activeColumn = findColumn(active.id);

    if (!activeColumn) {
      setActiveId(null);
      return;
    }

    const overId = over?.id;

    if (overId == null) {
      setActiveId(null);
      return;
    }

    const overColumn = findColumn(overId);

    if (overColumn) {
      const activeContainerTaskIds = board.tasks[activeColumn].map((task: { id: UniqueIdentifier }) => task.id);
      const overContainerTaskIds = board.tasks[overColumn].map((task: { id: UniqueIdentifier }) => task.id);

      const activeIndex = activeContainerTaskIds.findIndex(id => id === active.id);
      const overIndex = overContainerTaskIds.findIndex(id => id === overId);

      if (activeIndex !== overIndex) {
        const updateTasks = {
          ...board.tasks,
          [overColumn]: arrayMove(board.tasks[overColumn], activeIndex, overIndex),
        };

        moveTask(updateTasks, selectedBoardId);
      }
    }

    setActiveId(null);
  };

  const renderLoading = (
    <Stack direction="row" alignItems="flex-start" sx={{ gap: 'var(--column-gap)' }}>
      <KanbanColumnSkeleton />
    </Stack>
  );

  const renderEmpty = (
    <Stack spacing={3}>
      <EmptyContent 
        filled 
        title="No Columns"
        description="Start by adding a column to organize your tasks"
        sx={{ py: 10, maxHeight: { md: 480 } }} 
      />
      {selectedBoardId && (
        <Stack direction="row" sx={{ gap: 'var(--column-gap)' }}>
          <KanbanColumnAdd id={PLACEHOLDER_ID} boardId={selectedBoardId} />
        </Stack>
      )}
    </Stack>
  );

  const renderList = (
    <DndContext
      id="dnd-kanban"
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <Stack sx={{ flex: '1 1 auto', overflowX: 'auto' }}>
        <Stack
          sx={{
            pb: 3,
            display: 'unset',
            ...(columnFixed && { minHeight: 0, display: 'flex', flex: '1 1 auto' }),
          }}
        >
          <Stack
            direction="row"
            sx={{
              gap: 'var(--column-gap)',
              ...(columnFixed && {
                minHeight: 0,
                flex: '1 1 auto',
                [`& .${kanbanClasses.columnList}`]: { ...hideScrollY, flex: '1 1 auto' },
              }),
            }}
          >
            <SortableContext
              items={[...columnIds, PLACEHOLDER_ID]}
              strategy={horizontalListSortingStrategy}
            >
              {selectedBoardId && board?.columns?.filter((column): column is IKanbanColumn => {
                const isValid = typeof column.boardId === 'string' && 
                              typeof column.name === 'string' && 
                              typeof column.id === 'string';
                              
                if (!isValid) {
                  console.warn('Invalid column data:', { column, selectedBoardId });
                }
                return isValid;
              }).map((column: IKanbanColumn) => (
                <KanbanColumn key={column.id} column={column} tasks={board?.tasks?.[column.id] || []}>
                  <SortableContext
                    items={board?.tasks?.[column.id] || []}
                    strategy={verticalListSortingStrategy}
                  >
                    {board?.tasks?.[column.id]?.map((task: IKanbanTask) => (
                      <KanbanTaskItem
                        task={task}
                        key={task.id}
                        columnId={column.id}
                        disabled={isSortingContainer}
                        boardId={selectedBoardId}
                      />
                    ))}
                  </SortableContext>
                </KanbanColumn>
              ))}
  
              <KanbanColumnAdd id={PLACEHOLDER_ID} boardId={selectedBoardId} />
            </SortableContext>
          </Stack>
        </Stack>
      </Stack>
      <KanbanDragOverlay
        columns={board?.columns}
        tasks={board?.tasks}
        activeId={activeId || ''}
        sx={cssVars}
      />
    </DndContext>
  );

  return (
    <DashboardContent
      maxWidth={false}
      sx={{
        ...cssVars,
        pb: 0,
        pl: { sm: 3 },
        pr: { sm: 0 },
        flex: '1 1 0',
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ pr: { sm: 3 }, mb: { xs: 3, md: 5 } }}
      >
        <Typography variant="h4">Kanban</Typography>

        <Stack direction="row" spacing={2}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="board-select-label">Select Board</InputLabel>
            <Select
              labelId="board-select-label"
              value={selectedBoardId}
              onChange={(event) => {
                console.log('Board selection changed:', {
                  previousId: selectedBoardId,
                  newId: event.target.value
                });
                setSelectedBoardId(event.target.value);
              }}
              label="Select Board"
            >
              {Array.isArray(boards) ? boards.map((boardSmall: IKanbanBoard) => (
                <MenuItem key={boardSmall._id} value={boardSmall._id}>
                  {boardSmall.name}
                </MenuItem>
              )) : null}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={openCreateBoard.onTrue}
          >
            New Board
          </Button>
        </Stack>

        <FormControlLabel
          label="Column fixed"
          labelPlacement="start"
          control={
            <Switch
              checked={columnFixed}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setColumnFixed(event.target.checked);
              }}
              inputProps={{ id: 'column-fixed-switch' }}
            />
          }
        />
      </Stack>

      {boardLoading || boardsLoading ? renderLoading : <>{boardEmpty ? renderEmpty : renderList}</>}

      <KanbanBoardCreateDialog 
        open={openCreateBoard.value} 
        onClose={openCreateBoard.onFalse} 
      />
    </DashboardContent>
  );
}
