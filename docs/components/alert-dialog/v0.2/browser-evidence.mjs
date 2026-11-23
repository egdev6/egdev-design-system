import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { build as viteBuild } from 'vite';

// Local evidence only: no repository build, network, or persistent browser profile.
const root = resolve(fileURLToPath(new URL('../../../..', import.meta.url)));
const require = createRequire(join(root, 'package.json'));
const React = require('react');
const { renderToString } = require('react-dom/server');
const esbuild = require(join(root, 'node_modules/.pnpm/esbuild@0.25.12/node_modules/esbuild'));
const scratch = await mkdtemp(join(tmpdir(), 'egdev-alert-dialog-544-'));
const delay = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
let browser;
let socket;

const fixture = `
import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { hydrateRoot } from 'react-dom/client';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogCancel, AlertDialogAction,
  Dialog, DialogTrigger, DialogContent } from ${JSON.stringify(join(root, 'packages/ui/src/index.ts'))};
import * as RadixAlert from ${JSON.stringify(join(root, 'packages/ui/node_modules/@radix-ui/react-alert-dialog/dist/index.mjs'))};
const defaults = { mode:'single', scope:'derived', form:'native', disabledAction:false, width:440, height:600 };
export function App() {
  const [host, setHost] = useState(null);
  const [settings, setSettings] = useState(defaults);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const inFlight = useRef(false);
  useEffect(() => {
    window.__reset = (next = {}) => flushSync(() => {
      setSheetOpen(false); setAlertOpen(false); setPending(false); setFailed(false);
      inFlight.current = false; setSettings({...defaults, ...next});
      window.__events = {sheet:[], alert:[], cancelOuter:0, cancelChild:0,
        actionOuter:0, actionChild:0, outside:0, operations:0};
      window.__input = []; window.__outsideEvents = []; window.__focusEvents = [];
      window.__radixEvents = {pointer:0, interact:0, escape:0};
    });
    window.__setPending = (value) => flushSync(() => setPending(value));
    window.__resize = (width, height) => flushSync(() => setSettings(s => ({...s, width, height})));
    window.__finish = (success) => flushSync(() => {
      inFlight.current = false; setPending(false);
      if (success) setAlertOpen(false); else setFailed(true);
    });
    const capture = (event) => {
      const button = event.target instanceof Element ? event.target.closest('button') : null;
      window.__input.push({type:event.type, pointerType:event.pointerType || '', key:event.key || '', target:button?.id || event.target?.tagName});
    };
    window.__events = {sheet:[], alert:[], cancelOuter:0, cancelChild:0,
      actionOuter:0, actionChild:0, outside:0, operations:0};
    window.__input = []; window.__outsideEvents = []; window.__focusEvents = [];
    window.__radixEvents = {pointer:0, interact:0, escape:0};
    const outsideCapture = (event) => {
      const record = {target:event.target?.tagName, prevented:false, originalPrevented:false};
      window.__outsideEvents.push(record);
      queueMicrotask(() => { record.prevented = event.defaultPrevented;
        record.originalPrevented = event.detail.originalEvent.defaultPrevented; });
    };
    const focusCapture = (event) => window.__focusEvents.push({type:event.type, target:event.target?.id || event.target?.tagName,
      related:event.relatedTarget ? event.relatedTarget.id || event.relatedTarget.tagName : null});
    for (const type of ['pointerdown','pointerup','click','keydown','keyup']) document.addEventListener(type, capture, true);
    for (const type of ['focusin','focusout']) document.addEventListener(type, focusCapture, true);
    document.addEventListener('dismissableLayer.pointerDownOutside', outsideCapture, true);
    window.__fixtureReady = true;
    return () => {
      for (const type of ['pointerdown','pointerup','click','keydown','keyup']) document.removeEventListener(type, capture, true);
      for (const type of ['focusin','focusout']) document.removeEventListener(type, focusCapture, true);
      document.removeEventListener('dismissableLayer.pointerDownOutside', outsideCapture, true);
    };
  }, []);
  const action = (event) => {
    window.__events.actionOuter++;
    if (settings.mode === 'async') {
      event.preventDefault();
      if (inFlight.current) return;
      inFlight.current = true; window.__events.operations++; setFailed(false); setPending(true);
    }
  };
  const cancel = () => window.__events.cancelOuter++;
  const decisions = settings.form === 'slot' ? <>
    <AlertDialogCancel asChild onClick={cancel}><button id='cancel' type='button' onClick={() => window.__events.cancelChild++}>Cancel</button></AlertDialogCancel>
    <AlertDialogAction asChild onClick={action}><button id='action' type='button' disabled={settings.disabledAction} aria-disabled={false} onClick={() => window.__events.actionChild++}>Delete</button></AlertDialogAction>
  </> : <>
    <AlertDialogCancel id='cancel' onClick={cancel}>Cancel</AlertDialogCancel>
    <AlertDialogAction id='action' disabled={settings.disabledAction} onClick={action}>Delete</AlertDialogAction>
  </>;
  const placement = settings.scope === 'body' ? {} : settings.scope === 'null' ? {container:null} :
    settings.scope === 'derived' ? {container:host} : {container:host, overlayScope:settings.scope};
  const alert = settings.mode === 'radix' ? <RadixAlert.Root open={alertOpen} onOpenChange={(value) => {
    window.__events.alert.push(value); setAlertOpen(value);
  }}>
    <RadixAlert.Trigger id='alert-trigger'>Open alert</RadixAlert.Trigger>
    <RadixAlert.Portal container={host}>
      <RadixAlert.Overlay style={{position:'absolute', inset:0, display:'grid', placeItems:'center'}}>
        <RadixAlert.Content style={{background:'white',padding:'24px'}}
          onPointerDownOutside={(event) => { window.__radixEvents.pointer++; event.preventDefault(); }}
          onInteractOutside={(event) => { window.__radixEvents.interact++; event.preventDefault(); }}
          onEscapeKeyDown={(event) => { window.__radixEvents.escape++; event.preventDefault(); }}>
          <RadixAlert.Title>Delete note?</RadixAlert.Title>
          <RadixAlert.Description>This cannot be undone.</RadixAlert.Description>
          <RadixAlert.Cancel id='cancel'>Cancel</RadixAlert.Cancel>
          <RadixAlert.Action id='action'>Delete</RadixAlert.Action>
        </RadixAlert.Content>
      </RadixAlert.Overlay>
    </RadixAlert.Portal>
  </RadixAlert.Root> : <AlertDialog open={alertOpen} pending={pending} onOpenChange={(value) => {
    window.__events.alert.push(value); setAlertOpen(value);
  }}>
    <AlertDialogTrigger id='alert-trigger'>Open alert</AlertDialogTrigger>
    <AlertDialogContent title='Delete note?' description='This cannot be undone.' {...placement} actions={decisions}>
      {pending && <p id='progress'>Deleting…</p>}{failed && <p id='error'>Delete failed. Retry or cancel.</p>}
    </AlertDialogContent>
  </AlertDialog>;
  return <main>
    <div id='outside'><button id='outside-button' onClick={() => window.__events.outside++}>Outside action</button></div>
    <div id='fixture-host' ref={setHost} style={{position:'relative', boxSizing:'border-box',
      width:settings.width+'px', height:settings.height+'px', marginLeft:'100px', marginTop:'60px'}}/>
    {host && (settings.mode === 'nested' ? <Dialog open={sheetOpen} onOpenChange={(value) => {
      window.__events.sheet.push(value); setSheetOpen(value);
    }}><DialogTrigger id='sheet-trigger'>Open sheet</DialogTrigger>
      <DialogContent title='Note' description='Note details.' variant='sheet' container={host}>{alert}</DialogContent>
    </Dialog> : alert)}
  </main>;
}
if (typeof document !== 'undefined') hydrateRoot(document.getElementById('root'), <App/>);
`;

async function stylesheet(input, name) {
  const result = await viteBuild({
    configFile: false,
    envDir: false,
    root,
    cacheDir: join(scratch, `vite-${name}`),
    plugins: [tailwindcss({ optimize: false })],
    logLevel: 'error',
    build: {
      write: false,
      minify: false,
      cssMinify: false,
      rolldownOptions: { input: join(root, input) }
    }
  });
  const outputs = (Array.isArray(result) ? result : [result]).flatMap((item) => item.output ?? []);
  const css = outputs.find((item) => item.type === 'asset' && item.fileName.endsWith('.css'));
  assert.ok(css, `Missing ${name} CSS`);
  return String(css.source);
}

async function compile() {
  const common = {
    stdin: { contents: fixture, resolveDir: root, sourcefile: 'fixture.tsx', loader: 'tsx' },
    bundle: true,
    jsx: 'automatic',
    alias: { '@': join(root, 'packages/ui/src') },
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'silent',
    write: false
  };
  const [tokens, ui, server, client] = await Promise.all([
    stylesheet('packages/tokens/src/native.css', 'tokens'),
    stylesheet('packages/ui/src/styles/compiled.css', 'ui'),
    esbuild.build({ ...common, platform: 'node', format: 'cjs', external: ['react', 'react-dom', 'react-dom/*'] }),
    esbuild.build({ ...common, platform: 'browser', format: 'iife' })
  ]);
  const serverFile = join(scratch, 'fixture-server.cjs');
  await writeFile(serverFile, server.outputFiles[0].contents);
  const markup = renderToString(React.createElement(require(serverFile).App));
  const script = client.outputFiles[0].text.replaceAll('</script', '<\\/script');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${tokens}</style><style>${ui}</style></head><body><div id="root">${markup}</div><script>${script}</script></body></html>`;
  const page = join(scratch, 'fixture.html');
  await writeFile(page, html);
  return pathToFileURL(page).href;
}

async function waitFor(fn, description) {
  for (let attempt = 0; attempt < 200; attempt++) {
    const result = await fn();
    if (result) {
      return result;
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
    if (browser.exitCode !== null || browser.signalCode !== null) {
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
    if (!message.id || !pending.has(message.id)) {
      return;
    }
    const request = pending.get(message.id);
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

async function key(cdp, name, shift = false) {
  const data = new Map([
    ['Tab', { key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }],
    ['Escape', { key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }],
    ['Enter', { key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }],
    ['Space', { key: ' ', code: 'Space', windowsVirtualKeyCode: 32 }]
  ]).get(name);
  assert.ok(data, `Unknown key ${name}`);
  const params = { ...data, nativeVirtualKeyCode: data.windowsVirtualKeyCode, modifiers: shift ? 8 : 0 };
  const text = name === 'Enter' ? '\r' : name === 'Space' ? ' ' : undefined;
  await cdp.call('Input.dispatchKeyEvent', {
    type: 'keyDown',
    ...params,
    ...(text ? { text, unmodifiedText: text } : {})
  });
  await cdp.call('Input.dispatchKeyEvent', { type: 'keyUp', ...params });
}

async function point(cdp, selector) {
  const box = await cdp.evaluate(`(() => { const node = document.querySelector(${JSON.stringify(selector)});
    if (!node) return null; const r = node.getBoundingClientRect();
    return {x:r.x+r.width/2, y:r.y+r.height/2}; })()`);
  assert.ok(box, `Missing ${selector}`);
  return box;
}

async function pointer(cdp, input, location) {
  const { x, y } = location;
  await cdp.call('Emulation.setTouchEmulationEnabled', { enabled: input === 'touch', maxTouchPoints: 1 });
  if (input === 'mouse') {
    await cdp.call('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    await cdp.call('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
    await cdp.call('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
  } else {
    await cdp.call('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
    await cdp.call('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  await delay(30);
}

async function click(cdp, selector, input = 'mouse') {
  const location = await point(cdp, selector);
  assert.equal(
    await cdp.evaluate(`document.elementFromPoint(${location.x},${location.y})?.closest('button')?.id`),
    selector.slice(1),
    `${selector} must be the painted button`
  );
  await pointer(cdp, input, location);
}

async function reset(cdp, settings = {}) {
  await cdp.evaluate(`window.__reset(${JSON.stringify(settings)})`);
  await waitFor(
    () => cdp.evaluate(`!document.querySelector('[role="dialog"], [role="alertdialog"]')`),
    'closed portals'
  );
}

async function focusIs(cdp, id, description) {
  await waitFor(() => cdp.evaluate(`document.activeElement.id === ${JSON.stringify(id)}`), description);
}

async function open(cdp, nested = false) {
  if (nested) {
    await click(cdp, '#sheet-trigger');
    await waitFor(() => cdp.evaluate(`!!document.querySelector('[role="dialog"]')`), 'sheet');
  }
  await click(cdp, '#alert-trigger');
  await waitFor(() => cdp.evaluate(`!!document.querySelector('[role="alertdialog"]')`), 'alert');
}

const measurement = `(() => {
  const host = document.getElementById('fixture-host');
  const panel = document.querySelector('[role="alertdialog"]');
  const overlay = panel.parentElement;
  const rect = (node) => { const r = node.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; };
  return {host:rect(host), overlay:rect(overlay), panel:rect(panel),
    position:getComputedStyle(overlay).position, portalInHost:host.contains(overlay),
    viewport:{x:0,y:0,width:innerWidth,height:innerHeight}};
})()`;

function sameRect(actual, expected, label) {
  for (const key of ['x', 'y', 'width', 'height']) {
    assert.ok(Math.abs(actual[key] - expected[key]) < 0.1, `${label} ${key}: ${actual[key]} != ${expected[key]}`);
  }
}

async function placementChecks(cdp) {
  const results = [];
  for (const scope of ['body', 'null', 'derived', 'container', 'viewport']) {
    await reset(cdp, { scope });
    await open(cdp);
    const before = await cdp.evaluate(measurement);
    const hosted = !['body', 'null'].includes(scope);
    const contained = ['derived', 'container'].includes(scope);
    assert.equal(before.portalInHost, hosted, `${scope}: portal target`);
    assert.equal(before.position, contained ? 'absolute' : 'fixed', `${scope}: positioning`);
    sameRect(before.overlay, contained ? before.host : before.viewport, scope);
    if (hosted) {
      await cdp.evaluate('window.__resize(360, 520)');
      const after = await cdp.evaluate(measurement);
      sameRect(after.overlay, contained ? after.host : after.viewport, `${scope} resized`);
      results.push({ scope, before, after });
    } else {
      results.push({ scope, before });
    }
  }
  return results;
}

async function modalityChecks(cdp) {
  await reset(cdp);
  await open(cdp);
  assert.equal(await cdp.evaluate('document.activeElement.id'), 'cancel', 'Cancel receives initial focus');
  const outside = await cdp.evaluate(`(() => { const n=document.getElementById('outside');
    return {hidden:!!n.closest('[aria-hidden="true"]'), pointer:getComputedStyle(n).pointerEvents}; })()`);
  assert.equal(outside.hidden, true, 'Radix must hide outside content from accessibility');
  assert.equal(outside.pointer, 'none', 'Radix must suppress outside pointer interaction');
  await cdp.call('Accessibility.enable');
  const tree = await cdp.call('Accessibility.getFullAXTree');
  assert.ok(
    tree.nodes.some((node) => !node.ignored && node.role?.value === 'alertdialog'),
    'AX alert dialog'
  );
  assert.ok(!tree.nodes.some((node) => !node.ignored && node.name?.value === 'Outside action'), 'AX outside hidden');
  const order = [];
  for (const shift of [false, false, true]) {
    await key(cdp, 'Tab', shift);
    order.push(await cdp.evaluate('document.activeElement.id'));
  }
  assert.deepEqual(order, ['action', 'cancel', 'action'], 'Tab and Shift+Tab remain in the modal');
  await cdp.evaluate(`document.getElementById('outside-button').focus()`);
  assert.ok(
    await cdp.evaluate(`document.querySelector('[role="alertdialog"]').contains(document.activeElement)`),
    'Programmatic focus cannot escape'
  );
  await key(cdp, 'Escape');
  await waitFor(() => cdp.evaluate(`!document.querySelector('[role="alertdialog"]')`), 'Escape close');
  await focusIs(cdp, 'alert-trigger', 'Escape focus return');
  await open(cdp);
  await click(cdp, '#cancel');
  await waitFor(() => cdp.evaluate(`!document.querySelector('[role="alertdialog"]')`), 'Cancel close');
  await focusIs(cdp, 'alert-trigger', 'Cancel focus return');
  const events = await cdp.evaluate('window.__events');
  assert.deepEqual(events.alert, [true, false, true, false]);
  assert.equal(events.cancelOuter, 1);
  return { outside, tabOrder: order, escapeAndCancelReturn: true, events };
}

async function outsideChecks(cdp) {
  const results = [];
  for (const pending of [false, true]) {
    for (const input of ['mouse', 'touch']) {
      await reset(cdp);
      await open(cdp);
      await cdp.evaluate(`document.getElementById('cancel').focus(); window.__setPending(${pending});
        window.__outsideEvents = []; window.__focusEvents = []`);
      assert.equal(await cdp.evaluate('document.activeElement.id'), 'cancel', 'Pending toggle retains focus');
      const location = await point(cdp, '#outside-button');
      await pointer(cdp, input, location);
      const result = await cdp.evaluate(`({pending:${pending}, input:${JSON.stringify(input)},
        focus:{id:document.activeElement.id,tag:document.activeElement.tagName,
          inside:document.querySelector('[role="alertdialog"]').contains(document.activeElement)},
        outsideEvents:window.__outsideEvents, focusEvents:window.__focusEvents, events:window.__events,
        open:!!document.querySelector('[role="alertdialog"]')})`);
      console.log(JSON.stringify({ step: 'outside', result }));
      assert.equal(result.open, true, 'Outside interaction must not dismiss');
      assert.deepEqual(result.events.alert, [true]);
      assert.equal(result.events.outside, 0);
      assert.ok(
        result.outsideEvents.some((event) => event.prevented && !event.originalPrevented),
        `${input}/${pending}: Radix must cancel its custom outside event, not the original pointer event`
      );
      results.push(result);
    }
  }
  for (const input of ['mouse', 'touch']) {
    const baseline = results.find((result) => !result.pending && result.input === input);
    const pending = results.find((result) => result.pending && result.input === input);
    assert.deepEqual(pending.focus, baseline.focus, `${input}: pending must preserve baseline outside-focus behavior`);
  }
  return results;
}

async function radixHandlerChecks(cdp) {
  await reset(cdp, { mode: 'radix' });
  await open(cdp);
  assert.equal(await cdp.evaluate('document.activeElement.id'), 'cancel');
  const location = await point(cdp, '#outside-button');
  await pointer(cdp, 'mouse', location);
  const outside = await cdp.evaluate(`({events:window.__radixEvents, outsideEvents:window.__outsideEvents,
    focus:{id:document.activeElement.id,tag:document.activeElement.tagName},
    open:!!document.querySelector('[role="alertdialog"]')})`);
  console.log(JSON.stringify({ step: 'raw-radix-outside', result: outside }));
  assert.deepEqual(outside.events, { pointer: 0, interact: 0, escape: 0 }, 'Radix overrides outside handlers');
  assert.ok(outside.outsideEvents.some((event) => event.prevented && !event.originalPrevented));
  assert.equal(outside.open, true);
  await cdp.evaluate(`document.getElementById('cancel').focus()`);
  await key(cdp, 'Escape');
  const escapeResult = await cdp.evaluate(`({events:window.__radixEvents, focus:document.activeElement.id,
    open:!!document.querySelector('[role="alertdialog"]')})`);
  assert.deepEqual(escapeResult.events, { pointer: 0, interact: 0, escape: 1 }, 'Radix forwards Escape handler');
  assert.equal(escapeResult.open, true, 'Prevented Escape does not dismiss');
  assert.equal(escapeResult.focus, 'cancel');
  return { outside, escape: escapeResult };
}

async function pendingChecks(cdp) {
  const cases = [];
  for (const form of ['native', 'slot']) {
    await reset(cdp, { form });
    await open(cdp);
    assert.equal(await cdp.evaluate('document.activeElement.id'), 'cancel');
    await cdp.evaluate('window.__setPending(true)');
    assert.equal(await cdp.evaluate('document.activeElement.id'), 'cancel', `${form}: pending retains focus`);
    const attributes =
      await cdp.evaluate(`(() => ({busy:document.querySelector('[role="alertdialog"]').getAttribute('aria-busy'),
      cancel:document.getElementById('cancel').getAttribute('aria-disabled'),
      action:document.getElementById('action').getAttribute('aria-disabled'),
      disabled:[document.getElementById('cancel').disabled,document.getElementById('action').disabled]}))()`);
    assert.deepEqual(attributes, { busy: 'true', cancel: 'true', action: 'true', disabled: [false, false] });
    for (const button of ['cancel', 'action']) {
      for (const input of ['mouse', 'touch', 'Enter', 'Space']) {
        await cdp.evaluate(`document.getElementById(${JSON.stringify(button)}).focus(); window.__input = []`);
        assert.equal(await cdp.evaluate('document.activeElement.id'), button);
        if (input === 'mouse' || input === 'touch') {
          await click(cdp, `#${button}`, input);
        } else {
          await key(cdp, input);
        }
        const result =
          await cdp.evaluate(`({focus:document.activeElement.id, input:window.__input, events:window.__events,
          open:!!document.querySelector('[role="alertdialog"]')})`);
        assert.equal(result.focus, button, `${form}/${button}/${input}: focus`);
        assert.equal(result.open, true);
        assert.ok(
          result.input.some((event) => event.type === 'click' && event.target === button),
          `${form}/${button}/${input}: activation must actually reach the control: ${JSON.stringify(result.input)}`
        );
        if (input === 'mouse' || input === 'touch') {
          for (const type of ['pointerdown', 'pointerup']) {
            assert.ok(
              result.input.some(
                (event) => event.type === type && event.target === button && event.pointerType === input
              ),
              `${form}/${button}/${input}: ${type}`
            );
          }
        }
        assert.deepEqual(result.events, {
          sheet: [],
          alert: [true],
          cancelOuter: 0,
          cancelChild: 0,
          actionOuter: 0,
          actionChild: 0,
          outside: 0,
          operations: 0
        });
        cases.push({ form, button, input });
      }
    }
    await cdp.evaluate(`document.getElementById('cancel').focus()`);
    await key(cdp, 'Escape');
    const blocked = await cdp.evaluate(`({focus:document.activeElement.id, events:window.__events,
      open:!!document.querySelector('[role="alertdialog"]')})`);
    assert.equal(blocked.open, true);
    assert.equal(blocked.focus, 'cancel', 'Pending Escape retains focus');
    assert.deepEqual(blocked.events.alert, [true]);
    await cdp.evaluate('window.__setPending(false)');
    assert.equal(await cdp.evaluate('document.activeElement.id'), 'cancel');
    await click(cdp, '#cancel');
    await waitFor(() => cdp.evaluate(`!document.querySelector('[role="alertdialog"]')`), 'unlocked Cancel');
    const restored = await cdp.evaluate('window.__events');
    assert.deepEqual(restored.alert, [true, false]);
    assert.equal(restored.cancelOuter, 1);
    assert.equal(restored.cancelChild, form === 'slot' ? 1 : 0);
  }
  for (const form of ['native', 'slot']) {
    await reset(cdp, { form, disabledAction: true });
    await open(cdp);
    await cdp.evaluate('window.__setPending(true)');
    const disabled = await cdp.evaluate(`(() => { const button = document.getElementById('action');
      return {disabled:button.disabled,pointer:getComputedStyle(button).pointerEvents}; })()`);
    assert.equal(disabled.disabled, true, `${form}: native disabled takes precedence`);
    if (form === 'native') {
      assert.equal(disabled.pointer, 'none', 'Explicit disabled remains pointer-inert');
    }
  }
  return { cases, blockedEscape: 2, unlockedCancel: 2, explicitDisabled: 2 };
}

async function stackingChecks(cdp) {
  const samples = [];
  const hits = [];
  const actionHits = [];
  for (const motion of ['no-preference', 'reduce']) {
    await cdp.call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: motion }] });
    for (const size of [
      { width: 440, height: 600 },
      { width: 360, height: 520 }
    ]) {
      await reset(cdp, { mode: 'nested' });
      await click(cdp, '#sheet-trigger');
      await waitFor(() => cdp.evaluate(`!!document.querySelector('[role="dialog"]')`), 'nested sheet');
      await cdp.evaluate(`window.__resize(${size.width},${size.height})`);
      const locations = await cdp.evaluate(`(() => {
        const sheet=document.querySelector('[role="dialog"]'); const host=document.getElementById('fixture-host');
        const close=[...sheet.querySelectorAll('button')].find(n => n.textContent.trim()==='Close');
        const header=sheet.querySelector('header').getBoundingClientRect(); const r=close.getBoundingClientRect();
        const h=host.getBoundingClientRect(); const cx=r.x+r.width/2, cy=r.y+r.height/2;
        return {close:{x:cx,y:cy},closeLeft:{x:cx-22,y:cy},closeRight:{x:cx+22,y:cy},
          closeTop:{x:cx,y:cy-22},closeBottom:{x:cx,y:cy+22},header:{x:header.x+header.width/2,y:header.y+header.height/2},
          topLeft:{x:h.left+2,y:h.top+2},topRight:{x:h.right-2,y:h.top+2},
          bottomLeft:{x:h.left+2,y:h.bottom-2},bottomRight:{x:h.right-2,y:h.bottom-2}};
      })()`);
      await click(cdp, '#alert-trigger');
      await waitFor(() => cdp.evaluate(`!!document.querySelector('[role="alertdialog"]')`), 'nested alert');
      for (const pause of [0, 16, 64, 200]) {
        await delay(pause);
        for (const [name, { x, y }] of Object.entries(locations)) {
          const hit = await cdp.evaluate(`(() => { const alert=document.querySelector('[role="alertdialog"]');
            const node=document.elementFromPoint(${x},${y}); return !!node && alert.parentElement.contains(node); })()`);
          assert.equal(hit, true, `${motion}/${size.width}/${pause}/${name}: top painted layer must be alert`);
          samples.push({ motion, width: size.width, pause, name });
        }
      }
      const ax = await cdp.call('Accessibility.getFullAXTree');
      assert.ok(
        ax.nodes.some((n) => !n.ignored && n.role?.value === 'alertdialog'),
        'Nested AX alert'
      );
      assert.ok(!ax.nodes.some((n) => !n.ignored && n.role?.value === 'dialog'), 'Nested AX sheet hidden');
      await cdp.evaluate('window.__setPending(true)');
      await key(cdp, 'Escape');
      for (const input of ['mouse', 'touch']) {
        for (const [name, location] of Object.entries(locations)) {
          await cdp.evaluate('window.__input = []');
          await pointer(cdp, input, location);
          const result = await cdp.evaluate(`({events:window.__events, input:window.__input,
            sheet:!!document.querySelector('[role="dialog"]'), alert:!!document.querySelector('[role="alertdialog"]')})`);
          assert.equal(
            result.sheet && result.alert,
            true,
            `${motion}/${size.width}/${input}/${name}: both remain open`
          );
          assert.deepEqual(result.events.sheet, [true], 'Sheet receives no close request');
          assert.deepEqual(result.events.alert, [true], 'Alert receives no close request');
          assert.equal(result.events.cancelOuter + result.events.actionOuter, 0, 'Pending action handlers are blocked');
          assert.ok(
            result.input.some((event) => event.type === 'pointerdown' && event.pointerType === input),
            `${motion}/${size.width}/${input}/${name}: real pointerdown`
          );
          hits.push({ motion, width: size.width, input, name });
        }
      }
      await cdp.evaluate('window.__setPending(false)');
      await click(cdp, '#cancel');
      await waitFor(() => cdp.evaluate(`!document.querySelector('[role="alertdialog"]')`), 'nested cancel');
      await focusIs(cdp, 'alert-trigger', 'nested focus return');
      assert.ok(await cdp.evaluate(`!!document.querySelector('[role="dialog"]')`), 'Sheet remains open');
      await key(cdp, 'Escape');
      await waitFor(() => cdp.evaluate(`!document.querySelector('[role="dialog"]')`), 'sheet close');
      await focusIs(cdp, 'sheet-trigger', 'sheet focus return');
    }
    for (const button of ['cancel', 'action']) {
      for (const input of ['mouse', 'touch']) {
        await reset(cdp, { mode: 'nested' });
        await open(cdp, true);
        await cdp.evaluate('window.__input = []');
        await click(cdp, `#${button}`, input);
        await waitFor(() => cdp.evaluate(`!document.querySelector('[role="alertdialog"]')`), 'nested decision');
        await focusIs(cdp, 'alert-trigger', 'nested decision focus return');
        const result = await cdp.evaluate(`({events:window.__events,input:window.__input,
          sheet:!!document.querySelector('[role="dialog"]'),focus:document.activeElement.id})`);
        assert.equal(result.sheet, true);
        assert.equal(result.focus, 'alert-trigger');
        assert.deepEqual(result.events.sheet, [true]);
        assert.deepEqual(result.events.alert, [true, false]);
        assert.equal(result.events[button === 'cancel' ? 'cancelOuter' : 'actionOuter'], 1);
        assert.ok(result.input.some((event) => event.type === 'click' && event.target === button));
        actionHits.push({ motion, input, button });
      }
    }
  }
  await cdp.call('Emulation.setTouchEmulationEnabled', { enabled: false });
  return { samples, hits, actionHits };
}

async function asyncChecks(cdp) {
  await reset(cdp, { mode: 'async' });
  await open(cdp);
  await click(cdp, '#action');
  await waitFor(() => cdp.evaluate(`!!document.getElementById('progress')`), 'pending progress');
  await click(cdp, '#action');
  let state = await cdp.evaluate(
    `({events:window.__events,busy:document.querySelector('[role="alertdialog"]').getAttribute('aria-busy')})`
  );
  assert.equal(state.events.operations, 1);
  assert.deepEqual(state.events.alert, [true]);
  assert.equal(state.busy, 'true');
  await cdp.evaluate('window.__finish(false)');
  assert.equal(await cdp.evaluate(`!!document.getElementById('error')`), true);
  assert.equal(await cdp.evaluate(`document.querySelector('[role="alertdialog"]').hasAttribute('aria-busy')`), false);
  await click(cdp, '#action');
  await waitFor(() => cdp.evaluate(`!!document.getElementById('progress')`), 'retry progress');
  state = await cdp.evaluate('window.__events');
  assert.equal(state.operations, 2);
  assert.deepEqual(state.alert, [true]);
  await cdp.evaluate('window.__finish(true)');
  await waitFor(() => cdp.evaluate(`!document.querySelector('[role="alertdialog"]')`), 'deliberate success close');
  return {
    operations: 2,
    initialDuplicateBlocked: true,
    failureRecovered: true,
    successClosed: true,
    openChanges: await cdp.evaluate('window.__events.alert')
  };
}

try {
  await symlink(join(root, 'node_modules'), join(scratch, 'node_modules'), 'dir');
  const url = await compile();
  const cdp = await connect();
  const version = await cdp.call('Browser.getVersion');
  await cdp.call('Page.navigate', { url });
  await waitFor(() => cdp.evaluate('window.__fixtureReady === true'), 'hydrated fixture');
  const environment = await cdp.evaluate(`({viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},
    direction:getComputedStyle(document.documentElement).direction, font:getComputedStyle(document.body).fontFamily,
    fontsStatus:document.fonts.status, zoom:visualViewport.scale,
    reducedTransparency:matchMedia('(prefers-reduced-transparency: reduce)').matches})`);
  const placement = await placementChecks(cdp);
  console.log(JSON.stringify({ step: 'placement', cases: placement.length, resized: 3 }));
  const modality = await modalityChecks(cdp);
  console.log(JSON.stringify({ step: 'modality', result: modality }));
  const outside = await outsideChecks(cdp);
  const radixHandlers = await radixHandlerChecks(cdp);
  const pending = await pendingChecks(cdp);
  console.log(
    JSON.stringify({
      step: 'pending',
      activationCases: pending.cases.length,
      blockedEscape: pending.blockedEscape,
      unlockedCancel: pending.unlockedCancel,
      explicitDisabled: pending.explicitDisabled
    })
  );
  const stacking = await stackingChecks(cdp);
  const workflow = await asyncChecks(cdp);
  assert.deepEqual(cdp.exceptions, [], 'Browser runtime exceptions');
  console.log(
    JSON.stringify(
      {
        harnessSHA256: createHash('sha256')
          .update(await readFile(fileURLToPath(import.meta.url)))
          .digest('hex'),
        version,
        environment,
        fixture: 'source-built CSS and JS; SSR shell hydrated on client',
        network: 'HTTP(S) blocked',
        placement,
        modality,
        outside,
        radixHandlers,
        pending: {
          activationCases: pending.cases.length,
          blockedEscape: pending.blockedEscape,
          unlockedCancel: pending.unlockedCancel,
          explicitDisabled: pending.explicitDisabled
        },
        stacking: {
          paintedSamples: stacking.samples.length,
          pointerSequences: stacking.hits.length,
          actionSequences: stacking.actionHits.length,
          motion: ['no-preference', 'reduce'],
          hosts: [440, 360]
        },
        workflow
      },
      null,
      2
    )
  );
} finally {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
  if (browser && browser.exitCode === null && browser.signalCode === null) {
    browser.kill('SIGTERM');
    await Promise.race([new Promise((resolveExit) => browser.once('exit', resolveExit)), delay(5000)]);
    if (browser.exitCode === null && browser.signalCode === null) {
      browser.kill('SIGKILL');
      await new Promise((resolveExit) => browser.once('exit', resolveExit));
    }
  }
  await rm(scratch, { recursive: true, force: true });
}
