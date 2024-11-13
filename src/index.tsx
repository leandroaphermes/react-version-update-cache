import React from "react";

const defaultProps = {
  duration: 60 * 1000,
  auto: false,
  basePath: "",
  filename: "meta.json",
  fetchHeaders: undefined,
};

type Result = {
  loading: boolean;
  isLatestVersion: boolean;
  latestVersion: string;
  emptyCacheStorage: (version?: string | undefined) => Promise<void>;
};

type ProviderProps = {
  duration?: number;
  auto?: boolean;
  storageKeyVersion: string;
  basePath?: string;
  filename?: string;
  children?: any;
  fetchHeaders?: Headers;
};

const VersionUpdateCacheContext = React.createContext({} as Result);

export const useVersionUpdateCacheCtx = () =>
  React.useContext(VersionUpdateCacheContext);

export const VersionUpdateCacheProvider: React.FC<ProviderProps> = (props) => {
  const { children, ...otherProps } = props;
  const result = useVersionUpdateCache(otherProps);
  return (
    <VersionUpdateCacheContext.Provider value={result}>
      {children}
    </VersionUpdateCacheContext.Provider>
  );
};

export const useVersionUpdateCache = (props: ProviderProps) => {
  const {
    duration,
    auto,
    storageKeyVersion,
    basePath,
    filename,
    fetchHeaders,
  } = React.useMemo<ProviderProps>(
    () => ({
      ...defaultProps,
      ...props,
    }),
    [props]
  );

  const [loading, setLoading] = React.useState(true);
  const [appVersion, setAppVersion] = React.useState(storageKeyVersion);
  const [isLatestVersion, setIsLatestVersion] = React.useState(true);
  const [latestVersion, setLatestVersion] = React.useState(appVersion);

  const emptyCacheStorage = React.useCallback(
    async (version?: string) => {
      if ("caches" in window) {
        // Service worker cache should be cleared with caches.delete()
        const cacheKeys = await window.caches.keys();
        await Promise.all(
          cacheKeys.map((key) => {
            window.caches.delete(key);
          })
        );
      }

      // clear browser cache and reload page
      setAppVersion(version || latestVersion);
      window.location.reload();
    },
    [latestVersion]
  );
  // Replace any last slash with an empty space
  const baseUrl = basePath?.replace(/\/+$/, "") + "/" + filename;

  const fetchMeta = React.useCallback(() => {
    try {
      fetch(baseUrl, {
        cache: "no-store",
        headers: fetchHeaders,
      })
        .then((response) => response.json())
        .then((meta) => {
          const newVersion = meta.version;
          const isUpdated = newVersion === appVersion;
          if (!isUpdated && !auto) {
            setLatestVersion(newVersion);
            setLoading(false);
            if (appVersion) {
              setIsLatestVersion(false);
            } else {
              setAppVersion(newVersion);
            }
          } else if (!isUpdated && auto) {
            emptyCacheStorage(newVersion);
          } else {
            setIsLatestVersion(true);
            setLoading(false);
          }
        });
    } catch (err) {
      console.error(err);
    }
  }, [appVersion, auto, fetchHeaders, emptyCacheStorage]);

  React.useEffect(() => {
    let refinterval: any = undefined;

    const startCheckInterval = () => {
      if (window.navigator.onLine) {
        refinterval = setInterval(() => fetchMeta(), duration);
      }
    };

    const stopCheckInterval = () => {
      if (refinterval) clearInterval(refinterval);
    };

    window.addEventListener("focus", startCheckInterval);
    window.addEventListener("blur", stopCheckInterval);
    () => {
      window.removeEventListener("focus", startCheckInterval);
      window.removeEventListener("blur", stopCheckInterval);
    };
  }, [fetchMeta, duration]);

  React.useEffect(() => {
    fetchMeta();
  }, [fetchMeta]);

  return {
    loading,
    isLatestVersion,
    emptyCacheStorage,
    latestVersion,
  };
};

const VersionUpdateCache: React.FC<ProviderProps> = ({
  children,
  ...restProps
}) => {
  const { loading, isLatestVersion, emptyCacheStorage, latestVersion } =
    useVersionUpdateCache(restProps);

  return children({
    loading,
    isLatestVersion,
    latestVersion,
    emptyCacheStorage,
  });
};

export default VersionUpdateCache;
