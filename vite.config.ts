import { defineConfig, loadEnv, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [react(), tailwindcss()];

  // Optional: source-tagging plugin used by the Arena preview environment.
  // Loaded dynamically so its absence (in a plain clone) does not break the build.
  // We require synchronously via a createRequire shim so the config stays
  // synchronous and plays nicely with Vite's type inference.
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const m = require('./.vite-source-tags.js') as { sourceTags: () => PluginOption };
    if (m && typeof m.sourceTags === 'function') {
      plugins.push(m.sourceTags());
    }
  } catch {
    // intentionally silent – file is only present in Arena-generated sandboxes
  }

  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_']);

  const processEnvDefines: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  }

  // Allow overriding the base path via VITE_BASE (e.g. "/Conic-Vortex/" for Pages)
  // Defaults to "./" so the build works when opened from any subpath or file://.
  const base = env.VITE_BASE ?? './';

  return {
    plugins,
    base,
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
    server: {
      host: true,
      // Allow Arena preview proxies and any host in development – this is a
      // static art piece with no authentication, so host allowlisting is not
      // a security boundary.
      allowedHosts: true,
    },
    preview: {
      host: true,
      allowedHosts: true,
    },
    build: {
      target: 'es2022',
      sourcemap: mode !== 'production',
      chunkSizeWarningLimit: 800,
    },
  };
});
