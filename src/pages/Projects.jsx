import React, { useState, useMemo } from 'react';
import { Plus, Search, ExternalLink, Trash2, FolderKanban, LayoutList, Columns3 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import {
  Card, StatusBadge, PriorityBadge, ProgressBar,
  Button, Input, Select, Modal, EmptyState,
} from '../components/ui/UIComponents';
import { formatDate } from '../utils/helpers';
import './Projects.css';

const EMPTY_FORM = {
  name: '', clientName: '', type: 'Website', status: 'planned',
  priority: 'medium', progress: 0, startDate: '', dueDate: '',
  description: '', techStack: '', url: '',
};

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject } = useAppStore();
  const [view, setView]       = useState('list');   // 'list' | 'kanban'
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [errors, setErrors]   = useState({});

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.clientName.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || p.status === filter;
      return matchSearch && matchFilter;
    });
  }, [projects, search, filter]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())       e.name = 'Project name required';
    if (!form.clientName.trim()) e.clientName = 'Client name required';
    if (!form.dueDate)           e.dueDate = 'Due date required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    addProject({
      ...form,
      progress:  Number(form.progress),
      techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setForm(EMPTY_FORM);
    setShowModal(false);
    setErrors({});
  };

  const KANBAN_COLS = ['planned', 'in-progress', 'live', 'paused'];

  return (
    <div className="projects">
      {/* Toolbar */}
      <div className="projects__toolbar">
        <div className="projects__search-wrap">
          <Search size={14} className="projects__search-icon" />
          <input
            className="projects__search"
            placeholder="Search projects or clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="projects__toolbar-right">
          <select
            className="projects__filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="live">Live</option>
            <option value="paused">Paused</option>
          </select>
          <div className="projects__view-toggle">
            <button
              className={`view-btn ${view === 'list' ? 'view-btn--active' : ''}`}
              onClick={() => setView('list')} title="List view"
            >
              <LayoutList size={15} />
            </button>
            <button
              className={`view-btn ${view === 'kanban' ? 'view-btn--active' : ''}`}
              onClick={() => setView('kanban')} title="Kanban view"
            >
              <Columns3 size={15} />
            </button>
          </div>
          <Button icon={Plus} onClick={() => setShowModal(true)}>
            New Project
          </Button>
        </div>
      </div>

      {/* List View */}
      {view === 'list' && (
        filtered.length === 0
          ? <EmptyState icon={FolderKanban} title="No projects found" description="Try adjusting your search or add a new project." />
          : (
            <div className="projects__list">
              <div className="projects__list-header">
                <span>Project</span>
                <span>Client</span>
                <span>Status</span>
                <span>Priority</span>
                <span>Progress</span>
                <span>Due Date</span>
                <span></span>
              </div>
              {filtered.map((p) => (
                <div key={p.id} className="projects__list-row">
                  <div className="projects__name-cell">
                    <p className="projects__name">{p.name}</p>
                    <p className="projects__type">{p.type}</p>
                  </div>
                  <span className="projects__client truncate">{p.clientName}</span>
                  <span><StatusBadge status={p.status} /></span>
                  <span><PriorityBadge priority={p.priority} /></span>
                  <div className="projects__progress-cell">
                    <ProgressBar value={p.progress} />
                    <span className="projects__progress-num">{p.progress}%</span>
                  </div>
                  <span className="projects__date">{formatDate(p.dueDate)}</span>
                  <div className="projects__actions">
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noreferrer" className="projects__action-btn" title="View live">
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      className="projects__action-btn projects__action-btn--danger"
                      onClick={() => deleteProject(p.id)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
      )}

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="projects__kanban">
          {KANBAN_COLS.map((col) => {
            const colProjects = filtered.filter((p) => p.status === col);
            return (
              <div key={col} className="kanban-col">
                <div className="kanban-col__header">
                  <StatusBadge status={col} />
                  <span className="kanban-col__count">{colProjects.length}</span>
                </div>
                <div className="kanban-col__cards">
                  {colProjects.length === 0 && (
                    <p className="kanban-col__empty">No projects</p>
                  )}
                  {colProjects.map((p) => (
                    <Card key={p.id} className="kanban-card">
                      <div className="kanban-card__header">
                        <PriorityBadge priority={p.priority} />
                        {p.url && (
                          <a href={p.url} target="_blank" rel="noreferrer" className="kanban-card__link">
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                      <p className="kanban-card__name">{p.name}</p>
                      <p className="kanban-card__client">{p.clientName}</p>
                      {p.description && (
                        <p className="kanban-card__desc">{p.description}</p>
                      )}
                      <div className="kanban-card__footer">
                        <ProgressBar value={p.progress} />
                        <div className="kanban-card__meta">
                          <span>{p.progress}%</span>
                          <span>{formatDate(p.dueDate)}</span>
                        </div>
                      </div>
                      {p.techStack?.length > 0 && (
                        <div className="kanban-card__tags">
                          {p.techStack.slice(0, 3).map((t) => (
                            <span key={t} className="kanban-tag">{t}</span>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Project Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setErrors({}); }} title="Add New Project">
        <div className="projects__form">
          <div className="projects__form-row">
            <Input
              label="Project Name" id="name" placeholder="e.g. Brand Website Revamp"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
            />
            <Input
              label="Client Name" id="clientName" placeholder="e.g. Olu Luxury Holdings"
              value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              error={errors.clientName}
            />
          </div>
          <div className="projects__form-row">
            <Select label="Status" id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="live">Live</option>
              <option value="paused">Paused</option>
            </Select>
            <Select label="Priority" id="priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </div>
          <div className="projects__form-row">
            <Select label="Type" id="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option>Website</option>
              <option>Platform</option>
              <option>Feature</option>
              <option>Component Library</option>
              <option>Other</option>
            </Select>
            <Input
              label="Progress (%)" id="progress" type="number" min="0" max="100"
              value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })}
            />
          </div>
          <div className="projects__form-row">
            <Input
              label="Start Date" id="startDate" type="date"
              value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
            <Input
              label="Due Date" id="dueDate" type="date"
              value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              error={errors.dueDate}
            />
          </div>
          <Input
            label="Live URL (optional)" id="url" placeholder="https://..."
            value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
          <Input
            label="Tech Stack (comma-separated)" id="techStack" placeholder="React, Tailwind CSS, REST API"
            value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })}
          />
          <div className="projects__form-actions">
            <Button variant="secondary" onClick={() => { setShowModal(false); setErrors({}); }}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Project</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
