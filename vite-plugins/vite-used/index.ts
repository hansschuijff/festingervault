import { Plugin, ResolvedConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default function usedDependenciesPlugin(): Plugin {
  const usedDependencies = new Set<string>();
  let viteConfig: ResolvedConfig;

  function writeUsedDependencies() {
    const outputPath = path.resolve(viteConfig.root, 'used-dependencies.json');
    const usedDependenciesArray = Array.from(usedDependencies);
    fs.writeFileSync(outputPath, JSON.stringify(usedDependenciesArray, null, 2));
    console.log(`Used dependencies have been written to ${outputPath}`);
  }

  return {
    name: 'vite-plugin-used-dependencies',
    apply: 'serve', // Use 'build' if only needed during build
    configResolved(config) {
      viteConfig = config;
    },
    buildStart() {
      usedDependencies.clear();
    },
    resolveId(source) {
      if (source && !source.startsWith('.') && !source.startsWith('/')) {
        usedDependencies.add(source);
      }
      return null;
    },
    generateBundle() {
      writeUsedDependencies();
    },
    handleHotUpdate() {
      writeUsedDependencies();
    }
  };
}
