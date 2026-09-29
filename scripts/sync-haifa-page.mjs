import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlFile = path.join(root, 'workshops/haifa.html');
const pagePath = path.join(root, 'app/workshops/haifa/page.jsx');

const html = fs.readFileSync(htmlFile, 'utf8');
const mainMatch = html.match(/<main class="haifa-main">([\s\S]*?)<\/main>/);
if (!mainMatch) throw new Error('main not found in workshops/haifa.html');

let main = `<main class="haifa-main ny-inner">${mainMatch[1]}</main>`;
main = main.replace(/\.\.\/public\/media\//g, '/media/');

main = main.replace(/href="\.\.\/index\.html#programs"/g, 'href="/yoga"');

let page = fs.readFileSync(pagePath, 'utf8');
page = page.replace(/html=\{[\s\S]*?\}\s*\/>/, `html={${JSON.stringify(main)}}\n    />`);
fs.writeFileSync(pagePath, page);
console.log('Synced app/workshops/haifa/page.jsx from workshops/haifa.html');
