import React, { useMemo, useState } from 'react';
import { FileBarChart2, Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { useAppStore } from '../store/useAppStore';
import { Card, ScoreRing, EmptyState, Button } from '../components/ui/UIComponents';
import { getScoreColor, formatDate } from '../utils/helpers';
import './Reports.css';

function TrendIcon({ value }) {
  if (value > 0)  return <TrendingUp  size={13} color="var(--color-success)" />;
  if (value < 0)  return <TrendingDown size={13} color="var(--color-danger)"  />;
  return              <Minus size={13} color="var(--color-text-3)" />;
}

function ScoreBar({ label, score }) {
  const color = getScoreColor(score);
  return (
    <div className="score-bar-row">
      <span className="score-bar-label">{label}</span>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="score-bar-value" style={{ color }}>{score}</span>
    </div>
  );
}

export default function Reports() {
  const { projects, auditHistory } = useAppStore();
  const [activeClient, setActiveClient] = useState(null);

  // Build per-client report data from live projects that have performance scores
  const clientReports = useMemo(() => {
    const liveProjects = projects.filter((p) => p.status === 'live' && p.performanceScore !== null);

    const byClient = {};
    liveProjects.forEach((p) => {
      if (!byClient[p.clientName]) {
        byClient[p.clientName] = { clientName: p.clientName, projects: [] };
      }
      byClient[p.clientName].projects.push(p);
    });

    return Object.values(byClient).map((c) => {
      const avgPerf = Math.round(
        c.projects.reduce((s, p) => s + (p.performanceScore || 0), 0) / c.projects.length
      );
      const avgLcp = (
        c.projects.reduce((s, p) => s + (parseFloat(p.lcp) || 0), 0) / c.projects.length
      ).toFixed(1);
      const avgCls = (
        c.projects.reduce((s, p) => s + (parseFloat(p.cls) || 0), 0) / c.projects.length
      ).toFixed(2);
      return { ...c, avgPerf, avgLcp, avgCls };
    });
  }, [projects]);

  // Chart data — all live project scores
  const chartData = useMemo(() => {
    return projects
      .filter((p) => p.status === 'live' && p.performanceScore)
      .map((p) => ({
        name: p.name.length > 18 ? p.name.slice(0, 18) + '…' : p.name,
        score: p.performanceScore,
        client: p.clientName,
      }));
  }, [projects]);

  // Summary stats
  const summary = useMemo(() => {
    const scored = projects.filter((p) => p.performanceScore);
    const avg = scored.length
      ? Math.round(scored.reduce((s, p) => s + p.performanceScore, 0) / scored.length)
      : 0;
    const best = scored.reduce((b, p) => (p.performanceScore > (b?.performanceScore || 0) ? p : b), null);
    const worst = scored.reduce((w, p) => (p.performanceScore < (w?.performanceScore || 100) ? p : w), null);
    return { avg, best, worst, total: scored.length };
  }, [projects]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>{d.name}</p>
        <p style={{ fontSize: 11, color: 'var(--color-text-3)' }}>{d.client}</p>
        <p style={{ fontSize: 14, fontWeight: 700, color: getScoreColor(d.score), marginTop: 4 }}>
          {d.score} / 100
        </p>
      </div>
    );
  };

  if (projects.filter((p) => p.status === 'live').length === 0) {
    return (
      <EmptyState
        icon={FileBarChart2}
        title="No report data yet"
        description="Reports are generated from live projects with performance scores."
      />
    );
  }

  return (
    <div className="reports">
      {/* Summary row */}
      <div className="reports__summary">
        <Card className="reports__summary-card">
          <p className="reports__summary-label">Agency Avg Score</p>
          <p className="reports__summary-value" style={{ color: getScoreColor(summary.avg) }}>
            {summary.avg}
          </p>
          <p className="reports__summary-sub">across {summary.total} live projects</p>
        </Card>
        <Card className="reports__summary-card">
          <p className="reports__summary-label">Best Performer</p>
          <p className="reports__summary-value" style={{ color: 'var(--color-success)' }}>
            {summary.best?.performanceScore ?? '—'}
          </p>
          <p className="reports__summary-sub truncate">{summary.best?.name ?? '—'}</p>
        </Card>
        <Card className="reports__summary-card">
          <p className="reports__summary-label">Needs Attention</p>
          <p className="reports__summary-value" style={{ color: 'var(--color-warning)' }}>
            {summary.worst?.performanceScore ?? '—'}
          </p>
          <p className="reports__summary-sub truncate">{summary.worst?.name ?? '—'}</p>
        </Card>
        <Card className="reports__summary-card">
          <p className="reports__summary-label">Projects Tracked</p>
          <p className="reports__summary-value">{summary.total}</p>
          <p className="reports__summary-sub">live &amp; scored</p>
        </Card>
      </div>

      {/* Bar chart */}
      <Card>
        <h3 className="reports__section-title">Performance Scores — All Live Projects</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 8, right: 16, left: -20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: 'var(--color-text-3)' }}
              angle={-35} textAnchor="end"
              interval={0}
              axisLine={false} tickLine={false}
            />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--color-text-3)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={getScoreColor(entry.score)} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Per-client reports */}
      <h3 className="reports__section-title">Client Performance Reports</h3>
      <div className="reports__clients">
        {clientReports.map((c) => (
          <Card key={c.clientName} className="reports__client-card">
            <div className="reports__client-header">
              <div>
                <h4 className="reports__client-name">{c.clientName}</h4>
                <p className="reports__client-sub">{c.projects.length} project{c.projects.length !== 1 ? 's' : ''}</p>
              </div>
              <ScoreRing score={c.avgPerf} size={64} label="Avg" />
            </div>

            <div className="reports__client-metrics">
              <div className="reports__metric">
                <span className="reports__metric-label">LCP</span>
                <span className="reports__metric-value">{c.avgLcp}s</span>
              </div>
              <div className="reports__metric">
                <span className="reports__metric-label">CLS</span>
                <span className="reports__metric-value">{c.avgCls}</span>
              </div>
            </div>

            <div className="reports__client-projects">
              {c.projects.map((p) => (
                <ScoreBar key={p.id} label={p.name.length > 22 ? p.name.slice(0, 22) + '…' : p.name} score={p.performanceScore} />
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Audit history table */}
      {auditHistory.length > 0 && (
        <>
          <h3 className="reports__section-title">Audit Log</h3>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div className="reports__table-header">
              <span>URL</span>
              <span>Performance</span>
              <span>Accessibility</span>
              <span>Best Practices</span>
              <span>SEO</span>
              <span>Date</span>
            </div>
            {auditHistory.map((a) => (
              <div key={a.id} className="reports__table-row">
                <span className="reports__table-url truncate">{a.url}</span>
                <span style={{ color: getScoreColor(a.performance), fontWeight: 600 }}>{a.performance}</span>
                <span style={{ color: getScoreColor(a.accessibility), fontWeight: 600 }}>{a.accessibility}</span>
                <span style={{ color: getScoreColor(a.bestPractices), fontWeight: 600 }}>{a.bestPractices}</span>
                <span style={{ color: getScoreColor(a.seo), fontWeight: 600 }}>{a.seo}</span>
                <span className="reports__table-date">{formatDate(a.auditedAt)}</span>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  );
}
