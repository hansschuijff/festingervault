import { execSync } from 'child_process';
import { resolve } from 'path';
import glob from 'glob';
import { copyFileSync, mkdirSync } from 'fs';
import { PluginOption, ResolvedConfig } from 'vite';

export default function copyFilesPlugin(): PluginOption{
	let config: ResolvedConfig;
  return {
    name: 'vite-plugin-copy-files',
    apply: 'build',
    configResolved(config) {
      const isDist = config.command === 'build' && config.mode === 'production' && process.argv.includes('--dist');

      if (isDist) {
        const files = glob.sync(
          [
            'admin/**',
            'build/**',
            'includes/**',
            'languages/**',
            'public/**',
            `${config.root}.php`,
            'uninstall.php',
            'block.json',
            'changelog.*',
            'license.*',
            'readme.*',
          ],
          {
            nocase:true
          },
        );

        files.forEach(file => {
          const destPath = resolve(config.root, 'dist', file);
          const dir = resolve(destPath, '..');
          mkdirSync(dir, { recursive: true });
          copyFileSync(file, destPath);
        });

        console.log('Files copied to the dist folder.');
      }
    },
  };
}
