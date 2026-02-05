import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiPlus } from 'react-icons/fi';
import { getTasks, updateTask } from '../../redux/slices/taskSlice';
import { TASK_STATUS } from '../../utils/constants';
import TaskCard from './TaskCard';
import CreateTask from './CreateTask';
import TaskDetail from './TaskDetail';
import Modal from '../common/Modal';
import Loader from '../common/Loader';

const COLUMNS = [
  { id: TASK_STATUS.TODO,        title: 'To Do',      color: 'bg-gray-500' },
  { id: TASK_STATUS.IN_PROGRESS, title: 'In Progress', color: 'bg-blue-500' },
  { id: TASK_STATUS.REVIEW,      title: 'Review',     color: 'bg-yellow-500' },
  { id: TASK_STATUS.DONE,        title: 'Done',       color: 'bg-green-500' },
];

const KanbanBoard = () => {
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);

  const [createOpen, setCreateOpen] = useState(false);
  const [createStatus, setCreateStatus] = useState('todo');
  const [detailTask, setDetailTask] = useState(null);

  useEffect(() => {
    if (projectId) dispatch(getTasks({ project: projectId }));
  }, [projectId, dispatch]);

  // Group tasks by status
  const columns = COLUMNS.map((col) => ({
    ...col,
    tasks: (tasks || []).filter((t) => t.status === col.id),
  }));

  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (result.source.droppableId === result.destination.droppableId &&
        result.source.index === result.destination.index) return;

    // If column changed, persist new status
    if (result.source.droppableId !== result.destination.droppableId) {
      dispatch(updateTask({
        id: result.draggableId,
        data: { status: result.destination.droppableId },
      }));
    }
  };

  const openCreateInColumn = (status) => {
    setCreateStatus(status);
    setCreateOpen(true);
  };

  if (loading && (!tasks || tasks.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="md" text="Loading board…" />
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-6" style={{ minHeight: 420 }}>
          {columns.map((col) => (
            <div key={col.id} className="flex-shrink-0 w-64 flex flex-col">
              {/* Column header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <h3 className="text-sm font-semibold text-gray-700">{col.title}</h3>
                  <span className="text-xs font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    {col.tasks.length}
                  </span>
                </div>
                <button
                  onClick={() => openCreateInColumn(col.id)}
                  className="p-1 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  <FiPlus size={16} />
                </button>
              </div>

              {/* Droppable body */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      flex-1 rounded-xl p-2 space-y-2 min-h-[240px] transition-colors
                      ${snapshot.isDraggingOver
                        ? 'bg-primary-50 border-2 border-dashed border-primary-300'
                        : 'bg-gray-50 border-2 border-transparent'}
                    `}
                  >
                    {col.tasks.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(dProvided, dSnapshot) => (
                          <div ref={dProvided.innerRef} {...dProvided.draggableProps} {...dProvided.dragHandleProps}>
                            <TaskCard
                              task={task}
                              provided={dProvided}
                              snapshot={dSnapshot}
                              onClick={() => setDetailTask(task)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Create task modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="New Task">
        <CreateTask
          projectId={projectId}
          defaultStatus={createStatus}
          onSuccess={() => {
            setCreateOpen(false);
            dispatch(getTasks({ project: projectId }));
          }}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      {/* Task detail modal */}
      <Modal isOpen={!!detailTask} onClose={() => setDetailTask(null)} title="Task Details" size="lg">
        {detailTask && (
          <TaskDetail
            task={detailTask}
            onClose={() => setDetailTask(null)}
            onUpdated={(u) => setDetailTask(u)}
          />
        )}
      </Modal>
    </>
  );
};

export default KanbanBoard;