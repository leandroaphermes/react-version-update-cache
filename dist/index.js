var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from "react";
var defaultProps = {
    duration: 60 * 1000,
    auto: false,
    basePath: "",
    filename: "meta.json",
    fetchHeaders: undefined,
};
var VersionUpdateCacheContext = React.createContext({});
export var useVersionUpdateCacheCtx = function () {
    return React.useContext(VersionUpdateCacheContext);
};
export var VersionUpdateCacheProvider = function (props) {
    var children = props.children, otherProps = __rest(props, ["children"]);
    var result = useVersionUpdateCache(otherProps);
    return (React.createElement(VersionUpdateCacheContext.Provider, { value: result }, children));
};
export var useVersionUpdateCache = function (props) {
    var _a = React.useMemo(function () { return (__assign(__assign({}, defaultProps), props)); }, [props]), duration = _a.duration, auto = _a.auto, storageKeyVersion = _a.storageKeyVersion, basePath = _a.basePath, filename = _a.filename, fetchHeaders = _a.fetchHeaders;
    var _b = React.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = React.useState(storageKeyVersion), appVersion = _c[0], setAppVersion = _c[1];
    var _d = React.useState(true), isLatestVersion = _d[0], setIsLatestVersion = _d[1];
    var _e = React.useState(appVersion), latestVersion = _e[0], setLatestVersion = _e[1];
    var emptyCacheStorage = React.useCallback(function (version) { return __awaiter(void 0, void 0, void 0, function () {
        var cacheKeys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!("caches" in window)) return [3 /*break*/, 3];
                    return [4 /*yield*/, window.caches.keys()];
                case 1:
                    cacheKeys = _a.sent();
                    return [4 /*yield*/, Promise.all(cacheKeys.map(function (key) {
                            window.caches.delete(key);
                        }))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    // clear browser cache and reload page
                    setAppVersion(version || latestVersion);
                    window.location.reload();
                    return [2 /*return*/];
            }
        });
    }); }, [latestVersion]);
    // Replace any last slash with an empty space
    var baseUrl = (basePath === null || basePath === void 0 ? void 0 : basePath.replace(/\/+$/, "")) + "/" + filename;
    var fetchMeta = React.useCallback(function () {
        try {
            fetch(baseUrl, {
                cache: "no-store",
                headers: fetchHeaders,
            })
                .then(function (response) { return response.json(); })
                .then(function (meta) {
                var newVersion = meta.version;
                var isUpdated = newVersion === appVersion;
                if (!isUpdated && !auto) {
                    setLatestVersion(newVersion);
                    setLoading(false);
                    if (appVersion) {
                        setIsLatestVersion(false);
                    }
                    else {
                        setAppVersion(newVersion);
                    }
                }
                else if (!isUpdated && auto) {
                    emptyCacheStorage(newVersion);
                }
                else {
                    setIsLatestVersion(true);
                    setLoading(false);
                }
            });
        }
        catch (err) {
            console.error(err);
        }
    }, [appVersion, auto, fetchHeaders, emptyCacheStorage]);
    React.useEffect(function () {
        var refinterval = undefined;
        var startCheckInterval = function () {
            if (window.navigator.onLine) {
                refinterval = setInterval(function () { return fetchMeta(); }, duration);
            }
        };
        var stopCheckInterval = function () {
            if (refinterval)
                clearInterval(refinterval);
        };
        window.addEventListener("focus", startCheckInterval);
        window.addEventListener("blur", stopCheckInterval);
        (function () {
            window.removeEventListener("focus", startCheckInterval);
            window.removeEventListener("blur", stopCheckInterval);
        });
    }, [fetchMeta, duration]);
    React.useEffect(function () {
        fetchMeta();
    }, [fetchMeta]);
    return {
        loading: loading,
        isLatestVersion: isLatestVersion,
        emptyCacheStorage: emptyCacheStorage,
        latestVersion: latestVersion,
    };
};
var VersionUpdateCache = function (_a) {
    var children = _a.children, restProps = __rest(_a, ["children"]);
    var _b = useVersionUpdateCache(restProps), loading = _b.loading, isLatestVersion = _b.isLatestVersion, emptyCacheStorage = _b.emptyCacheStorage, latestVersion = _b.latestVersion;
    return children({
        loading: loading,
        isLatestVersion: isLatestVersion,
        latestVersion: latestVersion,
        emptyCacheStorage: emptyCacheStorage,
    });
};
export default VersionUpdateCache;
