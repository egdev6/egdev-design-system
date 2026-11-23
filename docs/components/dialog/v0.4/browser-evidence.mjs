import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Serialize a value as a JavaScript literal that is safe to embed in generated code (CodeQL js/bad-code-sanitization).
const unsafeCharacters = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029'
};
function jsLiteral(value) {
  return JSON.stringify(value).replace(/[<>/\u2028\u2029]/g, (character) => unsafeCharacters[character]);
}

// This is a local evidence tool, not a component, a consumer adapter, or a dev server.
// All generated assets and the browser profile belong to this invocation's temp directory.
const root = resolve(fileURLToPath(new URL('../../../..', import.meta.url)));
const phase = process.argv[2];
assert.ok(phase === 'baseline' || phase === 'candidate', 'Expected baseline or candidate');
const require = createRequire(join(root, 'package.json'));
const React = require('react');
const { renderToString } = require('react-dom/server');
// This version is already installed transitively; no dependency or lockfile is changed.
const esbuild = require(join(root, 'node_modules/.pnpm/esbuild@0.25.12/node_modules/esbuild'));
const { build: viteBuild } = await import('vite');
const { default: tailwindcss } = await import('@tailwindcss/vite');
const scratch = await mkdtemp(join(tmpdir(), 'egdev-dialog-543-'));
const tokenCss = await readFile(join(root, 'packages/tokens/dist/tokens.css'), 'utf8');
let browser;
let socket;

function fixtureSource(entry) {
  return `
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { hydrateRoot } from 'react-dom/client';
import { Dialog, DialogTrigger, DialogContent, Icon, IconButton, Button,
  AlertDialog, AlertDialogContent, AlertDialogCancel, AlertDialogAction, CommandPalette } from ${jsLiteral(entry)};
const initial = { kind: 'dialog', variant: 'sheet', width: 440, height: 600,
  direction: 'ltr', layout: 'inline', title: 'Account settings', description: 'Adjust preferences.',
  status: 'Saved', padding: 'default', scope: 'container', open: true, reject: true };
export function App() {
  const [scene, setScene] = useState(initial);
  const [host, setHost] = useState(null);
  const [showTitle, setShowTitle] = useState(false);
  useEffect(() => {
    window.__events = [];
    window.__pointerEvents = [];
    window.__keyEvents = [];
    const captureKey = (event) => window.__keyEvents.push({type:event.type, key:event.key, target:event.target?.textContent?.trim()});
    for (const type of ['keydown', 'keypress', 'keyup']) document.addEventListener(type, captureKey, true);
    const capture = (event) => {
      const button = event.target instanceof Element ? event.target.closest('button') : null;
      window.__pointerEvents.push({type:event.type, pointerType:event.pointerType, target:button?.textContent.trim() || event.target?.tagName});
    };
    for (const type of ['pointerdown', 'pointerup', 'click']) document.addEventListener(type, capture, true);
    window.__prepareScene = async (next) => {
      flushSync(() => { setShowTitle(false); setScene({ ...initial, ...next, open: false }); });
      await new Promise((resolve) => setTimeout(resolve, 50));
      window.__events = [];
    };
    window.__setScene = async (next) => {
      await window.__prepareScene(next);
      flushSync(() => setScene({ ...initial, ...next, open: true }));
    };
    window.__resizeHost = (height) => flushSync(() => setScene((previous) => ({...previous, height})));
    window.__fixtureReady = true;
    return () => {
      for (const type of ['pointerdown', 'pointerup', 'click']) document.removeEventListener(type, capture, true);
      for (const type of ['keydown', 'keypress', 'keyup']) document.removeEventListener(type, captureKey, true);
    };
  }, []);
  const extras = {};
  if (scene.size) extras.size = scene.size;
  if (scene.clamp) extras.titleOverflow = 'clamp';
  if (scene.headerActions) extras.actionsPlacement = 'header';
  const actions = <>
    <IconButton label='Edit action' size={scene.actionSize || 'lg'} icon={<Icon name='settings'/>}
      onClick={() => window.__events.push('edit')}/>
    {scene.moreActions && <IconButton label='Copy action' size={scene.nextActionSize || scene.actionSize || 'lg'} icon={<Icon name='copy'/>}
      onClick={() => window.__events.push('copy')}/>}
    <Button onClick={() => window.__events.push('apply')}>Apply</Button>
  </>;
  const body = <>
    {scene.titleRoute && <Button onClick={() => setShowTitle((previous) => !previous)}>Show full title</Button>}
    {(!scene.titleRoute || showTitle) && <p data-full-title='' className='wrap-anywhere'>{scene.title}</p>}
    <input aria-label='Body field'/>
    {Array.from({length: 25}, (_, index) => <p key={index}>Body detail {index + 1}</p>)}
    <button type='button' onClick={() => window.__events.push('body')}>Body action</button>
  </>;
  return <main>
    <div aria-label='Outside content'><button type='button' onClick={() => window.__events.push('outside')}>Outside action</button></div>
    <div id='fixture-host' ref={setHost} dir={scene.direction}
      style={{ position: 'relative', boxSizing: 'border-box', width: scene.width + 'px',
        height: scene.height + 'px', padding: '8px', border: '2px solid transparent' }}/>
    {host && scene.kind === 'dialog' && <Dialog open={scene.open}
      onOpenChange={(value) => { window.__events.push('open:' + value); if (value || !scene.reject) setScene(s => ({...s, open: value})); }}>
      <DialogTrigger>Open dialog</DialogTrigger>
      <DialogContent title={scene.title} description={scene.description} statusText={scene.status}
        container={host} overlayScope={scene.scope} variant={scene.variant} headerLayout={scene.layout}
        bodyPadding={scene.padding} actions={actions} {...extras}>{body}</DialogContent>
    </Dialog>}
    {scene.open && scene.kind === 'alert' && <AlertDialog open={true}>
      <AlertDialogContent title='Remove item?' description='This cannot be undone.'
        actions={<><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Remove</AlertDialogAction></>}/>
    </AlertDialog>}
    {scene.open && scene.kind === 'palette' && <CommandPalette open={true} items={[]}/>}
    {scene.kind === 'negative' && <div id='negative-targets' style={scene.clipped
      ? {display:'flex', width:'25.6px', height:'25.6px', overflow:'hidden'}
      : {display:'flex', gap:0}}>
      <IconButton label='Negative first' size='sm' icon={<Icon name='settings'/>}/>
      {!scene.clipped && <IconButton label='Negative second' size='sm' icon={<Icon name='copy'/>}/>}
    </div>}
  </main>;
}
if (typeof document !== 'undefined') hydrateRoot(document.getElementById('root'), <App/>);
`;
}

async function compile(entry, name, css) {
  const source = fixtureSource(entry);
  const common = {
    stdin: { contents: source, resolveDir: root, sourcefile: `${name}.tsx`, loader: 'tsx' },
    bundle: true,
    jsx: 'automatic',
    alias: { '@': join(root, 'packages/ui/src') },
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'silent',
    write: false
  };
  const [server, client] = await Promise.all([
    esbuild.build({ ...common, platform: 'node', format: 'cjs', external: ['react', 'react-dom', 'react-dom/*'] }),
    esbuild.build({ ...common, platform: 'browser', format: 'iife' })
  ]);
  const serverFile = join(scratch, `${name}-server.cjs`);
  await writeFile(serverFile, server.outputFiles[0].contents);
  const { App } = require(serverFile);
  const markup = renderToString(React.createElement(App));
  const clientJs = client.outputFiles[0].text.replaceAll('</script', '<\\/script');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${tokenCss}</style><style>${css}</style></head><body><div id="root">${markup}</div><script>${clientJs}</script></body></html>`;
  const file = join(scratch, `${name}.html`);
  await writeFile(file, html);
  return pathToFileURL(file).href;
}

async function candidateCss() {
  const result = await viteBuild({
    configFile: false,
    envDir: false,
    root: join(root, 'packages/ui'),
    cacheDir: join(scratch, 'vite-cache'),
    plugins: [tailwindcss({ optimize: false })],
    logLevel: 'error',
    build: {
      write: false,
      minify: false,
      cssMinify: false,
      rolldownOptions: { input: join(root, 'packages/ui/src/styles/compiled.css') }
    }
  });
  const outputs = (Array.isArray(result) ? result : [result]).flatMap((item) => item.output ?? []);
  const asset = outputs.find((item) => item.type === 'asset' && item.fileName.endsWith('.css'));
  assert.ok(asset && asset.type === 'asset', 'Candidate CSS was not emitted');
  return String(asset.source);
}

const delay = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
async function waitFor(fn, description) {
  for (let attempt = 0; attempt < 200; attempt++) {
    const value = await fn();
    if (value) {
      return value;
    }
    await delay(50);
  }
  throw new Error(`Timed out waiting for ${description}`);
}

async function connect() {
  const profile = join(scratch, 'chrome-profile');
  browser = spawn(
    '/usr/bin/google-chrome',
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-background-networking',
      '--no-proxy-server',
      '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost',
      '--remote-debugging-address=127.0.0.1',
      '--remote-debugging-port=0',
      `--user-data-dir=${profile}`,
      'about:blank'
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] }
  );
  let errors = '';
  browser.stderr.on('data', (chunk) => {
    errors += chunk.toString();
  });
  const port = await waitFor(async () => {
    if (browser.exitCode !== null) {
      throw new Error(`Chrome exited: ${errors}`);
    }
    try {
      return (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0];
    } catch {
      return null;
    }
  }, 'Chrome debugging port');
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target = targets.find((item) => item.type === 'page');
  assert.ok(target?.webSocketDebuggerUrl, 'Chrome has no page target');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolveOpen, reject) => {
    socket.addEventListener('open', resolveOpen, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let id = 0;
  const pending = new Map();
  const exceptions = [];
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') {
      exceptions.push(message.params.exceptionDetails.text);
    }
    if (!message.id) {
      return;
    }
    const request = pending.get(message.id);
    if (!request) {
      return;
    }
    pending.delete(message.id);
    if (message.error) {
      request.reject(new Error(JSON.stringify(message.error)));
    } else {
      request.resolve(message.result);
    }
  });
  const call = (method, params = {}) =>
    new Promise((resolveCall, reject) => {
      const next = ++id;
      pending.set(next, { resolve: resolveCall, reject });
      socket.send(JSON.stringify({ id: next, method, params }));
    });
  const evaluate = async (expression) => {
    const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) {
      throw new Error(JSON.stringify(result.exceptionDetails));
    }
    return result.result.value;
  };
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Network.enable');
  await call('Network.setBlockedURLs', { urls: ['http://*', 'https://*'] });
  await call('Emulation.setDeviceMetricsOverride', { width: 1000, height: 800, deviceScaleFactor: 1, mobile: false });
  return { call, evaluate, exceptions };
}

const measureExpression = `(() => {
  const panel = document.querySelector('[role="dialog"], [role="alertdialog"]');
  if (!panel) return null;
  const overlay = panel.parentElement;
  const host = document.getElementById('fixture-host');
  const title = panel.querySelector('h2');
  const head = panel.querySelector('header');
  const body = panel.querySelector('.eg-dialog__body');
  const foot = panel.querySelector('.eg-dialog__foot');
  const close = [...panel.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Close');
  const status = panel.querySelector('.eg-dialog__status');
  const description = panel.querySelector('.eg-dialog__description');
  const baseline = (element, first = false) => {
    if (!element) return null;
    const marker = document.createElement('span');
    marker.style.cssText = 'display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline';
    if (first) element.insertBefore(marker, element.firstChild); else element.appendChild(marker);
    const result = marker.getBoundingClientRect().top;
    marker.remove();
    return result;
  };
  const rect = (element) => {
    if (!element) return null;
    const r = element.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
  };
  const computed = (element) => {
    if (!element) return null;
    const s = getComputedStyle(element);
    return { display: s.display, position: s.position, overflow: s.overflow, overflowY: s.overflowY,
      minHeight: s.minHeight, maxHeight: s.maxHeight, maxWidth: s.maxWidth, paddingTop: s.paddingTop,
      paddingBottom: s.paddingBottom, borderTopWidth: s.borderTopWidth, borderBottomWidth: s.borderBottomWidth,
      lineHeight: s.lineHeight, lineClamp: s.webkitLineClamp, backgroundColor: s.backgroundColor,
      boxShadow: s.boxShadow, backdropFilter: s.backdropFilter, gap: s.gap, fontFamily: s.fontFamily, boxSizing: s.boxSizing };
  };
  const range = document.createRange();
  const lines = title ? (range.selectNodeContents(title), [...range.getClientRects()].map((r) => ({x:r.x,y:r.y,width:r.width,height:r.height}))) : [];
  const titleBox = title?.getBoundingClientRect();
  const visibleFragments = titleBox ? lines.filter((line) => line.y < titleBox.bottom && line.y + line.height > titleBox.top) : [];
  // A line-clamp ellipsis can add a second range rectangle on the same visual line.
  const visibleLines = visibleFragments.filter((line, index) => !visibleFragments.slice(0, index).some((previous) => Math.abs(previous.y - line.y) < 0.5));
  const firstBaseline = baseline(title, true);
  const lastBaseline = firstBaseline === null ? null : firstBaseline + Math.max(0, visibleLines.length - 1) * parseFloat(getComputedStyle(title).lineHeight);
  const rootStyle = getComputedStyle(document.documentElement);
  return { host: rect(host), hostStyle: computed(host), overlay: rect(overlay), overlayStyle: computed(overlay),
    panel: rect(panel), panelStyle: computed(panel), header: rect(head), title: rect(title), titleStyle: computed(title),
    titleText: title?.textContent, lines, visibleFragments, visibleLines, titleLastBaseline: lastBaseline,
    statusBaseline: baseline(status), descriptionBaseline: baseline(description), body: rect(body), bodyStyle: computed(body),
    bodyScroll: body && {top:body.scrollTop,height:body.scrollHeight,client:body.clientHeight},
    overlayScroll: {top:overlay.scrollTop,height:overlay.scrollHeight,client:overlay.clientHeight,width:overlay.clientWidth,scrollWidth:overlay.scrollWidth},
    actions: rect(foot), actionsTag: foot?.tagName, actionsInHeader: !!(head && foot && head.contains(foot)),
    close: rect(close), closeAfter: close && {width:getComputedStyle(close,'::after').width,height:getComputedStyle(close,'::after').height},
    focus: document.activeElement?.textContent?.trim() || document.activeElement?.getAttribute('aria-label'),
    tokens: Object.fromEntries(['--space-1','--space-12','--space-14','--shadow-focus'].map((key) => [key, rootStyle.getPropertyValue(key).trim()])),
    fonts: {status:document.fonts.status, display:document.fonts.check('16px "Barlow Condensed"'), sans:document.fonts.check('16px Barlow')},
    viewport: {width:innerWidth,height:innerHeight,dpr:devicePixelRatio}, direction:getComputedStyle(panel).direction,
    events: window.__events.slice() };
})()`;

async function observe(cdp, url, scenarios) {
  await cdp.call('Page.navigate', { url });
  await waitFor(() => cdp.evaluate('window.__fixtureReady === true'), 'hydrated fixture');
  const results = [];
  for (const [name, settings] of scenarios) {
    await cdp.evaluate(`window.__setScene(${jsLiteral(settings)})`);
    await waitFor(() => cdp.evaluate(`!!document.querySelector('[role="dialog"], [role="alertdialog"]')`), name);
    await delay(150);
    await cdp.evaluate(
      `(() => { const body = document.querySelector('.eg-dialog__body'); if (body) body.scrollTop = 0; const panel = document.querySelector('[role="dialog"], [role="alertdialog"]'); if (panel) panel.parentElement.scrollTop = 0; })()`
    );
    const before = await cdp.evaluate(measureExpression);
    assert.ok(before?.panel && before.overlay, `${name} has no modal geometry`);
    if (before.body) {
      await cdp.evaluate(`document.querySelector('.eg-dialog__body').scrollTop = 300`);
      await delay(50);
    }
    const after = await cdp.evaluate(measureExpression);
    results.push({ name, settings, before, after });
  }
  assert.deepEqual(cdp.exceptions, [], 'Browser runtime exceptions');
  return results;
}

async function hitTests(cdp) {
  const points = [
    [0, 0],
    [-22, 0],
    [22, 0],
    [0, -22],
    [0, 22],
    [-22, -22],
    [-22, 22],
    [22, -22],
    [22, 22]
  ];
  const results = [];
  for (const direction of ['ltr', 'rtl']) {
    for (const scenario of [
      { actionSize: 'sm' },
      { actionSize: 'md' },
      { actionSize: 'lg' },
      { actionSize: 'sm', nextActionSize: 'sm', moreActions: true },
      { actionSize: 'md', nextActionSize: 'md', moreActions: true },
      { actionSize: 'sm', nextActionSize: 'lg', moreActions: true },
      { actionSize: 'md', nextActionSize: 'lg', moreActions: true },
      { actionSize: 'lg', nextActionSize: 'lg', moreActions: true },
      { actionSize: 'sm', moreActions: true, width: 200 }
    ]) {
      const { actionSize } = scenario;
      await cdp.evaluate(
        `window.__setScene(${jsLiteral({ size: 'full', clamp: true, headerActions: true, title: 'Short', direction, ...scenario })})`
      );
      await waitFor(() => cdp.evaluate(`!!document.querySelector('[role="dialog"]')`), 'hit-test dialog');
      await delay(100);
      const boxes = await cdp.evaluate(`(() => {
        const buttons = [...document.querySelectorAll('[role="dialog"] button')];
        const names = ${jsLiteral(scenario.moreActions ? ['Edit action', 'Copy action', 'Close'] : ['Edit action', 'Close'])};
        return Object.fromEntries(names.map((name) => {
          const node = buttons.find((item) => item.textContent.trim() === name);
          const r = node.getBoundingClientRect();
          return [name, {x:r.x,y:r.y,width:r.width,height:r.height,afterWidth:getComputedStyle(node,'::after').width}];
        }));
      })()`);
      if (scenario.moreActions && scenario.width === 200) {
        assert.ok(
          Math.abs(boxes['Edit action'].y - boxes['Copy action'].y) > 1 ||
            (await cdp.evaluate(
              `(() => { const foot = document.querySelector('header .eg-dialog__foot'); const buttons = [...foot.querySelectorAll('button')]; return buttons.some((button) => button.getBoundingClientRect().top !== buttons[0].getBoundingClientRect().top); })()`
            )),
          `${direction}: the narrow fixture must actually wrap`
        );
      }
      for (const input of ['mouse', 'touch']) {
        await cdp.call('Emulation.setTouchEmulationEnabled', { enabled: input === 'touch', maxTouchPoints: 1 });
        for (const [name, box] of Object.entries(boxes)) {
          for (const [dx, dy] of points) {
            const x = box.x + box.width / 2 + dx;
            const y = box.y + box.height / 2 + dy;
            await cdp.evaluate('window.__pointerEvents = []');
            if (input === 'mouse') {
              await cdp.call('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
              await cdp.call('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
              await cdp.call('Input.dispatchMouseEvent', {
                type: 'mouseReleased',
                x,
                y,
                button: 'left',
                clickCount: 1
              });
            } else {
              await cdp.call('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
              await cdp.call('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
            }
            await delay(15);
            const events = await cdp.evaluate('window.__pointerEvents');
            for (const type of ['pointerdown', 'pointerup', 'click']) {
              const event = events.find((item) => item.type === type);
              assert.equal(
                event?.target,
                name,
                `${direction}/${actionSize}/${input}/${name}/${dx},${dy} ${type}: ${jsLiteral(events)}`
              );
            }
            results.push({ direction, actionSize, wrapped: Boolean(scenario.moreActions), input, name, dx, dy });
          }
        }
      }
    }
  }
  await cdp.call('Emulation.setTouchEmulationEnabled', { enabled: false });
  return results;
}

async function interactionChecks(cdp) {
  const title = 'A full accessible title retained in the body and the Radix dialog';
  await cdp.evaluate(`window.__setScene(${jsLiteral({ size: 'full', clamp: true, headerActions: true, title })})`);
  await waitFor(() => cdp.evaluate(`!!document.querySelector('[role="dialog"]')`), 'accessibility fixture');
  await delay(100);
  await cdp.call('Accessibility.enable');
  const tree = await cdp.call('Accessibility.getFullAXTree');
  const dialogs = tree.nodes.filter((node) => node.role?.value === 'dialog');
  // The existing uppercase title styling is reflected in Chrome's accessibility tree.
  const modal = dialogs.find((node) => node.name?.value === title.toUpperCase());
  assert.ok(modal, `Accessibility tree must expose the full title as the dialog name: ${jsLiteral(dialogs)}`);
  assert.equal(await cdp.evaluate(`document.querySelector('[role="dialog"] h2').textContent`), title);
  assert.equal(modal.description?.value, 'Adjust preferences.');
  assert.equal(await cdp.evaluate(`document.activeElement.textContent.trim()`), 'Edit action');
  const order = [];
  for (let i = 0; i < 4; i++) {
    await cdp.call('Input.dispatchKeyEvent', {
      type: 'keyDown',
      key: 'Tab',
      code: 'Tab',
      windowsVirtualKeyCode: 9,
      nativeVirtualKeyCode: 9
    });
    await cdp.call('Input.dispatchKeyEvent', {
      type: 'keyUp',
      key: 'Tab',
      code: 'Tab',
      windowsVirtualKeyCode: 9,
      nativeVirtualKeyCode: 9
    });
    order.push(
      await cdp.evaluate(
        `document.activeElement.getAttribute('aria-label') || document.activeElement.textContent.trim()`
      )
    );
  }
  assert.deepEqual(order, ['Apply', 'Body field', 'Body action', 'Close']);
  await cdp.call('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27,
    nativeVirtualKeyCode: 27
  });
  await cdp.call('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27,
    nativeVirtualKeyCode: 27
  });
  assert.ok(
    await cdp.evaluate(`window.__events.includes('open:false') && !!document.querySelector('[role="dialog"]')`),
    'Controlled rejection must retain the dialog'
  );
  await cdp.evaluate(
    `window.__setScene(${jsLiteral({ size: 'full', clamp: true, headerActions: true, height: 130, title })})`
  );
  await waitFor(() => cdp.evaluate(`!!document.querySelector('[role="dialog"]')`), 'short host');
  const scroll = await cdp.evaluate(
    `(() => { const overlay = document.querySelector('[role="dialog"]').parentElement; const r = overlay.getBoundingClientRect(); return {x:r.x+30,y:r.y+30,before:overlay.scrollTop}; })()`
  );
  await cdp.call('Input.dispatchMouseEvent', { type: 'mouseWheel', x: scroll.x, y: scroll.y, deltaX: 0, deltaY: 120 });
  await delay(150);
  const afterWheel = await cdp.evaluate(`document.querySelector('[role="dialog"]').parentElement.scrollTop`);
  assert.ok(afterWheel > scroll.before, 'A real wheel must scroll the insufficient-host overlay');
  return {
    accessibleName: modal.name.value,
    sourceTitle: title,
    description: modal.description.value,
    tabOrder: order,
    controlledRejection: true,
    shortOverlayWheel: afterWheel
  };
}

async function key(cdp, name, shift = false, includeText = true) {
  const code = name === 'Tab' ? 9 : name === 'Escape' ? 27 : 13;
  const params = {
    key: name,
    code: name,
    windowsVirtualKeyCode: code,
    nativeVirtualKeyCode: code,
    modifiers: shift ? 8 : 0
  };
  // A CDP keyDown is not a native Enter press unless its text is supplied; Chromium
  // otherwise omits keypress and does not activate a native button.
  const text = name === 'Enter' && includeText ? { text: '\r', unmodifiedText: '\r' } : {};
  await cdp.call('Input.dispatchKeyEvent', { type: 'keyDown', ...params, ...text });
  await cdp.call('Input.dispatchKeyEvent', { type: 'keyUp', ...params });
}

async function mouseClick(cdp, x, y) {
  await cdp.call('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
  await cdp.call('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await cdp.call('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
}

async function focusName(cdp) {
  return cdp.evaluate(`document.activeElement.getAttribute('aria-label') || document.activeElement.textContent.trim()`);
}

async function openFromTrigger(cdp, settings) {
  await cdp.evaluate(`window.__prepareScene(${jsLiteral(settings)})`);
  const point = await cdp.evaluate(`(() => {
    const trigger = [...document.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Open dialog');
    trigger.scrollIntoView({block:'nearest'});
    const r = trigger.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};
  })()`);
  await mouseClick(cdp, point.x, point.y);
  await waitFor(() => cdp.evaluate(`!!document.querySelector('[role="dialog"]')`), 'trigger opens dialog');
  await delay(80);
}

async function titleRouteDiagnostic(cdp) {
  const attempts = [];
  for (const includeText of [false, true]) {
    await openFromTrigger(cdp, { clamp: true, headerActions: true, titleRoute: true, reject: false });
    for (let i = 0; i < 2; i++) {
      await key(cdp, 'Tab');
    }
    assert.equal(await focusName(cdp), 'Show full title');
    await cdp.evaluate(`window.__keyEvents=[]; window.__pointerEvents=[]`);
    await key(cdp, 'Enter', false, includeText);
    await delay(200);
    const observed = await cdp.evaluate(
      `({title:document.querySelector('[data-full-title]')?.textContent ?? null, keys:window.__keyEvents, clicks:window.__pointerEvents.filter(event => event.type === 'click')})`
    );
    attempts.push({ includeText, ...observed });
  }
  assert.equal(attempts[1].title, 'Account settings', `Native Enter must reveal the title: ${jsLiteral(attempts)}`);
  assert.ok(
    attempts[1].clicks.some((event) => event.target === 'Show full title'),
    `Native Enter must activate the route: ${jsLiteral(attempts)}`
  );
  return {
    cause: attempts[0].title ? 'synchronous observation before React commit' : 'CDP Enter omitted text',
    attempts
  };
}

async function keyboardMatrix(cdp) {
  const cases = [];
  for (const zoom of [100, 200]) {
    await cdp.call('Emulation.setDeviceMetricsOverride', {
      width: (1000 * 100) / zoom,
      height: (800 * 100) / zoom,
      deviceScaleFactor: zoom / 100,
      mobile: false
    });
    for (const scope of ['container', 'viewport']) {
      for (const placement of ['header', 'footer']) {
        const settings = {
          width: 440,
          height: zoom === 200 ? 260 : 600,
          scope,
          headerActions: placement === 'header',
          clamp: true,
          titleRoute: true,
          reject: false
        };
        const order =
          placement === 'header'
            ? ['Edit action', 'Apply', 'Show full title', 'Body field', 'Body action', 'Close']
            : ['Show full title', 'Body field', 'Body action', 'Edit action', 'Apply', 'Close'];
        await openFromTrigger(cdp, settings);
        assert.equal(await focusName(cdp), order[0], `${zoom}/${scope}/${placement}: initial focus`);
        const forward = [];
        for (let i = 0; i < order.length; i++) {
          await key(cdp, 'Tab');
          forward.push(await focusName(cdp));
        }
        assert.deepEqual(forward, [...order.slice(1), order[0]], `${zoom}/${scope}/${placement}: Tab trap`);
        const reverse = [];
        for (let i = 0; i < order.length; i++) {
          await key(cdp, 'Tab', true);
          reverse.push(await focusName(cdp));
        }
        assert.deepEqual(
          reverse,
          [...order.slice(1).reverse(), order[0]],
          `${zoom}/${scope}/${placement}: Shift+Tab trap`
        );
        const outside = await cdp.evaluate(
          `(() => { const button = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'Outside action'); const r = button.getBoundingClientRect(); return {pointerEvents:getComputedStyle(button).pointerEvents, hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.textContent.trim()}; })()`
        );
        assert.notEqual(
          outside.hit,
          'Outside action',
          `${zoom}/${scope}/${placement}: background must not receive pointer`
        );
        while ((await focusName(cdp)) !== 'Show full title') {
          await key(cdp, 'Tab');
        }
        await key(cdp, 'Enter');
        await waitFor(
          () => cdp.evaluate(`document.querySelector('[data-full-title]')?.textContent === 'Account settings'`),
          'keyboard title reveal'
        );
        await key(cdp, 'Escape');
        await waitFor(() => cdp.evaluate(`!document.querySelector('[role="dialog"]')`), 'Escape dismissal');
        await waitFor(async () => (await focusName(cdp)) === 'Open dialog', 'Escape focus restoration');
        assert.deepEqual(await cdp.evaluate('window.__events'), ['open:true', 'open:false']);
        await openFromTrigger(cdp, settings);
        for (let i = 0; i < order.length - 1; i++) {
          await key(cdp, 'Tab');
        }
        assert.equal(await focusName(cdp), 'Close');
        await key(cdp, 'Enter');
        await waitFor(() => cdp.evaluate(`!document.querySelector('[role="dialog"]')`), 'Close dismissal');
        await waitFor(async () => (await focusName(cdp)) === 'Open dialog', 'Close focus restoration');
        assert.deepEqual(await cdp.evaluate('window.__events'), ['open:true', 'open:false']);
        await openFromTrigger(cdp, settings);
        const scrim = await cdp.evaluate(
          `(() => { const panel = document.querySelector('[role="dialog"]'); const r = panel.parentElement.getBoundingClientRect(); return {x:r.left+8,y:r.top+8}; })()`
        );
        await mouseClick(cdp, scrim.x, scrim.y);
        await waitFor(() => cdp.evaluate(`!document.querySelector('[role="dialog"]')`), 'scrim dismissal');
        await waitFor(async () => (await focusName(cdp)) === 'Open dialog', 'scrim focus restoration');
        assert.deepEqual(await cdp.evaluate('window.__events'), ['open:true', 'open:false']);
        await openFromTrigger(cdp, { ...settings, reject: true });
        await key(cdp, 'Escape');
        assert.ok(
          await cdp.evaluate(`window.__events.includes('open:false') && !!document.querySelector('[role="dialog"]')`),
          'Controlled rejection'
        );
        cases.push({
          zoom,
          scope,
          placement,
          order,
          forward,
          reverse,
          dismissals: ['Escape', 'Close', 'scrim'],
          restored: true,
          outside,
          controlledRejection: true
        });
      }
    }
  }
  await cdp.call('Emulation.setDeviceMetricsOverride', {
    width: 1000,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false
  });
  return cases;
}

async function focusRings(cdp) {
  const results = [];
  for (const zoom of [100, 200]) {
    await cdp.call('Emulation.setDeviceMetricsOverride', {
      width: (1000 * 100) / zoom,
      height: (800 * 100) / zoom,
      deviceScaleFactor: zoom / 100,
      mobile: false
    });
    for (const direction of ['ltr', 'rtl']) {
      await cdp.evaluate(
        `window.__setScene(${jsLiteral({ size: 'full', clamp: true, headerActions: true, titleRoute: true, direction, width: 440, height: zoom === 200 ? 300 : 600 })})`
      );
      await delay(100);
      await key(cdp, 'Tab', true);
      for (const name of ['Edit action', 'Apply', 'Show full title', 'Body field', 'Body action', 'Close']) {
        await key(cdp, 'Tab');
        assert.equal(await focusName(cdp), name, `Focus-ring order: ${name}`);
        if (!['Edit action', 'Apply', 'Show full title', 'Close'].includes(name)) {
          continue;
        }
        await delay(250);
        const info = await cdp.evaluate(
          `(() => { const element=document.activeElement; const r=element.getBoundingClientRect(); const s=getComputedStyle(element); return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height,shadow:s.boxShadow,focusVisible:element.matches(':focus-visible')}; })()`
        );
        assert.ok(
          info.focusVisible && info.shadow.includes('255, 0, 54'),
          `${zoom}/${direction}/${name}: expected focus shadow: ${jsLiteral(info)}`
        );
        const shot = await cdp.call('Page.captureScreenshot', { format: 'png', fromSurface: true });
        const samples = await cdp.evaluate(`new Promise((resolve, reject) => {
          const image=new Image(); image.onload=() => { const canvas=document.createElement('canvas'); canvas.width=image.width; canvas.height=image.height; const context=canvas.getContext('2d'); context.drawImage(image,0,0);
          const r=${jsLiteral(info)}; const scale=${zoom / 100}; const points=[[r.x+r.width/2,r.y-3],[r.right+3,r.y+r.height/2],[r.x+r.width/2,r.bottom+3],[r.x-3,r.y+r.height/2]];
          resolve(points.map(([x,y]) => [...context.getImageData(Math.floor(x*scale),Math.floor(y*scale),1,1).data])); }; image.onerror=reject; image.src='data:image/png;base64,${shot.data}';
        })`);
        assert.ok(
          samples.every(([r, g, b]) => r > 245 && g < 10 && b > 45 && b < 65),
          `${zoom}/${direction}/${name}: clipped or covered focus ring pixels ${jsLiteral(samples)} at ${jsLiteral(info)}`
        );
        results.push({ zoom, direction, name, shadow: info.shadow, pixels: samples });
      }
    }
  }
  await cdp.call('Emulation.setDeviceMetricsOverride', {
    width: 1000,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false
  });
  return results;
}

async function gapChecks(cdp) {
  const results = [];
  for (const direction of ['ltr', 'rtl']) {
    for (const [first, second] of [
      ['sm', 'sm'],
      ['sm', 'lg'],
      ['md', 'md'],
      ['md', 'lg'],
      ['lg', 'lg']
    ]) {
      await cdp.evaluate(
        `window.__setScene(${jsLiteral({ size: 'full', clamp: true, headerActions: true, title: 'Short', direction, actionSize: first, nextActionSize: second, moreActions: true })})`
      );
      await delay(100);
      const geometry = await cdp.evaluate(
        `(() => { const panel=document.querySelector('[role="dialog"]'); const buttons=[...panel.querySelectorAll('button')]; const names=['Edit action','Copy action','Close']; const root=getComputedStyle(document.documentElement); const space=(number) => parseFloat(root.getPropertyValue('--space-'+number)); const foot=getComputedStyle(panel.querySelector('header .eg-dialog__foot')); const box=(name) => { const node=buttons.find(x => x.textContent.trim() === name); const r=node.getBoundingClientRect(); const after=getComputedStyle(node,'::after'); return {name,left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height,afterWidth:parseFloat(after.width),afterHeight:parseFloat(after.height)}; }; return {boxes:names.map(box), token:space(1),target:space(14),sizes:{sm:space(8),md:space(10),lg:space(12)},columnGap:parseFloat(foot.columnGap),rowGap:parseFloat(foot.rowGap)}; })()`
      );
      const cssRequired = (2 * geometry.target - geometry.sizes[first] - geometry.sizes[second]) / 2 + geometry.token;
      assert.ok(
        geometry.columnGap + 1e-9 >= cssRequired && geometry.rowGap + 1e-9 >= cssRequired,
        `${direction}/${first}-${second}: CSS gap is below the required token margin: ${jsLiteral({ geometry, cssRequired })}`
      );
      const pairs = [];
      for (const [a, b] of [
        [geometry.boxes[0], geometry.boxes[1]],
        [geometry.boxes[0], geometry.boxes[2]],
        [geometry.boxes[1], geometry.boxes[2]]
      ]) {
        const horizontalOverlap = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const verticalOverlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (horizontalOverlap <= 0 && verticalOverlap <= 0) {
          continue;
        }
        const axis = verticalOverlap > 0 ? 'x' : 'y';
        const ordered = [a, b].sort((left, right) => (axis === 'x' ? left.left - right.left : left.top - right.top));
        const [left, right] = ordered;
        const gap = axis === 'x' ? right.left - left.right : right.top - left.bottom;
        const outset =
          axis === 'x'
            ? (left.afterWidth - left.width + right.afterWidth - right.width) / 2
            : (left.afterHeight - left.height + right.afterHeight - right.height) / 2;
        const required = outset + geometry.token;
        // Chrome snaps layout coordinates to 1/64 CSS px; allow one LayoutUnit only.
        assert.ok(
          gap + 1 / 64 >= required,
          `${direction}/${first}-${second}/${left.name}-${right.name}: ${axis} gap ${gap} < ${required}`
        );
        pairs.push({ names: [left.name, right.name], axis, gap, outset, token: geometry.token, required });
      }
      assert.ok(
        pairs.some((pair) => pair.names.includes('Edit action') && pair.names.includes('Copy action')),
        'Header icon buttons must be adjacent'
      );
      results.push({ direction, first, second, cssGap: geometry.columnGap, cssRequired, pairs });
    }
  }
  return results;
}

async function resizeChecks(cdp) {
  const results = [];
  for (const zoom of [100, 200]) {
    await cdp.call('Emulation.setDeviceMetricsOverride', {
      width: (1000 * 100) / zoom,
      height: (800 * 100) / zoom,
      deviceScaleFactor: zoom / 100,
      mobile: false
    });
    for (const direction of ['ltr', 'rtl']) {
      await cdp.evaluate(
        `window.__setScene(${jsLiteral({ size: 'full', clamp: true, headerActions: true, title: 'A long title with enough words to occupy multiple lines in a compact sheet header', direction, height: 240 })})`
      );
      await delay(100);
      await cdp.evaluate(`window.__retainedPanel=document.querySelector('[role="dialog"]'); window.__events=[]`);
      const measurements = [];
      for (const height of [240, 220, 130, 220, 240]) {
        await cdp.evaluate(`window.__resizeHost(${height})`);
        await delay(80);
        const result = await cdp.evaluate(
          `(() => { const panel=document.querySelector('[role="dialog"]'); const overlay=panel.parentElement; const body=panel.querySelector('.eg-dialog__body'); const s=getComputedStyle(body); const r=body.getBoundingClientRect(); return {samePanel:panel===window.__retainedPanel,focus:document.activeElement.textContent.trim(),events:window.__events.slice(),height:overlay.clientHeight,scrollHeight:overlay.scrollHeight,bodyContent:r.height-parseFloat(s.paddingTop)-parseFloat(s.paddingBottom)}; })()`
        );
        assert.ok(
          result.samePanel && result.focus === 'Edit action' && result.events.length === 0,
          `${direction}/${height}: resize must preserve panel, focus and state ${jsLiteral(result)}`
        );
        assert.ok(result.bodyContent >= 44.7, `${direction}/${height}: body content minimum`);
        assert.equal(
          result.scrollHeight > result.height,
          height < 225,
          `${direction}/${height}: exceptional scroll threshold`
        );
        measurements.push({ hostHeight: height, ...result });
      }
      results.push({ zoom, direction, measurements });
    }
  }
  return results;
}

async function preferenceChecks(cdp) {
  const results = [];
  for (const preference of ['reduced-motion', 'forced-colors']) {
    const features =
      preference === 'reduced-motion'
        ? [{ name: 'prefers-reduced-motion', value: 'reduce' }]
        : [{ name: 'forced-colors', value: 'active' }];
    await cdp.call('Emulation.setEmulatedMedia', { features });
    await cdp.evaluate(
      `window.__setScene(${jsLiteral({ size: 'full', clamp: true, headerActions: true, titleRoute: true })})`
    );
    await delay(150);
    const panel = await cdp.evaluate(
      `(() => { const node=document.querySelector('[role="dialog"]'); const title=node.querySelector('h2'); const s=getComputedStyle(node); const t=getComputedStyle(title); const r=node.getBoundingClientRect(); return {motion:matchMedia('(prefers-reduced-motion: reduce)').matches,forced:matchMedia('(forced-colors: active)').matches,transition:s.transitionProperty,duration:s.transitionDuration,transform:s.transform,background:s.backgroundColor,visibility:s.visibility,width:r.width,height:r.height,title:title.textContent,titleColor:t.color,titleVisibility:t.visibility}; })()`
    );
    await key(cdp, 'Tab', true);
    const controls = [];
    for (const name of ['Edit action', 'Apply', 'Show full title', 'Body field', 'Body action', 'Close']) {
      await key(cdp, 'Tab');
      assert.equal(await focusName(cdp), name);
      if (!['Edit action', 'Apply', 'Show full title', 'Close'].includes(name)) {
        continue;
      }
      const style = await cdp.evaluate(
        `(() => { const s=getComputedStyle(document.activeElement); return {visible:document.activeElement.matches(':focus-visible'),outlineStyle:s.outlineStyle,outlineWidth:s.outlineWidth,outlineColor:s.outlineColor,shadow:s.boxShadow,transition:s.transitionProperty,duration:s.transitionDuration,transform:s.transform}; })()`
      );
      controls.push({ name, ...style });
    }
    if (preference === 'reduced-motion') {
      assert.ok(
        panel.motion && panel.transition === 'none' && panel.transform === 'none',
        `Reduced-motion panel ${jsLiteral(panel)}`
      );
      assert.ok(
        controls.every((control) => control.transition === 'none' && control.transform === 'none'),
        `Reduced-motion controls ${jsLiteral(controls)}`
      );
    } else {
      assert.ok(
        panel.forced && panel.visibility === 'visible' && panel.width > 0 && panel.height > 0,
        `Dialog surface must remain visible in forced colors: ${jsLiteral(panel)}`
      );
      assert.ok(
        panel.title === 'Account settings' &&
          panel.titleVisibility === 'visible' &&
          panel.titleColor !== panel.background,
        `Dialog title must remain visible in forced colors: ${jsLiteral(panel)}`
      );
      // Button and IconButton are shipped atoms. Their missing forced-colors focus
      // outlines are reported as a cross-component finding, not a #543 assertion.
    }
    results.push({ preference, panel, controls });
    await cdp.call('Emulation.setEmulatedMedia', { features: [] });
  }
  return results;
}

async function negativeControls(cdp) {
  const results = [];
  for (const clipped of [false, true]) {
    await cdp.evaluate(`window.__setScene(${jsLiteral({ kind: 'negative', clipped })})`);
    const box = await cdp.evaluate(
      `(() => { const r = document.querySelector('#negative-targets button').getBoundingClientRect(); return {x:r.x+r.width/2+22,y:r.y+r.height/2+( ${clipped ? '22' : '0'} )}; })()`
    );
    for (const input of ['mouse', 'touch']) {
      await cdp.call('Emulation.setTouchEmulationEnabled', { enabled: input === 'touch', maxTouchPoints: 1 });
      await cdp.evaluate('window.__pointerEvents = []');
      if (input === 'mouse') {
        await cdp.call('Input.dispatchMouseEvent', {
          type: 'mousePressed',
          x: box.x,
          y: box.y,
          button: 'left',
          clickCount: 1
        });
        await cdp.call('Input.dispatchMouseEvent', {
          type: 'mouseReleased',
          x: box.x,
          y: box.y,
          button: 'left',
          clickCount: 1
        });
      } else {
        await cdp.call('Input.dispatchTouchEvent', {
          type: 'touchStart',
          touchPoints: [{ x: box.x, y: box.y, id: 1 }]
        });
        await cdp.call('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      }
      await delay(15);
      const events = await cdp.evaluate('window.__pointerEvents');
      const target = events.find((event) => event.type === 'pointerdown')?.target;
      assert.notEqual(target, 'Negative first', `${input}: the negative control must expose an invalid target`);
      results.push({ clipped, input, target });
    }
  }
  await cdp.call('Emulation.setTouchEmulationEnabled', { enabled: false });
  return results;
}

try {
  await symlink(join(root, 'node_modules'), join(scratch, 'node_modules'), 'dir');
  const baseline = await compile(
    join(root, 'packages/ui/dist/index.js'),
    'baseline',
    await readFile(join(root, 'packages/ui/dist/styles.css'), 'utf8')
  );
  const candidate =
    phase === 'candidate'
      ? await compile(join(root, 'packages/ui/src/index.ts'), 'candidate', await candidateCss())
      : null;
  const cdp = await connect();
  const version = await cdp.call('Browser.getVersion');
  const scenarios = [
    ['sheet-inline-440', {}],
    ['sheet-stacked-440', { layout: 'stacked' }],
    ['sheet-inline-340-rtl', { width: 340, direction: 'rtl' }],
    ['sheet-compact', { padding: 'compact' }],
    ['centered-sm', { variant: 'centered', size: 'sm', scope: 'viewport' }],
    ['centered-md', { variant: 'centered', size: 'md', scope: 'viewport' }],
    ['centered-lg', { variant: 'centered', size: 'lg', scope: 'viewport' }],
    ['centered-full', { variant: 'centered', size: 'full', scope: 'viewport' }],
    ['alert-dialog', { kind: 'alert' }],
    ['command-palette', { kind: 'palette' }]
  ];
  const baselineResults = await observe(cdp, baseline, scenarios);
  const candidateResults =
    candidate &&
    (await observe(cdp, candidate, [
      ...scenarios,
      ['sheet-full', { size: 'full' }],
      ['sheet-clamp-fit', { clamp: true, title: 'Short' }],
      [
        'sheet-clamp-unbroken',
        { clamp: true, title: 'AnExtremelyLongUnbrokenRecordTitleThatRemainsAvailableInTheScrollableBody' }
      ],
      [
        'sheet-clamp-stacked-rtl',
        {
          clamp: true,
          layout: 'stacked',
          direction: 'rtl',
          width: 340,
          padding: 'compact',
          title: 'A long title with enough words to occupy multiple lines in a compact sheet header'
        }
      ],
      [
        'sheet-clamp',
        { clamp: true, title: 'A long title with enough words to occupy multiple lines in a compact sheet header' }
      ],
      ['sheet-header-actions', { headerActions: true }],
      [
        'sheet-combined-440',
        {
          size: 'full',
          clamp: true,
          headerActions: true,
          title: 'A long title with enough words to occupy multiple lines in a compact sheet header'
        }
      ],
      [
        'sheet-just-enough-height',
        {
          size: 'full',
          clamp: true,
          headerActions: true,
          height: 240,
          title: 'A long title with enough words to occupy multiple lines in a compact sheet header'
        }
      ],
      [
        'sheet-insufficient-height',
        {
          size: 'full',
          clamp: true,
          headerActions: true,
          height: 130,
          title: 'A long title with enough words to occupy multiple lines in a compact sheet header'
        }
      ]
    ]));
  const hits = candidate ? await hitTests(cdp) : [];
  const interactions = candidate ? await interactionChecks(cdp) : null;
  const negatives = candidate ? await negativeControls(cdp) : [];
  const extended = {};
  const failures = [];
  if (candidate) {
    for (const [name, check] of Object.entries({
      titleRouteDiagnostic,
      keyboardMatrix,
      focusRings,
      gapChecks,
      resizeChecks,
      preferenceChecks
    })) {
      try {
        await cdp.call('Emulation.setDeviceMetricsOverride', {
          width: 1000,
          height: 800,
          deviceScaleFactor: 1,
          mobile: false
        });
        await cdp.call('Emulation.setEmulatedMedia', { features: [] });
        extended[name] = await check(cdp);
      } catch (error) {
        failures.push(`${name}: ${error.stack || error}`);
      }
    }
  }
  const summarize = (results) =>
    results?.map(({ name, before, after }) => ({
      name,
      host: before.host,
      overlay: before.overlay,
      panel: before.panel,
      title: before.title,
      titleStyle: before.titleStyle,
      visibleLines: before.visibleLines.length,
      visibleFragments: before.visibleFragments,
      titleLastBaseline: before.titleLastBaseline,
      statusBaseline: before.statusBaseline,
      descriptionBaseline: before.descriptionBaseline,
      body: before.body,
      bodyStyle: before.bodyStyle,
      bodyScrollBefore: before.bodyScroll,
      bodyScrollAfter: after.bodyScroll,
      overlayScrollBefore: before.overlayScroll,
      overlayScrollAfter: after.overlayScroll,
      actions: before.actions,
      actionsTag: before.actionsTag,
      actionsInHeader: before.actionsInHeader,
      close: before.close,
      closeAfter: before.closeAfter,
      focus: before.focus,
      tokens: before.tokens,
      fonts: before.fonts,
      direction: before.direction
    }));
  console.log(
    JSON.stringify(
      {
        phase,
        version,
        scratch,
        fixture: 'SSR shell hydrated into an interactive Radix portal',
        css: 'production UI and native tokens, inline',
        network: 'HTTP(S) blocked',
        harnessSHA256: createHash('sha256')
          .update(await readFile(fileURLToPath(import.meta.url)))
          .digest('hex'),
        baseline: summarize(baselineResults),
        candidate: summarize(candidateResults),
        hitTests: {
          total: hits.length,
          mouse: hits.filter((item) => item.input === 'mouse').length,
          touch: hits.filter((item) => item.input === 'touch').length
        },
        interactions,
        negatives,
        extended,
        failures
      },
      null,
      2
    )
  );
  if (candidateResults) {
    for (const [index, baselineResult] of baselineResults.entries()) {
      const candidateResult = candidateResults[index];
      assert.equal(candidateResult.name, baselineResult.name);
      for (const dimension of ['width', 'height']) {
        assert.ok(
          Math.abs(candidateResult.before.panel[dimension] - baselineResult.before.panel[dimension]) < 0.1,
          `${baselineResult.name}: changed default panel ${dimension}`
        );
      }
      assert.equal(
        candidateResult.before.panelStyle.backgroundColor,
        baselineResult.before.panelStyle.backgroundColor,
        `${baselineResult.name}: changed default panel background`
      );
      assert.equal(
        candidateResult.before.overlayStyle.backgroundColor,
        baselineResult.before.overlayStyle.backgroundColor,
        `${baselineResult.name}: changed shared scrim`
      );
    }
    assert.equal(hits.length, 864, 'Mouse and touch edge/corner sequences');
    assert.equal(negatives.length, 4, 'Both negative fixtures must be detected with both inputs');
    assert.deepEqual(failures, [], 'Extended browser evidence checks');
    const byName = (name) => candidateResults.find((item) => item.name === name);
    for (const name of ['sheet-clamp', 'sheet-header-actions', 'sheet-combined-440', 'sheet-just-enough-height']) {
      const result = byName(name);
      assert.ok(result, `Missing ${name}`);
      assert.equal(
        result.before.overlayScroll.height,
        result.before.overlayScroll.client,
        `${name}: overlay must not scroll in a sufficient host`
      );
      assert.ok(result.after.bodyScroll.top > result.before.bodyScroll.top, `${name}: body must scroll`);
      assert.equal(result.after.overlayScroll.top, 0, `${name}: overlay must stay stationary`);
    }
    const combined = byName('sheet-combined-440').before;
    assert.ok(
      Math.abs(combined.panel.width - combined.overlayScroll.width) < 0.1,
      'Full sheet must fill overlay content width'
    );
    assert.equal(combined.actionsInHeader, true, 'Combined actions must be in header');
    assert.equal(combined.actionsTag, 'DIV', 'Header actions must not be a landmark');
    assert.equal(combined.visibleLines.length, 2, 'Long title must show two lines');
    assert.ok(
      Math.abs(combined.titleLastBaseline - combined.statusBaseline) < 0.1,
      'Status must share the last visible title baseline'
    );
    assert.ok(
      Math.abs(combined.titleLastBaseline - combined.descriptionBaseline) < 0.1,
      'Inline description must share the last visible title baseline'
    );
    assert.ok(
      Math.abs(
        combined.close.y + combined.close.height / 2 - combined.title.y - parseFloat(combined.titleStyle.lineHeight) / 2
      ) < 0.1,
      'Close must align with the first title line'
    );
    for (const name of ['sheet-clamp-fit', 'sheet-clamp-unbroken', 'sheet-clamp-stacked-rtl']) {
      const result = byName(name).before;
      assert.ok(result.visibleLines.length <= 2, `${name}: at most two visible lines`);
      assert.ok(Math.abs(result.titleLastBaseline - result.statusBaseline) < 0.1, `${name}: status baseline`);
    }
    const short = byName('sheet-insufficient-height').before;
    assert.ok(short.overlayScroll.height > short.overlayScroll.client, 'Insufficient host must allow overlay scroll');
    assert.ok(
      short.body.height - parseFloat(short.bodyStyle.paddingTop) - parseFloat(short.bodyStyle.paddingBottom) >= 44.7,
      'Body content minimum must remain available'
    );
  }
} finally {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
  if (browser && browser.exitCode === null) {
    browser.kill('SIGTERM');
    await Promise.race([new Promise((resolveExit) => browser.once('exit', resolveExit)), delay(5000)]);
    if (browser.exitCode === null) {
      browser.kill('SIGKILL');
    }
  }
  await rm(scratch, { recursive: true, force: true });
}
