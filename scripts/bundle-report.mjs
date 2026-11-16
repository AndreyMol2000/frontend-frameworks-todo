import { readdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';
const dir = 'dist/spa/assets';
const files = await readdir(dir);
const rows = await Promise.all(files.map(async (name) => {
  const bytes = (await stat(join(dir, name))).size;
  const gzip = gzipSync(await readFile(join(dir, name))).length;
  return { name, bytes, gzip };
}));
await writeFile('dist/bundle-report.json', JSON.stringify(rows, null, 2));
process.stdout.write(rows.map((row) => `${row.name}: ${(row.bytes / 1024).toFixed(1)} KB; gzip ${(row.gzip / 1024).toFixed(1)} KB`).join('\n') + '\n');
