export class IdempotencyStore {
  private readonly seen = new Set<string>();

  /** true = primeira vez (pode processar); false = duplicada. */
  tryAcquire(key: string): boolean {
    if (this.seen.has(key)) return false;
    this.seen.add(key);
    return true;
  }

  release(key: string) {
    this.seen.delete(key);
  }
}