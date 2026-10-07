"""Genera docs/catalog.json y docs/CATALOGO.md a partir de scripts/catalog_data.py."""
import json, pathlib, collections
from catalog_data import C

ROOT = pathlib.Path(__file__).resolve().parent.parent
keys = ["actual", "nivelActual", "nombre", "nivel", "destino", "radix", "compone", "accion", "notas"]
rows = [dict(zip(keys, r)) for r in C]
(ROOT / "docs/catalog.json").write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

TIERS = [("primitive", "Primitivas"), ("atom", "Átomos"), ("molecule", "Moléculas"), ("organism", "Organismos"), ("template", "Plantillas")]
DEST = [("ui", "@egdev/ui"), ("effects", "@egdev/effects"), ("mando", "Mando"), ("cadencia", "Cadencia"), ("web", "Web (egdev.es)")]

def esc(s): return s.replace("|", "\\|")

out = ["# Catálogo de componentes", "",
       "Aproximación de cómo encaja cada componente de EGDEV Foundation en la nueva arquitectura: nivel, paquete y primitiva de Radix sobre la que se construye.",
       "No es definitivo: es el punto de partida para recatalogar con la skill `component-cataloging`.", "",
       "Se genera con `python scripts/build_catalog.py` a partir de `scripts/catalog_data.py`. Edita los datos, no este archivo.", ""]

cnt = collections.Counter(r["accion"] for r in rows)
dcnt = collections.Counter(r["destino"] for r in rows)
out += ["## Resumen", "",
        "| Acción | Componentes |", "|---|---|"] + [f"| {a} | {n} |" for a, n in sorted(cnt.items(), key=lambda x: -x[1])] + [""]
out += ["| Destino | Componentes |", "|---|---|"] + [f"| {lbl} | {dcnt.get(d, 0)} |" for d, lbl in DEST] + [""]
out += ["Leyenda de acciones: **mantener** (sigue igual), **renombrar**, **separar** (un componente se parte en varios), **extraer** (sale una pieza nueva de otro), **fusionar** (dos o más pasan a uno), **absorber** (pasa a ser variante o preset de otro), **mover** (cambia de paquete), **nuevo** (falta y hace falta).", ""]

for d, lbl in DEST:
    sub = [r for r in rows if r["destino"] == d]
    if not sub: continue
    out += [f"## {lbl}", ""]
    for t, tl in TIERS:
        tr = [r for r in sub if r["nivel"] == t]
        if not tr: continue
        out += [f"### {tl}", "", "| Componente | Antes | Radix | Compone | Acción | Notas |", "|---|---|---|---|---|---|"]
        for r in tr:
            antes = "—" if r["actual"] == "—" else f'{r["actual"]} ({r["nivelActual"]})'
            out.append(f'| **{esc(r["nombre"])}** | {esc(antes)} | {esc(r["radix"])} | {esc(r["compone"])} | {r["accion"]} | {esc(r["notas"])} |')
        out.append("")

used = sorted({p.strip() for r in rows for p in r["radix"].replace("(", "/").replace(")", "/").replace("+", "/").split("/")
               if p.strip() and p.strip()[0].isupper() and " " not in p.strip() and not p.strip().endswith(".Item")})
out += ["## Primitivas de Radix que se usan", "", ", ".join(f"`{u}`" for u in used), "",
        "Todas vienen del paquete unificado `radix-ui` (`import { Tabs } from 'radix-ui'`).", ""]
(ROOT / "docs/CATALOGO.md").write_text("\n".join(out), encoding="utf-8")
print(len(rows), "filas", dict(dcnt), dict(cnt))
