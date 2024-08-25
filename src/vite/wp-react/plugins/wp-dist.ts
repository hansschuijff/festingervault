import { execSync } from 'child_process';
import { resolve } from 'path';
import glob from 'glob';
import { copyFileSync, mkdirSync } from 'fs';
import { PluginOption, ResolvedConfig } from 'vite';

export default function WPDist(): PluginOption{
	let config: ResolvedConfig;
  return {
    name: 'vite-build-trunk-release',
		enforce:"post",
    apply: 'build',
    configResolved(config) {
      const isDist = config.command === 'build' && config.mode === 'production';

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
            nocase:true,
						nodir:true,
          },
        );

        files.forEach(file => {
          const destPath = resolve(config.root, 'trunk', file);
          const dir = resolve(destPath, '..');
          mkdirSync(dir, { recursive: true });
          copyFileSync(file, destPath);
        });
        console.log('Files copied to the dist folder.');
      }
    },
  };
}
