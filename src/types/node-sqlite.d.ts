// @types/node in this project (v20) predates Node's built-in `node:sqlite`
// module (available at runtime here since we're on Node 22+). This declares
// just the surface this project uses.
declare module "node:sqlite" {
  export interface StatementResultingChanges {
    lastInsertRowid: number | bigint;
    changes: number | bigint;
  }

  export class StatementSync {
    run(...params: unknown[]): StatementResultingChanges;
    get(...params: unknown[]): unknown;
    all(...params: unknown[]): unknown[];
  }

  export interface DatabaseSyncOptions {
    open?: boolean;
    readOnly?: boolean;
  }

  export class DatabaseSync {
    constructor(location: string, options?: DatabaseSyncOptions);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
