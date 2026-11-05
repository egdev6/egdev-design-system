// This source is written into the isolated consumer, never compiled against workspace imports.
export const page = `import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChipGroup, Field, Input, ListItem, ListItemBody, ListItemContent, Notice, Surface, Tabs, WebSection, WebTemplate } from '@egdev/ui';
import './mode.css';

export function App() {
  return <WebTemplate
    topBar={<header><strong>EGDEV Foundation</strong></header>}
    content={<>
      <section aria-labelledby="overview-title"><WebSection
        header={<h1 id="overview-title">Design system pilot</h1>}
        body={<Surface data-pilot-surface="true">
          <Tabs label="Pilot views" items={[
            { value: 'overview', label: 'Overview', content: 'Installed from local packages.' },
            { value: 'details', label: 'Details', content: 'The consumer uses public exports.' }
          ]} />
          <ChipGroup type="multiple" label="Topics" options={[
            { value: 'design', label: 'Design' }, { value: 'code', label: 'Code' }
          ]} defaultValue={['design']} />
          <Field label="Project name" hint="Choose a name."><Input defaultValue="Pilot" /></Field>
        </Surface>} /></section>
      <section aria-labelledby="status-title"><WebSection
        header={<h2 id="status-title">Status</h2>}
        body={<><Notice summary="Packages ready.">Installed from local tarballs.</Notice>
          <ListItem><ListItemBody><ListItemContent>Review the consumer page.</ListItemContent></ListItemBody></ListItem></>} /></section>
    </>}
    footer={<footer>EGDEV Foundation pilot</footer>} />;
}

if (typeof document !== 'undefined') createRoot(document.getElementById('root')!).render(<App />);
`;

export const css = `html { background: var(--color-bg-canvas); color: var(--color-fg-default); font-family: var(--font-sans); }
body { margin: 0; }
header, footer, main { padding: var(--space-6); }
main { display: grid; gap: var(--space-6); }
section, .eg-web-section, [data-pilot-surface] { min-width: 0; }
`;
