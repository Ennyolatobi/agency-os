import React, { useState } from 'react';
import { Plus, Users, Mail, Building2, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Card, Button, Input, Select, Modal, EmptyState, Badge } from '../components/ui/UIComponents';
import { formatDate } from '../utils/helpers';
import './Clients.css';

const EMPTY_FORM = { name: '', industry: '', contact: '', status: 'active' };

export default function Clients() {
  const { clients, addClient, projects } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name = 'Name required';
    if (!form.contact.trim()) e.contact = 'Contact required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    addClient(form);
    setForm(EMPTY_FORM);
    setShowModal(false);
    setErrors({});
  };

  const getClientProjects = (clientName) =>
    projects.filter((p) => p.clientName === clientName);

  return (
    <div className="clients">
      <div className="clients__toolbar">
        <p className="clients__count">{clients.length} clients</p>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Add Client
        </Button>
      </div>

      {clients.length === 0 ? (
        <EmptyState icon={Users} title="No clients yet" description="Add your first client to get started." />
      ) : (
        <div className="clients__grid">
          {clients.map((c) => {
            const clientProjects = getClientProjects(c.name);
            const live = clientProjects.filter((p) => p.status === 'live').length;
            return (
              <Card key={c.id} className="client-card">
                <div className="client-card__header">
                  <div className="client-card__avatar">
                    {c.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <Badge
                    color={c.status === 'active' ? 'var(--color-success)' : 'var(--color-text-3)'}
                    bg={c.status === 'active' ? 'rgba(52,209,122,0.12)' : 'var(--color-surface-2)'}
                  >
                    {c.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <h3 className="client-card__name">{c.name}</h3>

                <div className="client-card__details">
                  <div className="client-card__detail">
                    <Building2 size={12} />
                    <span>{c.industry || 'Unknown industry'}</span>
                  </div>
                  <div className="client-card__detail">
                    <Mail size={12} />
                    <span className="truncate">{c.contact}</span>
                  </div>
                </div>

                <div className="client-card__stats">
                  <div className="client-card__stat">
                    <p className="client-card__stat-value">{clientProjects.length}</p>
                    <p className="client-card__stat-label">Projects</p>
                  </div>
                  <div className="client-card__stat">
                    <p className="client-card__stat-value">{live}</p>
                    <p className="client-card__stat-label">Live</p>
                  </div>
                  <div className="client-card__stat">
                    <p className="client-card__stat-value">{formatDate(c.joinedAt)}</p>
                    <p className="client-card__stat-label">Joined</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setErrors({}); }} title="Add Client">
        <div className="clients__form">
          <Input
            label="Company Name" id="cname" placeholder="e.g. Olu Luxury Holdings"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
          />
          <Input
            label="Industry" id="industry" placeholder="e.g. Luxury / Mobility"
            value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}
          />
          <Input
            label="Contact Email" id="contact" type="email" placeholder="hello@company.com"
            value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
            error={errors.contact}
          />
          <Select label="Status" id="cstatus" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
          <div className="clients__form-actions">
            <Button variant="secondary" onClick={() => { setShowModal(false); setErrors({}); }}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Client</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
