import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

function findFilesRecursively(dir: string, extensions: string[]): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.expo') {
        results = results.concat(findFilesRecursively(fullPath, extensions));
      }
    } else {
      if (extensions.some(ext => file.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

describe('Kiểm toán Mã Màu Hex (Design Tokens Audit - REQ-12)', () => {
  it('tuyệt đối KHÔNG có bất kỳ mã màu hex nào ngoài constants/colors.ts', () => {
    const rootDir = path.resolve(__dirname, '..');
    const targetDirs = ['app', 'components', 'hooks', 'services', 'store', 'utils'];

    const scannedFiles: string[] = [];
    for (const d of targetDirs) {
      scannedFiles.push(...findFilesRecursively(path.join(rootDir, d), ['.ts', '.tsx']));
    }

    const hexRegex = /#[0-9a-fA-F]{3,8}\b/g;
    const violations: { file: string; match: string }[] = [];

    for (const file of scannedFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.match(hexRegex);
      if (matches) {
        for (const m of matches) {
          violations.push({ file: path.relative(rootDir, file), match: m });
        }
      }
    }

    expect(violations).toEqual([]);
  });
});

