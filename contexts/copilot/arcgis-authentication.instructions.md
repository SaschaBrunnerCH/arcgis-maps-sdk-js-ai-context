---
applyTo: "**/*.{js,ts,jsx,tsx,html}"
---

# ArcGIS Maps SDK - Authentication

## OAuth 2.0 Authentication

### Basic OAuth Setup
```javascript
import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";

const oauthInfo = new OAuthInfo({
  appId: "YOUR_APP_ID",
  popup: false  // false = redirect, true = popup
});

esriId.registerOAuthInfos([oauthInfo]);
```

### Check Sign-In Status
```javascript
async function checkSignIn() {
  try {
    await esriId.checkSignInStatus(oauthInfo.portalUrl + "/sharing");
    const portal = new Portal({ authMode: "immediate" });
    await portal.load();
    console.log("Signed in as:", portal.user.username);
    return portal;
  } catch {
    console.log("Not signed in");
    return null;
  }
}
```

### Sign In
```javascript
async function signIn() {
  const credential = await esriId.getCredential(
    oauthInfo.portalUrl + "/sharing"
  );
  return credential;
}
```

### Sign Out
```javascript
function signOut() {
  esriId.destroyCredentials();
  window.location.reload();
}
```

### OAuth Component
```html
<arcgis-oauth app-id="YOUR_APP_ID"></arcgis-oauth>

<script type="module">
  const oauth = document.querySelector("arcgis-oauth");
  oauth.addEventListener("arcgisSignIn", (e) => console.log(e.detail.credential));
  oauth.addEventListener("arcgisSignOut", () => console.log("Signed out"));
</script>
```

## API Keys

```javascript
import esriConfig from "@arcgis/core/config.js";

esriConfig.apiKey = "YOUR_API_KEY";

const map = new Map({
  basemap: "arcgis/streets"  // Requires API key
});
```

### API Key in HTML
```html
<script>
  window.esriConfig = { apiKey: "YOUR_API_KEY" };
</script>
<script src="https://js.arcgis.com/4.34/"></script>
```

## Enterprise Portal

```javascript
const oauthInfo = new OAuthInfo({
  appId: "YOUR_APP_ID",
  portalUrl: "https://your-portal.com/portal",
  popup: true
});

// Or set globally
import esriConfig from "@arcgis/core/config.js";
esriConfig.portalUrl = "https://your-portal.com/portal";
```

## Portal User Information

```javascript
import Portal from "@arcgis/core/portal/Portal.js";

const portal = new Portal({ authMode: "immediate" });
await portal.load();

console.log("Username:", portal.user.username);
console.log("Full name:", portal.user.fullName);
console.log("Email:", portal.user.email);
console.log("Role:", portal.user.role);
console.log("Org:", portal.name);
```

## Query User Items

```javascript
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams.js";

const queryParams = new PortalQueryParams({
  query: `owner:${portal.user.username}`,
  sortField: "modified",
  sortOrder: "desc",
  num: 20
});

const result = await portal.queryItems(queryParams);
result.results.forEach(item => console.log(item.title, item.type));
```

## Token Management

```javascript
// Get token
const credential = await esriId.getCredential("https://services.arcgis.com/...");
console.log("Token:", credential.token);
console.log("Expires:", new Date(credential.expires));

// Register token
esriId.registerToken({
  server: "https://services.arcgis.com/",
  token: "YOUR_TOKEN"
});
```

## Trusted Servers

```javascript
import esriConfig from "@arcgis/core/config.js";

esriConfig.request.trustedServers.push("https://services.arcgis.com");
esriConfig.request.trustedServers.push("https://your-server.com");
```

## CORS and Proxy

```javascript
esriConfig.request.proxyUrl = "/proxy/";

esriConfig.request.proxyRules.push({
  urlPrefix: "https://services.arcgis.com",
  proxyUrl: "/proxy/"
});
```

## Error Handling

```javascript
esriId.on("credential-create", (event) => {
  console.log("New credential:", event.credential);
});

layer.on("layerview-create-error", (event) => {
  if (event.error.name === "identity-manager:not-authorized") {
    signIn();
  }
});
```

## Common Pitfalls

1. **App ID registration** - Must be registered with correct redirect URIs
2. **Popup blockers** - Use redirect flow as fallback
3. **Token expiration** - Handle refresh or re-authentication
4. **CORS errors** - Configure trusted servers or use proxy
5. **Portal URL mismatch** - Trailing slashes matter
