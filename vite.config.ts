import { defineConfig, loadEnv, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Load the optional source-tagging plugin that stamps every compiled JSX node
 * with a `data-source-loc="file:line:col"` attribute. This powers source-aware
 * tooling (hover-to-reveal, WYSIWYG editing) that lives outside the app itself.
 * The file may be absent in stripped-down copies, so its absence is tolerated.
 */
async function loadSourceTagsPlugin(): Promise<PluginOption> {
  try {
    // Plain-JS dotfile without bundled types; it may be absent in slim copies.
    // @ts-expect-error — no ambient types exist for the optional plugin file.
    const { sourceTags } = await import('./.vite-source-tags.js');
    return typeof sourceTags === 'function' ? (sourceTags() as PluginOption) : null;
  } catch {
    return null;
  }
}

export default defineConfig(async ({ mode }) => {
  // Env centralization: expose VITE_*/NEXT_PUBLIC_* as process.env.* and import.meta.env.
  // The app itself reads no environment, but consumer code/tooling may rely on
  // these defines, so they are populated here once rather than scattered around.
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_']);

  const processEnvDefines: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  }

  const sourceTags = await loadSourceTagsPlugin();
  const plugins: PluginOption[] = [react(), tailwindcss()];
  if (sourceTags) plugins.push(sourceTags);

  // Allow the dev server to accept preview/forwarded hosts (used by sandboxed
  // live-preview environments). Leave unset for plain local development.
  const devAllowedHosts = process.env.VITE_DEV_ALLOWED_HOSTS
    ? process.env.VITE_DEV_ALLOWED_HOSTS.split(',').map((h) => h.trim())
    : undefined;

  return {
    plugins,
    // Allow overriding the served base path (e.g. `/Conic-Vortex/` on GitHub
    // Pages project sites) without touching code. Defaults to `/`.
    base: process.env.VITE_BASE || env.VITE_BASE || '/',
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
    build: {
      // Three.js is split into a lazy, on-demand chunk (~528 kB raw, ~134 kB
      // gzip). It is intentionally large and never part of the initial bundle,
      // so raise the default 500 kB warning threshold to match reality.
      chunkSizeWarningLimit: 600,
    },
    server: {
      host: true,
      allowedHosts: devAllowedHosts,
    },
  };
});
