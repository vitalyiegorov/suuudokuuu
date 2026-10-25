declare module '@effect/wa-sqlite/src/examples/AccessHandlePoolVFS.js' {
    export const AccessHandlePoolVFS: {
        create(name: string, module: unknown): Promise<SQLiteVFS>;
    };
}
