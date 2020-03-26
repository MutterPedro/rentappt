export function requiredEnvVar(varName: string): string | never {
  console.error('\x1b[31m%s\x1b[0m', `⚠️  Required environment variable "${varName}" is missing.`);

  process.exit(1);
}
