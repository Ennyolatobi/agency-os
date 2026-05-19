import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AppLayout           from './components/layout/AppLayout';
import Overview            from './pages/Overview';
import Projects            from './pages/Projects';
import Clients             from './pages/Clients';
import Audit               from './pages/Audit';
import ComponentsShowcase  from './pages/ComponentsShowcase';
import Reports             from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index                   element={<Overview />}           />
          <Route path="projects"         element={<Projects />}           />
          <Route path="clients"          element={<Clients />}            />
          <Route path="audit"            element={<Audit />}              />
          <Route path="components"       element={<ComponentsShowcase />} />
          <Route path="reports"          element={<Reports />}            />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
