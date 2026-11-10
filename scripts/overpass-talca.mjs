// Lista lugares con nombre de Talca desde OpenStreetMap (Overpass) para curar data/lugares.src.tsv con datos reales.
import fs from 'node:fs';
const b = '-35.47,-71.72,-35.38,-71.60';
const q = `[out:json][timeout:90];(
nwr["name"]["tourism"~"attraction|museum|gallery|viewpoint|artwork"](${b});
nwr["name"]["historic"](${b});
nwr["name"]["amenity"~"theatre|arts_centre|cafe|restaurant|bar|pub|ice_cream|marketplace|place_of_worship|library"](${b});
nwr["name"]["leisure"~"park|stadium|garden"](${b});
nwr["name"]["shop"~"mall|department_store"](${b});
);out center tags;`;
for (const host of ['https://overpass-api.de', 'https://overpass.private.coffee']) {
  try {
    const r = await fetch(host + '/api/interpreter', { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': 'mapa-talca-dev/1.0', accept: 'application/json' } });
    if (!r.ok) { console.error(host, r.status); continue; }
    const j = await r.json();
    const rows = j.elements.map((e) => { const t = e.tags, c = e.center ?? e; return [t.tourism || (t.historic && 'hist:' + t.historic) || t.amenity || t.leisure || t.shop, t.name, c.lat.toFixed(4), c.lon.toFixed(4), t.website ?? ''].join('|'); }).sort();
    console.log(rows.length + '\n' + rows.join('\n')); break;
  } catch (e) { console.error(host, e.message); }
}
