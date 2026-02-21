import 'server-only';

export function getServerEnv(name: string, fallback = ''): string {
  return process.env[name] ?? fallback;
}

export function getRequiredServerEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required server env var: ${name}`);
  }
  return value;
}
