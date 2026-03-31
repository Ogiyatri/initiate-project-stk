function getPublicEnv(key: string, defaultValue: string = ''): string {
  if (typeof window !== 'undefined') {
    // Client-side: use window.__ENV__ or process.env
    return process.env[key] ?? defaultValue;
  }
  // Server-side
  return process.env[key] ?? defaultValue;
}

export const config = {
  urls: {
    api: getPublicEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3000'),
  },
  app: {
    name: getPublicEnv('NEXT_PUBLIC_APP_NAME', 'STK'),
  },
} as const;

export default config;
