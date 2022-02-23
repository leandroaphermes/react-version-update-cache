# react-version-update-cache

Validate application version and notify you if you have a new version sent

### Configs

| Property          | Type   | Description                  | Default    |
| ----------------- | ------ | ---------------------------- | ---------- |
| storageKeyVersion | string | Current app version variable | required   |
| duration          | number | Check update time interval   | 60 seconds |
| basePath          | string | Endpoint exist to filename   | /          |
| filename          | string | Name file to endpoint        | meta.json  |

### Props Return

| Property          | Type     | Description                                    |
| ----------------- | -------- | ---------------------------------------------- |
| islatestVersion   | boolean  | Return `true` or `false` if app latest version |
| latestVersion     | string   | Current app version                            |
| loading           | boolean  | Update status                                  |
| emptyCacheStorage | function | Click to start update                          |

### Example Implementation based hook

```jsx
import { useVersionUpdateCache } from "react-version-update-cache";

function App() {
  const { isLatestVersion, emptyCacheStorage, latestVersion } =
    useVersionUpdateCache({
      duration: 300 * 1000,
      storageKeyVersion: process.env.REACT_APP_VERSION,
    });

  return (
    <div>
      <h4>My App component</h4>
      {!isLatestVersion && (
        <div>
          <p>New version available</p>
          <button onClick={() => emptyCacheStorage()}>Update Now</button>
        </div>
      )}
    </div>
  );
}
```

### Example Implementation based Context

```jsx
import VersionUpdateCacheProvider from "react-version-update-cache";

function App() {
  const { isLatestVersion, emptyCacheStorage } = useVersionUpdateCache({
    duration: 300 * 1000,
    storageKeyVersion: process.env.REACT_APP_VERSION,
  });

  return (
    <div>
      <h4>My App component</h4>
      <VersionUpdateCacheProvider>
        {({ isLatestVersion, emptyCacheStorage }) => {
          return !isLatestVersion ? (
            <div>
              <p>New version available</p>
              <button onClick={() => emptyCacheStorage()}>Update Now</button>
            </div>
          ) : (
            <LayoutAppRoutes />
          );
        }}
        }
      </VersionUpdateCacheProvider>
    </div>
  );
}
```
