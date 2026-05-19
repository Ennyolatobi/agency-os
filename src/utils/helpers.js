// ── Date Formatting ───────────────────────────────────────────────────────────
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// ── Status Helpers ────────────────────────────────────────────────────────────
export const STATUS_META = {
  live:        { label: 'Live',        color: '#34D17A', bg: 'rgba(52,209,122,0.12)' },
  'in-progress':{ label: 'In Progress', color: '#4FC3F7', bg: 'rgba(79,195,247,0.12)' },
  planned:     { label: 'Planned',     color: '#F5A623', bg: 'rgba(245,166,35,0.12)' },
  paused:      { label: 'Paused',      color: '#8B92A5', bg: 'rgba(139,146,165,0.12)' },
  cancelled:   { label: 'Cancelled',   color: '#FF5C5C', bg: 'rgba(255,92,92,0.12)' },
};

export const PRIORITY_META = {
  high:   { label: 'High',   color: '#FF5C5C' },
  medium: { label: 'Medium', color: '#F5A623' },
  low:    { label: 'Low',    color: '#34D17A' },
};

// ── Performance Score Helpers ─────────────────────────────────────────────────
export const getScoreColor = (score) => {
  if (score === null || score === undefined) return '#555E72';
  if (score >= 90) return '#34D17A';
  if (score >= 50) return '#F5A623';
  return '#FF5C5C';
};

export const getScoreLabel = (score) => {
  if (score >= 90) return 'Good';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
};

export const getMetricStatus = (metric, value) => {
  const thresholds = {
    lcp:  { good: 2.5,  poor: 4.0  },
    cls:  { good: 0.1,  poor: 0.25 },
    fcp:  { good: 1.8,  poor: 3.0  },
    ttfb: { good: 0.8,  poor: 1.8  },
    tbt:  { good: 200,  poor: 600  },
  };
  const t = thresholds[metric];
  if (!t || value === null) return 'unknown';
  if (value <= t.good) return 'good';
  if (value <= t.poor) return 'needs-improvement';
  return 'poor';
};

export const METRIC_STATUS_COLOR = {
  good:               '#34D17A',
  'needs-improvement':'#F5A623',
  poor:               '#FF5C5C',
  unknown:            '#555E72',
};

// ── Misc ──────────────────────────────────────────────────────────────────────
export const clsx = (...classes) => classes.filter(Boolean).join(' ');
