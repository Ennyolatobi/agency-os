import { useState } from 'react';

const PAGESPEED_API = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

const API_KEY = process.env.REACT_APP_PAGESPEED_KEY || '';

const buildUrl = (pageUrl, strategy) => {
  const base = `${PAGESPEED_API}?url=${encodeURIComponent(pageUrl)}&strategy=${strategy}`;
  const cats  = '&category=performance&category=accessibility&category=best-practices&category=seo';
  const key   = API_KEY ? `&key=${API_KEY}` : '';
  return base + cats + key;
};

const parseScore = (data, cat) =>
  Math.round((data?.lighthouseResult?.categories?.[cat]?.score ?? 0) * 100);

const parseMetric = (data, key) =>
  data?.lighthouseResult?.audits?.[key]?.numericValue ?? null;

const safeMs    = (val, dp) => val !== null ? (val / 1000).toFixed(dp) : null;
const safeFixed = (val, dp) => val !== null ? Number(val).toFixed(dp)  : null;
const safeRound = (val)     => val !== null ? Math.round(val)          : null;

const extractScores = (data) => ({
  performance:   parseScore(data, 'performance'),
  accessibility: parseScore(data, 'accessibility'),
  bestPractices: parseScore(data, 'best-practices'),
  seo:           parseScore(data, 'seo'),
  lcp:  safeMs(parseMetric(data, 'largest-contentful-paint'), 1),
  fcp:  safeMs(parseMetric(data, 'first-contentful-paint'),   1),
  cls:  safeFixed(parseMetric(data, 'cumulative-layout-shift'), 3),
  ttfb: safeMs(parseMetric(data, 'server-response-time'),     2),
  tbt:  safeRound(parseMetric(data, 'total-blocking-time')),
});

const getFriendlyError = (status, body) => {
  if (status === 400) return 'Invalid URL. Make sure the site is publicly accessible and starts with https://';
  if (status === 403) return 'API key is invalid or the PageSpeed Insights API is not enabled in your Google Cloud project.';
  if (status === 429) return 'Rate limited — wait 30 seconds and try again, or add a free API key to remove this limit.';
  if (status === 500) return 'Google could not reach that URL. The site may be offline or blocking crawlers.';
  return body?.error?.message || `Unexpected error (status ${status})`;
};

export const usePageSpeedAudit = () => {
  const [loading,     setLoading]     = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error,       setError]       = useState(null);
  const [result,      setResult]      = useState(null);

  const runAudit = async (url) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // ── 1. Mobile ──────────────────────────────────────────────
      setLoadingStep('Auditing mobile…');
      const mobileRes  = await fetch(buildUrl(url, 'mobile'));
      const mobileText = await mobileRes.text();

      let mobileBody;
      try {
        mobileBody = JSON.parse(mobileText);
      } catch {
        console.error('Mobile raw response:', mobileText);
        throw new Error('Google returned an unexpected response. Check the browser console for details.');
      }

      if (!mobileRes.ok) {
        throw new Error(getFriendlyError(mobileRes.status, mobileBody));
      }

      // Small delay to avoid rate limiting on keyless requests
      await new Promise((r) => setTimeout(r, 1000));

      // ── 2. Desktop ─────────────────────────────────────────────
      setLoadingStep('Auditing desktop…');
      const desktopRes  = await fetch(buildUrl(url, 'desktop'));
      const desktopText = await desktopRes.text();

      let desktopBody;
      try {
        desktopBody = JSON.parse(desktopText);
      } catch {
        console.error('Desktop raw response:', desktopText);
        throw new Error('Google returned an unexpected response for desktop. Check the browser console.');
      }

      if (!desktopRes.ok) {
        throw new Error(getFriendlyError(desktopRes.status, desktopBody));
      }

      // ── 3. Parse opportunities ─────────────────────────────────
      const audits = mobileBody?.lighthouseResult?.audits ?? {};
      const opportunities = Object.values(audits)
        .filter((a) => a.details?.type === 'opportunity' && a.score !== null && a.score < 1)
        .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
        .slice(0, 6)
        .map((a) => ({
          id:           a.id,
          title:        a.title,
          score:        a.score,
          displayValue: a.displayValue,
        }));

      setResult({
        url,
        mobile:       extractScores(mobileBody),
        desktop:      extractScores(desktopBody),
        opportunities,
        auditedAt:    new Date().toISOString(),
      });

    } catch (err) {
      const msg = err.message?.includes('Failed to fetch')
        ? 'Network error — check your internet connection and try again.'
        : err.message || 'Audit failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return { runAudit, loading, loadingStep, error, result, reset: () => setResult(null) };
};