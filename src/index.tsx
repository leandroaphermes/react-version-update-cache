import * as React from 'react';

const defaultProps = {
  duration: 60 * 1000,
  auto: false,
  basePath: '',
  filename: 'meta.json',
};

type Result = {
  loading: boolean,
  isLatestVersion: boolean,
  emptyCacheStorage: (version?:string | undefined) => Promise<void>
}

type ProviderProps = {
  duration?: number,
  auto?: boolean,
  storageKeyVersion: string,
  basePath?: string,
  filename?: string,
  children?: any,
};


let fetchCacheTimeout: any;

const VersionUpdateCacheContext = React.createContext({ } as Result)

export const useVersionUpdateCacheCtx = () => React.useContext(VersionUpdateCacheContext)


export const VersionUpdateCacheProvider: React.FC<ProviderProps> = (props) => {
  const { children, ...otherProps } = props
  const result = useVersionUpdateCache(otherProps)
  return (
    <VersionUpdateCacheContext.Provider value={result} >
      {children}
    </VersionUpdateCacheContext.Provider>
  )
}


export const useVersionUpdateCache = (props: ProviderProps) => {
  const { duration, auto, storageKeyVersion, basePath, filename } = React.useMemo<ProviderProps>( () => ({
    ...defaultProps,
    ...props
  }), [ defaultProps, props ]);

  const [loading, setLoading] = React.useState(true);
  const [appVersion, setAppVersion] = React.useState(storageKeyVersion);
  const [isLatestVersion, setIsLatestVersion] = React.useState(true);
  const [latestVersion, setLatestVersion] = React.useState(appVersion);

  const emptyCacheStorage = async (version?: string) => {
    if ('caches' in window) {
      // Service worker cache should be cleared with caches.delete()
      const cacheKeys = await window.caches.keys();
      await Promise.all(cacheKeys.map(key => {
        window.caches.delete(key)
      }));
    }

    // clear browser cache and reload page
    setAppVersion(version || latestVersion);
    window.location.replace(window.location.href);
  };

  // Replace any last slash with an empty space
  const baseUrl = basePath?.replace(/\/+$/, '') + '/' + filename;

  const fetchMeta = () => {
    try {
      fetch(baseUrl, {
        cache: 'no-store'
      })
        .then(response => response.json())
        .then(meta => {
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
  }

  const startVersionCheck = React.useRef(() => {});
  const stopVersionCheck = React.useRef(() => {});

  startVersionCheck.current = () => {
    console.log("on startVersionCheck", this)
    if (window.navigator.onLine) {
      fetchCacheTimeout = setInterval(() => fetchMeta(), duration);
    }
  };

  stopVersionCheck.current = () => {
    console.log("on stopVersionCheck", this)
    clearInterval(fetchCacheTimeout);
  };

  React.useEffect(() => {
    window.addEventListener('focus', startVersionCheck.current);
    window.addEventListener('blur', stopVersionCheck.current);
    () => {
      window.removeEventListener('focus', startVersionCheck.current);
      window.removeEventListener('blur', stopVersionCheck.current);
    };
  }, []);

  React.useEffect(() => {
    fetchMeta();
  }, [ ]);

  return {
    loading,
    isLatestVersion,
    emptyCacheStorage,
    latestVersion
  };
};

const VersionUpdateCache: React.FC<ProviderProps> = props => {
  const { loading, isLatestVersion, emptyCacheStorage } = useVersionUpdateCache(props);

  const { children } = props;

  return children({
    loading,
    isLatestVersion,
    emptyCacheStorage
  });
};

export default VersionUpdateCache;