export const LegacyKvStoreConstant = {
    databaseName: 'ExpoSQLiteStorage',
    deletePersistedRootSql: "DELETE FROM storage WHERE key = 'persist:root'",
    selectPersistedRootSql: "SELECT value FROM storage WHERE key = 'persist:root'",
    webDirectoryName: 'expo-sqlite'
} as const;
