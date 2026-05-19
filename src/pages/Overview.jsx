import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban, Users, Gauge, TrendingUp,
  CheckCircle2, Clock, ArrowRight, Activity,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { useAppStore } from '../store/useAppStore';
import { StatCard, Card, StatusBadge, ProgressBar } from '../components/ui/UIComponents';
import { formatDate } from '../utils/helpers';
import './Overview.css';

const PERF_TREND = [
  { month: 'Sep', avg: 72 }, { month: 'Oct', avg: 76 }, { month: 'Nov', avg: 79 },
  { month: 'Dec', avg: 83 }, { month: 'Jan', avg: 88 }, { month: 'Feb', avg: 91 },
];

export default function Overview() {
  const { projects, clients, auditHistory } = useAppStore();

  const stats = useMemo(() => {
    const live       = projects.filter((p) => p.status === 'live').length;
    const inProgress = projects.filter((p) => p.status === 'in-progress').length;
    const avgPerf    = auditHistory.length
      ? Math.round(auditHistory.reduce((s, a) => s + a.performance, 0) / auditHistory.length)
      : 0;
    return { live, inProgress, avgPerf };
  }, [projects, auditHistory]);

  const recentProjects = projects.slice(0, 5);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__label">{label}</p>
        <p className="chart-tooltip__value">{payload[0].value} avg score</p>
      </div>
    );
  };

  return (
    <div className="overview">
      {/* Header greeting */}
      <div className="overview__greeting">
        <h2 className="overview__greeting-title">Good morning, Eniola</h2>
        <p className="overview__greeting-sub">Here's your agency snapshot for today.</p>
      </div>

      {/* Stat cards */}
      <div className="overview__stats">
        <StatCard
          label="Total Projects"
          value={projects.length}
          sub={`${stats.live} live`}
          icon={FolderKanban}
          color="var(--color-accent)"
        />
        <StatCard
          label="Active Clients"
          value={clients.filter((c) => c.status === 'active').length}
          sub={`${clients.length} total`}
          icon={Users}
          color="var(--color-accent-2)"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          sub="active builds"
          icon={Clock}
          color="var(--color-warning)"
        />
        <StatCard
          label="Avg Performance"
          value={`${stats.avgPerf}`}
          sub="across audits"
          icon={Gauge}
          color="var(--color-success)"
        />
      </div>

      <div className="overview__grid">
        {/* Performance Trend chart */}
        <Card className="overview__chart-card">
          <div className="overview__section-header">
            <div>
              <h3 className="overview__section-title">Performance Trend</h3>
              <p className="overview__section-sub">Average Lighthouse scores over 6 months</p>
            </div>
            <Activity size={16} style={{ color: 'var(--color-text-3)' }} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={PERF_TREND} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4F7FFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4F7FFF" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-3)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'var(--color-text-3)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="avg"
                stroke="var(--color-accent)"
                strokeWidth={2}
                fill="url(#perfGrad)"
                dot={{ fill: 'var(--color-accent)', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent audit scores */}
        <Card className="overview__audits-card">
          <div className="overview__section-header">
            <h3 className="overview__section-title">Recent Audits</h3>
            <Link to="/audit" className="overview__link">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          {auditHistory.length === 0 ? (
            <p style={{ color: 'var(--color-text-3)', fontSize: 13, marginTop: 12 }}>
              No audits yet. Run your first audit.
            </p>
          ) : (
            <div className="overview__audit-list">
              {auditHistory.slice(0, 4).map((a) => (
                <div key={a.id} className="overview__audit-item">
                  <div className="overview__audit-meta">
                    <p className="overview__audit-client">{a.clientName || a.url}</p>
                    <p className="overview__audit-url truncate">{a.url}</p>
                  </div>
                  <div
                    className="overview__audit-score"
                    style={{ color: a.performance >= 90 ? 'var(--color-success)' : a.performance >= 50 ? 'var(--color-warning)' : 'var(--color-danger)' }}
                  >
                    {a.performance}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Projects */}
      <Card style={{ marginTop: 20 }}>
        <div className="overview__section-header">
          <h3 className="overview__section-title">Recent Projects</h3>
          <Link to="/projects" className="overview__link">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="overview__projects-table">
          <div className="overview__table-header">
            <span>Project</span>
            <span>Client</span>
            <span>Status</span>
            <span>Progress</span>
            <span>Due</span>
          </div>
          {recentProjects.map((p) => (
            <div key={p.id} className="overview__table-row">
              <span className="overview__project-name">{p.name}</span>
              <span className="overview__project-client truncate">{p.clientName}</span>
              <span><StatusBadge status={p.status} /></span>
              <span className="overview__project-progress">
                <ProgressBar value={p.progress} />
                <span className="overview__progress-pct">{p.progress}%</span>
              </span>
              <span className="overview__project-date">{formatDate(p.dueDate)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
