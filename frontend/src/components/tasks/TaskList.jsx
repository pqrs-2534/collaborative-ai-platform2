import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiClipboard } from 'react-icons/fi';
import TaskCard from './TaskCard';
import TaskDetail from './TaskDetail';
import Modal from '../common/Modal';
import Loader from '../common/Loader';

const TaskList = () => {
  const { tasks, loading } = useSelector((state) => state.tasks);
  const [selected, setSelected] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="md" text="Loading tasks…" />
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
          <FiClipboard size={24} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">No tasks yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onClick={() => setSelected(task)} />
        ))}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Task Details" size="lg">
        {selected && (
          <TaskDetail
            task={selected}
            onClose={() => setSelected(null)}
            onUpdated={(updated) => setSelected(updated)}
          />
        )}
      </Modal>
    </>
  );
};

export default TaskList;