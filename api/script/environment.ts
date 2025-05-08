

export function getTempDirectory(): string {
  return process.env.TEMP || process.env.TMPDIR;
}
