const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const sourcePath = path.join(__dirname, '..', 'dist');
const outputPath = path.join(__dirname, '..', 'pack');

// packディレクトリがない場合は作成
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

const manifest = fs.readFileSync(path.join(sourcePath, 'manifest.json'));
const zipName = `x-bookmark-tweaks_v${JSON.parse(manifest).version}.zip`;

// すでに同名のzipがある場合は削除
const zipPath = path.join(outputPath, zipName);
if (fs.existsSync(zipPath)) {
  fs.rmSync(zipPath);
}

const archive = archiver('zip', {
  zlib: { level: 9 },
});

const output = fs.createWriteStream(zipPath);

archive.pipe(output);
archive.directory(sourcePath, false);
archive.finalize();
