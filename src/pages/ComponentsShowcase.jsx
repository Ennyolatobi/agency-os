import React, { useState } from 'react';
import {
  Bell, Check, X, AlertTriangle, Info, User, Star,
  Download, Send, Trash2, Edit, Plus, Search, ChevronRight,
  ToggleLeft, ToggleRight, Loader,
} from 'lucide-react';
import { Card, Button, Badge, StatusBadge, ProgressBar, ScoreRing } from '../components/ui/UIComponents';
import './ComponentsShowcase.css';

// ── Mini code preview ─────────────────────────────────────────────────────────
function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="code-block">
      <pre className="code-block__pre"><code>{code}</code></pre>
      <button className="code-block__copy" onClick={copy}>
        {copied ? <Check size={12} /> : <Download size={12} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, description, children, code }) {
  return (
    <Card className="showcase-section">
      <div className="showcase-section__header">
        <div>
          <h3 className="showcase-section__title">{title}</h3>
          {description && <p className="showcase-section__desc">{description}</p>}
        </div>
      </div>
      <div className="showcase-section__preview">{children}</div>
      {code && <CodeBlock code={code} />}
    </Card>
  );
}

// ── Toggle component demo ─────────────────────────────────────────────────────
function Toggle({ label, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="toggle-row" onClick={() => setOn(!on)}>
      {on ? (
        <ToggleRight size={26} color="var(--color-accent)" />
      ) : (
        <ToggleLeft size={26} color="var(--color-text-3)" />
      )}
      <span style={{ fontSize: 13, color: on ? 'var(--color-text)' : 'var(--color-text-3)' }}>
        {label}
      </span>
    </div>
  );
}

// ── Input demo ────────────────────────────────────────────────────────────────
function InputDemo() {
  const [val, setVal] = useState('');
  return (
    <div className="input-demo">
      <div style={{ position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-3)', pointerEvents: 'none' }} />
        <input
          className="input"
          style={{ paddingLeft: 34 }}
          placeholder="Search anything..."
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
      </div>
      <input className="input" placeholder="Default input" />
      <input className="input input--error" placeholder="Error state" defaultValue="Invalid value" />
      <textarea
        className="input"
        placeholder="Textarea input"
        rows={3}
        style={{ resize: 'vertical' }}
      />
    </div>
  );
}

// ── Toast demo ────────────────────────────────────────────────────────────────
function ToastDemo() {
  const toasts = [
    { icon: Check,         color: 'var(--color-success)', bg: 'rgba(52,209,122,0.1)',  border: 'rgba(52,209,122,0.2)',  label: 'Success', msg: 'Project saved successfully.' },
    { icon: AlertTriangle, color: 'var(--color-warning)', bg: 'rgba(245,166,35,0.1)',  border: 'rgba(245,166,35,0.2)',  label: 'Warning', msg: 'Audit found 3 issues.' },
    { icon: X,             color: 'var(--color-danger)',  bg: 'rgba(255,92,92,0.1)',   border: 'rgba(255,92,92,0.2)',   label: 'Error',   msg: 'Failed to load data.' },
    { icon: Info,          color: 'var(--color-info)',    bg: 'rgba(79,195,247,0.1)',  border: 'rgba(79,195,247,0.2)',  label: 'Info',    msg: 'New update available.' },
  ];
  return (
    <div className="toast-list">
      {toasts.map((t) => (
        <div key={t.label} className="toast-item" style={{ background: t.bg, borderColor: t.border }}>
          <t.icon size={14} color={t.color} />
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: t.color }}>{t.label}</p>
            <p style={{ fontSize: 11.5, color: 'var(--color-text-2)', marginTop: 1 }}>{t.msg}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Card variants demo ────────────────────────────────────────────────────────
function CardVariants() {
  return (
    <div className="card-variants">
      {/* Default */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={16} color="var(--color-accent)" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600 }}>Default Card</p>
            <p style={{ fontSize: 11, color: 'var(--color-text-3)' }}>Surface background</p>
          </div>
        </div>
        <ProgressBar value={68} />
      </Card>

      {/* Accent border */}
      <Card style={{ borderColor: 'var(--color-accent)', borderWidth: 1.5 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent)', marginBottom: 6 }}>Accent Card</p>
        <p style={{ fontSize: 12, color: 'var(--color-text-3)' }}>Highlighted with accent border for emphasis or selection state.</p>
      </Card>

      {/* Stat */}
      <Card style={{ background: 'linear-gradient(135deg, rgba(79,127,255,0.1), rgba(123,94,255,0.1))', borderColor: 'rgba(79,127,255,0.3)' }}>
        <p style={{ fontSize: 11, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Gradient Card</p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>94</p>
        <p style={{ fontSize: 12, color: 'var(--color-text-3)', marginTop: 4 }}>Performance score</p>
      </Card>
    </div>
  );
}

// ── Avatar group ──────────────────────────────────────────────────────────────
function AvatarGroup() {
  const people = [
    { initials: 'EN', color: '#4F7FFF' },
    { initials: 'AO', color: '#7B5EFF' },
    { initials: 'MB', color: '#34D17A' },
    { initials: 'KL', color: '#F5A623' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div className="avatar-group">
        {people.map((p) => (
          <div key={p.initials} className="avatar-group__item" style={{ background: p.color }}>
            {p.initials}
          </div>
        ))}
        <div className="avatar-group__item avatar-group__item--more">+3</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {people.map((p) => (
          <div key={p.initials} style={{ width: 32, height: 32, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
            {p.initials}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ComponentsShowcase() {
  return (
    <div className="showcase">
      <div className="showcase__intro">
        <p className="showcase__intro-text">
          A living reference of reusable UI components built for AgencyOS.
          All components use CSS custom properties for full theming support.
        </p>
      </div>

      <div className="showcase__grid">

        {/* Buttons */}
        <Section
          title="Buttons"
          description="4 variants · 3 sizes · icon support · disabled state"
          code={`<Button variant="primary">Save Changes</Button>\n<Button variant="secondary" icon={Plus}>Add Project</Button>\n<Button variant="ghost">Cancel</Button>\n<Button variant="danger" icon={Trash2}>Delete</Button>`}
        >
          <div className="showcase__row">
            <Button variant="primary" size="sm">Primary SM</Button>
            <Button variant="primary">Primary MD</Button>
            <Button variant="primary" size="lg">Primary LG</Button>
          </div>
          <div className="showcase__row">
            <Button variant="secondary" icon={Plus}>Add Project</Button>
            <Button variant="ghost" icon={Edit}>Edit</Button>
            <Button variant="danger" icon={Trash2}>Delete</Button>
            <Button variant="primary" disabled icon={Loader}>Loading...</Button>
          </div>
        </Section>

        {/* Badges */}
        <Section
          title="Badges & Status"
          description="Status indicators with semantic colour coding"
          code={`<StatusBadge status="live" />\n<StatusBadge status="in-progress" />\n<Badge color="#4F7FFF" bg="rgba(79,127,255,0.12)">Custom</Badge>`}
        >
          <div className="showcase__row showcase__row--wrap">
            <StatusBadge status="live" />
            <StatusBadge status="in-progress" />
            <StatusBadge status="planned" />
            <StatusBadge status="paused" />
            <StatusBadge status="cancelled" />
          </div>
          <div className="showcase__row showcase__row--wrap" style={{ marginTop: 10 }}>
            <Badge color="var(--color-accent)"   bg="var(--color-accent-glow)">Frontend</Badge>
            <Badge color="var(--color-success)"  bg="rgba(52,209,122,0.12)">Deployed</Badge>
            <Badge color="var(--color-warning)"  bg="rgba(245,166,35,0.12)">Review</Badge>
            <Badge color="var(--color-danger)"   bg="rgba(255,92,92,0.12)">Blocked</Badge>
            <Badge color="var(--color-text-2)"   bg="var(--color-surface-2)">Archived</Badge>
          </div>
        </Section>

        {/* Progress */}
        <Section
          title="Progress Bars"
          description="Semantic colour variants mapped to completion state"
          code={`<ProgressBar value={75} color="var(--color-accent)" />\n<ProgressBar value={45} color="var(--color-warning)" />`}
        >
          <div className="showcase__progress-list">
            {[
              { label: 'Completed (100%)',   value: 100, color: 'var(--color-success)' },
              { label: 'In Progress (65%)',  value: 65,  color: 'var(--color-accent)'  },
              { label: 'Early Stage (30%)',  value: 30,  color: 'var(--color-warning)' },
              { label: 'Critical (15%)',     value: 15,  color: 'var(--color-danger)'  },
            ].map((p) => (
              <div key={p.label} className="showcase__progress-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-2)' }}>{p.label}</span>
                  <span style={{ fontSize: 12, color: p.color, fontWeight: 600 }}>{p.value}%</span>
                </div>
                <ProgressBar value={p.value} color={p.color} />
              </div>
            ))}
          </div>
        </Section>

        {/* Score Rings */}
        <Section
          title="Score Rings"
          description="SVG-based radial score indicators for performance metrics"
          code={`<ScoreRing score={94} size={80} label="Perf" />\n<ScoreRing score={62} size={80} label="A11y" />`}
        >
          <div className="showcase__row">
            <ScoreRing score={97} size={80} label="Excellent" />
            <ScoreRing score={82} size={80} label="Good" />
            <ScoreRing score={61} size={80} label="Needs Work" />
            <ScoreRing score={34} size={80} label="Poor" />
            <ScoreRing score={null} size={80} label="N/A" />
          </div>
        </Section>

        {/* Inputs */}
        <Section
          title="Inputs"
          description="Unified input styles: default, with icon, error, and textarea"
          code={`<Input label="Project Name" placeholder="e.g. Brand Revamp" />\n<Input label="URL" error="Invalid URL format" />`}
        >
          <InputDemo />
        </Section>

        {/* Toggles */}
        <Section
          title="Toggles"
          description="Controlled toggle switches for boolean settings"
          code={`const [on, setOn] = useState(false);\n{on ? <ToggleRight ... /> : <ToggleLeft ... />}`}
        >
          <div className="showcase__toggle-list">
            <Toggle label="Email notifications" defaultOn={true} />
            <Toggle label="Auto-save drafts" defaultOn={false} />
            <Toggle label="Dark mode" defaultOn={true} />
            <Toggle label="Weekly digest" defaultOn={false} />
          </div>
        </Section>

        {/* Cards */}
        <Section
          title="Card Variants"
          description="Base card, accent border card, and gradient stat card"
          code={`<Card>Default</Card>\n<Card style={{ borderColor: 'var(--color-accent)' }}>Accent</Card>`}
        >
          <CardVariants />
        </Section>

        {/* Toasts */}
        <Section
          title="Notifications / Toasts"
          description="4 semantic toast types: success, warning, error, info"
          code={`const toasts = [\n  { type: 'success', msg: 'Saved' },\n  { type: 'error',   msg: 'Failed' },\n];`}
        >
          <ToastDemo />
        </Section>

        {/* Avatars */}
        <Section
          title="Avatars & Groups"
          description="Individual and stacked avatar groups for teams and collaborators"
          code={`<div className="avatar-group">\n  {team.map(m => <Avatar key={m.id} {...m} />)}\n</div>`}
        >
          <AvatarGroup />
        </Section>

      </div>
    </div>
  );
}
