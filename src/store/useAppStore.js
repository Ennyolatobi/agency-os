import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_PROJECTS, MOCK_CLIENTS, MOCK_AUDIT_HISTORY } from '../data/mockData';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // ── PROJECTS ──────────────────────────────────────────────
      projects: MOCK_PROJECTS,

      addProject: (project) =>
        set((s) => ({
          projects: [
            ...s.projects,
            { ...project, id: Date.now().toString(), createdAt: new Date().toISOString() },
          ],
        })),

      updateProject: (id, updates) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      deleteProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      // ── CLIENTS ───────────────────────────────────────────────
      clients: MOCK_CLIENTS,

      addClient: (client) =>
        set((s) => ({
          clients: [
            ...s.clients,
            { ...client, id: Date.now().toString(), joinedAt: new Date().toISOString() },
          ],
        })),

      // ── AUDIT HISTORY ─────────────────────────────────────────
      auditHistory: MOCK_AUDIT_HISTORY,

      addAuditResult: (result) =>
        set((s) => ({
          auditHistory: [
            { ...result, id: Date.now().toString(), auditedAt: new Date().toISOString() },
            ...s.auditHistory,
          ],
        })),

      clearAuditHistory: () => set({ auditHistory: [] }),

      // ── UI STATE ──────────────────────────────────────────────
      sidebarOpen: false,
      setSidebarOpen: (val) => set({ sidebarOpen: val }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    {
      name: 'agency-os-store',
      partialize: (s) => ({
        projects: s.projects,
        clients: s.clients,
        auditHistory: s.auditHistory,
      }),
    }
  )
);
