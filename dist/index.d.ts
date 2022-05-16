import * as React from "react";
declare type Result = {
    loading: boolean;
    isLatestVersion: boolean;
    latestVersion: string;
    emptyCacheStorage: (version?: string | undefined) => Promise<void>;
};
declare type ProviderProps = {
    duration?: number;
    auto?: boolean;
    storageKeyVersion: string;
    basePath?: string;
    filename?: string;
    children?: any;
    fetchHeaders?: Headers;
};
export declare const useVersionUpdateCacheCtx: () => Result;
export declare const VersionUpdateCacheProvider: React.FC<ProviderProps>;
export declare const useVersionUpdateCache: (props: ProviderProps) => {
    loading: boolean;
    isLatestVersion: boolean;
    emptyCacheStorage: (version?: string | undefined) => Promise<void>;
    latestVersion: string;
};
declare const VersionUpdateCache: React.FC<ProviderProps>;
export default VersionUpdateCache;
