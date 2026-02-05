import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiGrid, FiList, FiMessageSquare, FiUsers, FiZap, FiFileText, FiEdit } from 'react-icons/fi';
import { getProject } from '../redux/slices/projectSlice';
import { getTasks } from '../redux/slices/taskSlice';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskList from '../components/tasks/TaskList';
import ChatBox from '../components/chat/ChatBox';
import MembersList from '../components/projects/MembersList';
import IdeaGenerator from '../components/ai/IdeaGenerator';
import IdeaList from '../components/ai/IdeaList';
import DocumentList from '../components/documents/DocumentList';
import DocumentEditor from '../components/documents/DocumentEditor';
import Whiteboard from '../components/whiteboard/Whiteboard';

const TABS = [
  { id: 'board',      label: 'Board',      icon: FiGrid },
  { id: 'list',       label: 'List',       icon: FiList },
  { id: 'chat',       label: 'Chat',       icon: FiMessageSquare },
  { id: 'ai',         label: 'AI Ideas',   icon: FiZap },  // Changed from FiLightbulb
  { id: 'docs',       label: 'Docs',       icon: FiFileText },
  { id: 'whiteboard', label: 'Whiteboard', icon: FiEdit },
  { id: 'team',       label: 'Team',       icon: FiUsers },
];

const ProjectPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject, loading } = useSelector((state) => state.projects);
  const [activeTab, setActiveTab] = useState('board');
  const [openDoc, setOpenDoc] = useState(null); // when user clicks a doc to edit

  useEffect(() => {
    if (id) {
      dispatch(getProject(id));
      dispatch(getTasks({ project: id }));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" text="Loading project…" />
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Project not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{currentProject.name}</h1>
            <Badge variant={currentProject.status === 'active' ? 'success' : 'default'}>
              {(currentProject.status || '').replace('_', ' ')}
            </Badge>
          </div>
          {currentProject.description && (
            <p className="text-gray-600 text-sm mt-1">{currentProject.description}</p>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setOpenDoc(null); }}
              className={`
                px-4 py-2.5 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'}
              `}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'board'      && <KanbanBoard />}
        {activeTab === 'list'       && <TaskList />}
        {activeTab === 'chat'       && <ChatBox />}
        {activeTab === 'team'       && <MembersList projectId={id} />}

        {activeTab === 'ai' && (
          <div className="space-y-6">
            <IdeaGenerator projectId={id} onGenerated={() => {}} />
            <IdeaList projectId={id} />
          </div>
        )}

        {activeTab === 'docs' && (
          openDoc
            ? <DocumentEditor doc={openDoc} onBack={() => setOpenDoc(null)} />
            : <DocumentList onOpen={(doc) => setOpenDoc(doc)} />
        )}

        {activeTab === 'whiteboard' && <Whiteboard />}
      </div>
    </div>
  );
};

export default ProjectPage;