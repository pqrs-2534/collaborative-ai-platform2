import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiZap } from 'react-icons/fi';
import { getIdeas } from '../../redux/slices/ideaSlice';
import IdeaCard from './IdeaCard';
import Loader from '../common/Loader';

const IdeaList = ({ projectId, onRefine, onEdit }) => {
  const dispatch = useDispatch();
  const { ideas, loading } = useSelector((state) => state.ideas);

  useEffect(() => {
    if (projectId) dispatch(getIdeas({ project: projectId }));
  }, [projectId, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="md" text="Loading ideas…" />
      </div>
    );
  }

  if (!ideas || ideas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <FiZap size={24} className="text-purple-500" />
        </div>
        <p className="text-sm text-gray-500">No ideas yet. Use the generator above to create one.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ideas.map((idea) => (
        <IdeaCard key={idea._id} idea={idea} onRefine={onRefine} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default IdeaList;