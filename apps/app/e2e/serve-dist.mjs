import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';

const contentTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
};

function findPage(folder, segments) {
  if (segments.length === 0) {
    return join(folder, 'index.html');
  }
  const [segment, ...rest] = segments;
  if (rest.length === 0) {
    const page = [`${segment}.html`, '[page].html', '[task].html'].find(
      (name) => existsSync(join(folder, name)),
    );
    return page ? join(folder, page) : undefined;
  }
  const subfolder = readdirSync(folder).find(
    (name) =>
      statSync(join(folder, name)).isDirectory() &&
      (name === segment || name.startsWith('[')),
  );
  return subfolder ? findPage(join(folder, subfolder), rest) : undefined;
}

export function serveDist(distFolder) {
  const server = createServer((request, response) => {
    const path = decodeURIComponent(new URL(request.url, 'http://x').pathname);
    const asset = join(distFolder, path);
    const isAsset =
      extname(path) !== '' && existsSync(asset) && statSync(asset).isFile();
    const file =
      (isAsset ? asset : undefined) ??
      findPage(distFolder, path.split('/').filter(Boolean)) ??
      join(distFolder, '+not-found.html');

    response.writeHead(200, {
      'content-type': contentTypes[extname(file)] ?? 'text/plain',
      'cross-origin-embedder-policy': 'credentialless',
      'cross-origin-opener-policy': 'same-origin',
    });
    response.end(readFileSync(file));
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () =>
      resolve({
        url: `http://127.0.0.1:${server.address().port}`,
        close: () => server.close(),
      }),
    );
  });
}
