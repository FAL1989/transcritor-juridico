/** @type {import('next').NextConfig} */
// Resolve base da API a partir de string ou JSON array (tolerante a configuração incorreta)
function resolveApiBase() {
  let raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      raw = String(parsed[0]);
    }
  } catch {
    // mantém raw como string
  }
  // remover barra final para concatenar ":path*" corretamente
  return raw.replace(/\/$/, '');
}

const API_BASE = resolveApiBase();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_BASE}/:path*`,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: API_BASE,
  },
};

module.exports = nextConfig;