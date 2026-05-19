import React, { useState } from 'react';
import {
  Search, Gauge, AlertCircle, CheckCircle, Clock,
  Smartphone, Monitor, Trash2, ExternalLink,
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { usePageSpeedAudit } from '../hooks/usePageSpeedAudit';
import { useAppStore } from '../store/useAppStore';
import {
  Card, ScoreRing, Button, EmptyState, Badge,
} from '../components/ui/UIComponents';
import { getScoreColor, getMetricStatus, METRIC_STATUS_COLOR, formatRelativeTime } from '../utils/helpers';
import './Audit.css';

const METRIC_INFO = {
  lcp:  { label: 'LCP',  desc: 'Largest Contentful Paint', unit: 's',  good: '≤ 2.5s' },
  fcp:  { label: 'FCP',  desc: 'First Contentful Paint',   unit: 's',  good: '≤ 1.8s' },
  cls:  { label: 'CLS',  desc: 'Cumulative Layout Shift',  unit: '',   good: '≤ 0.1'  },
  ttfb: { label: 'TTFB', desc: 'Time to First Byte',       unit: 's',  good: '≤ 0.8s' },
  tbt:  { label: 'TBT',  desc: 'Total Blocking Time',      unit: 'ms', good: '≤ 200ms'},
};

function MetricPill({ metricKey, value }) {
  const info    = METRIC_INFO[metricKey];
  const status  = getMetricStatus(metricKey, parseFloat(value));
  const color   = METRIC_STATUS_COLOR[status];
  const display = value !== null ? `${value}${info.unit}` : '—';

  return (
    <div className="metric-pill">
      <div className="metric-pill__header">
        <span className="metric-pill__label">{info.label}</span>
        <span className="metric-pill__good">{info.good}</span>
      </div>
      <p className="metric-pill__value" style={{ color }}>{display}</p>
      <p className="metric-pill__desc">{info.desc}</p>
    </div>
  );
}

export default function Audit() {
  const { runAudit, loading, error, result } = usePageSpeedAudit();
  const { addAuditResult, auditHistory, clearAuditHistory } = useAppStore();
  const [url, setUrl]         = useState('');
  const [device, setDevice]   = useState('mobile');
  const [submitted, setSubmitted] = useState(false);

  const handleAudit = async () => {
    if (!url.trim()) return;
    let cleanUrl = url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = 'https://' + cleanUrl;
    setSubmitted(true);
    const res = await runAudit(cleanUrl);
  };

  // Save to history once result arrives
  React.useEffect(() => {
    if (result) {
      addAuditResult({
        url: result.url,
        clientName: '',
        performance:   result.mobile.performance,
        accessibility: result.mobile.accessibility,
        bestPractices: result.mobile.bestPractices,
        seo:           result.mobile.seo,
        lcp:  parseFloat(result.mobile.lcp),
        cls:  parseFloat(result.mobile.cls),
        fcp:  parseFloat(result.mobile.fcp),
        ttfb: parseFloat(result.mobile.ttfb),
        tbt:  result.mobile.tbt,
      });
    }
  }, [result]);

  const activeData = result ? result[device] : null;

  const radarData = activeData
    ? [
        { subject: 'Performance',   value: activeData.performance   },
        { subject: 'Accessibility', value: activeData.accessibility },
        { subject: 'Best Practices',value: activeData.bestPractices },
        { subject: 'SEO',           value: activeData.seo           },
      ]
    : [];

  return (
    <div className="audit">
      {/* Input bar */}
      <Card className="audit__input-card">
        <div className="audit__input-row">
          <div className="audit__url-wrap">
            <ExternalLink size={14} className="audit__url-icon" />
            <input
              className="audit__url-input"
              placeholder="Enter a URL to audit  e.g. https://yoursite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
            />
          </div>
          <Button
            onClick={handleAudit}
            disabled={loading || !url.trim()}
            icon={loading ? undefined : Search}
          >
            {loading ? 'Auditing...' : 'Run Audit'}
          </Button>
        </div>
        <p className="audit__input-hint">
          Uses Google PageSpeed Insights API · Audits both mobile and desktop · No API key required
        </p>
      </Card>

      {/* Loading */}
      {loading && (
        <Card className="audit__loading">
          <div className="audit__spinner" />
          <div>
            <p className="audit__loading-title">Running audit...</p>
            <p className="audit__loading-sub">Fetching mobile and desktop scores from PageSpeed Insights</p>
          </div>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="audit__error">
          <AlertCircle size={18} color="var(--color-danger)" />
          <div>
            <p className="audit__error-title">Audit failed</p>
            <p className="audit__error-sub">{error}</p>
          </div>
        </Card>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="audit__results">
          {/* Device toggle */}
          <div className="audit__device-toggle">
            <button
              className={`device-btn ${device === 'mobile' ? 'device-btn--active' : ''}`}
              onClick={() => setDevice('mobile')}
            >
              <Smartphone size={14} /> Mobile
            </button>
            <button
              className={`device-btn ${device === 'desktop' ? 'device-btn--active' : ''}`}
              onClick={() => setDevice('desktop')}
            >
              <Monitor size={14} /> Desktop
            </button>
          </div>

          {/* 4 score rings */}
          <div className="audit__scores">
            {['performance', 'accessibility', 'bestPractices', 'seo'].map((cat) => (
              <Card key={cat} className="audit__score-card">
                <ScoreRing score={activeData[cat]} size={80} label={cat === 'bestPractices' ? 'Practices' : cat} />
              </Card>
            ))}
          </div>

          <div className="audit__lower">
            {/* Core Web Vitals */}
            <Card className="audit__metrics-card">
              <h3 className="audit__section-title">Core Web Vitals</h3>
              <div className="audit__metrics-grid">
                {Object.keys(METRIC_INFO).map((key) => (
                  <MetricPill key={key} metricKey={key} value={activeData[key]} />
                ))}
              </div>
            </Card>

            {/* Radar chart */}
            <Card className="audit__radar-card">
              <h3 className="audit__section-title">Score Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--color-text-3)' }} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="var(--color-accent)"
                    fill="var(--color-accent)"
                    fillOpacity={0.2}
                  />
                  <Tooltip
                    contentStyle={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: 'var(--color-text)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Opportunities */}
          {result.opportunities?.length > 0 && (
            <Card>
              <h3 className="audit__section-title" style={{ marginBottom: 14 }}>Improvement Opportunities</h3>
              <div className="audit__opportunities">
                {result.opportunities.map((o) => (
                  <div key={o.id} className="audit__opp">
                    <div
                      className="audit__opp-dot"
                      style={{ background: o.score < 0.5 ? 'var(--color-danger)' : 'var(--color-warning)' }}
                    />
                    <div>
                      <p className="audit__opp-title">{o.title}</p>
                      {o.displayValue && (
                        <p className="audit__opp-value">{o.displayValue}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Audit History */}
      {auditHistory.length > 0 && (
        <div className="audit__history">
          <div className="audit__history-header">
            <h3 className="audit__section-title">Audit History</h3>
            <Button variant="ghost" size="sm" icon={Trash2} onClick={clearAuditHistory}>
              Clear
            </Button>
          </div>
          <div className="audit__history-list">
            {auditHistory.map((a) => (
              <Card key={a.id} className="audit__history-item">
                <div className="audit__history-meta">
                  <p className="audit__history-url truncate">{a.url}</p>
                  <p className="audit__history-time">{formatRelativeTime(a.auditedAt)}</p>
                </div>
                <div className="audit__history-scores">
                  {['performance', 'accessibility', 'bestPractices', 'seo'].map((cat) => (
                    <div key={cat} className="audit__history-score">
                      <span style={{ color: getScoreColor(a[cat]) }}>{a[cat]}</span>
                      <span className="audit__history-score-label">
                        {cat === 'bestPractices' ? 'BP' : cat.slice(0, 3).toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No audit yet */}
      {!result && !loading && !error && auditHistory.length === 0 && (
        <EmptyState
          icon={Gauge}
          title="No audits run yet"
          description="Enter a URL above to audit Core Web Vitals, performance, accessibility, and SEO."
        />
      )}
    </div>
  );
}
