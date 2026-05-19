import React from 'react';
import { STATUS_META, PRIORITY_META, getScoreColor } from '../../utils/helpers';
import './UIComponents.css';

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ children, color, bg, style }) {
  return (
    <span
      className="badge"
      style={{ color, background: bg, ...style }}
    >
      {children}
    </span>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META['planned'];
  return (
    <Badge color={meta.color} bg={meta.bg}>
      <span className="badge__dot" style={{ background: meta.color }} />
      {meta.label}
    </Badge>
  );
}

// ── Priority Badge ────────────────────────────────────────────────────────────
export function PriorityBadge({ priority }) {
  const meta = PRIORITY_META[priority] || PRIORITY_META['low'];
  return (
    <Badge
      color={meta.color}
      bg={`${meta.color}18`}
    >
      {meta.label}
    </Badge>
  );
}

// ── Score Ring ────────────────────────────────────────────────────────────────
export function ScoreRing({ score, size = 72, strokeWidth = 6, label }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = score === null ? circ : circ - (score / 100) * circ;
  const color = getScoreColor(score);

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="score-ring__inner">
        <span className="score-ring__value" style={{ color }}>
          {score ?? '—'}
        </span>
        {label && <span className="score-ring__label">{label}</span>}
      </div>
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
export function ProgressBar({ value = 0, color = 'var(--color-accent)' }) {
  return (
    <div className="progress-bar">
      <div
        className="progress-bar__fill"
        style={{ width: `${Math.min(value, 100)}%`, background: color }}
      />
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', style }) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon: Icon, color = 'var(--color-accent)' }) {
  return (
    <Card className="stat-card">
      <div className="stat-card__icon" style={{ background: `${color}18`, color }}>
        <Icon size={18} />
      </div>
      <div className="stat-card__body">
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">{value}</p>
        {sub && <p className="stat-card__sub">{sub}</p>}
      </div>
    </Card>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="empty-state__icon">
          <Icon size={28} />
        </div>
      )}
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__desc">{description}</p>}
      {action}
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', type = 'button', icon: Icon }) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, id, error, ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label" htmlFor={id}>{label}</label>}
      <input id={id} className={`input ${error ? 'input--error' : ''}`} {...props} />
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
export function Select({ label, id, error, children, ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label" htmlFor={id}>{label}</label>}
      <select id={id} className={`input select ${error ? 'input--error' : ''}`} {...props}>
        {children}
      </select>
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
