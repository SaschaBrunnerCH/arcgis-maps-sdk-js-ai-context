---
name: arcgis-authentication
description: Implement authentication with ArcGIS using OAuth 2.0, API keys, and identity management. Use for accessing secured services, portal items, and user-specific content.
---

# ArcGIS Authentication

Use this skill for implementing authentication, OAuth, API keys, and identity management.

## Import Patterns

### Direct ESM Imports
```javascript
import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";
import Portal from "@arcgis/core/portal/Portal.js";
import esriConfig from "@arcgis/core/config.js";
```

### Dynamic Imports (CDN)
```javascript
const OAuthInfo = await $arcgis.import("@arcgis/core/identity/OAuthInfo.js");
const esriId = await $arcgis.import("@arcgis/core/identity/IdentityManager.js");
const Portal = await $arcgis.import("@arcgis/core/portal/Portal.js");
```

## API Keys

The simplest authentication method. Set once for all SDK requests.

### Configure API Key

```javascript
import esriConfig from "@arcgis/core/config.js";

esriConfig.apiKey = "YOUR_API_KEY";

// Now basemaps and services will use the API key
const map = new Map({
  basemap: "arcgis/streets"
});
```

### API Key in HTML (CDN)

```html
<script src="https://js.arcgis.com/5.0/"></script>
<script>
  $arcgis.config.apiKey = "YOUR_API_KEY";
</script>
```

## OAuth 2.0 Authentication

### Basic OAuth Setup

```javascript
import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";

const oauthInfo = new OAuthInfo({
  appId: "YOUR_APP_ID",
  popup: false           // false = redirect, true = popup window
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
  try {
    const credential = await esriId.getCredential(
      oauthInfo.portalUrl + "/sharing"
    );
    return credential;
  } catch (error) {
    console.error("Sign in failed:", error);
  }
}
```

### Sign Out

```javascript
function signOut() {
  esriId.destroyCredentials();
  window.location.reload();
}
```

### Complete OAuth Flow

```javascript
import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";
import Portal from "@arcgis/core/portal/Portal.js";

const oauthInfo = new OAuthInfo({ appId: "YOUR_APP_ID" });
esriId.registerOAuthInfos([oauthInfo]);

// Check if already signed in
esriId.checkSignInStatus(oauthInfo.portalUrl + "/sharing")
  .then(() => {
    const portal = new Portal({ authMode: "immediate" });
    return portal.load();
  })
  .then((portal) => {
    console.log("Welcome,", portal.user.fullName);
    displayUserContent(portal);
  })
  .catch(() => {
    showSignInButton();
  });

function showSignInButton() {
  document.getElementById("signInBtn").onclick = () => {
    esriId.getCredential(oauthInfo.portalUrl + "/sharing")
      .then(() => window.location.reload());
  };
}
```

## Enterprise Portal Authentication

### Configure for Enterprise Portal

```javascript
const oauthInfo = new OAuthInfo({
  appId: "YOUR_APP_ID",
  portalUrl: "https://your-portal.com/portal",
  popup: true
});

esriId.registerOAuthInfos([oauthInfo]);
```

### Set Portal URL Globally

```javascript
import esriConfig from "@arcgis/core/config.js";

esriConfig.portalUrl = "https://your-portal.com/portal";
```

## Token-Based Authentication

### Register Token

```javascript
esriId.registerToken({
  server: "https://services.arcgis.com/",
  token: "YOUR_TOKEN"
});
```

### Get Token Manually

```javascript
const credential = await esriId.getCredential("https://services.arcgis.com/...");
console.log("Token:", credential.token);
console.log("Expires:", new Date(credential.expires));
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
console.log("Thumbnail:", portal.user.thumbnailUrl);
console.log("Org name:", portal.name);
console.log("Org ID:", portal.id);
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
result.results.forEach((item) => {
  console.log(item.title, item.type, item.id);
});
```

## Credential Persistence

```javascript
// Clear all stored credentials
esriId.destroyCredentials();

// Find a specific credential
const credential = esriId.findCredential("https://services.arcgis.com/...");
```

## Trusted Servers

```javascript
import esriConfig from "@arcgis/core/config.js";

esriConfig.request.trustedServers.push("https://services.arcgis.com");
esriConfig.request.trustedServers.push("https://your-server.com");
```

## CORS and Proxy

```javascript
import esriConfig from "@arcgis/core/config.js";

// Configure proxy for cross-origin requests
esriConfig.request.proxyUrl = "/proxy/";

// Configure proxy rules
esriConfig.request.proxyRules.push({
  urlPrefix: "https://services.arcgis.com",
  proxyUrl: "/proxy/"
});
```

## Common Pitfalls

1. **App ID redirect URIs**: The App ID must be registered with correct redirect URIs at developers.arcgis.com. Mismatched URIs cause silent authentication failures.

2. **Popup blockers on mobile**: OAuth popup-based sign-in fails on mobile browsers.
   ```javascript
   // Anti-pattern: using popup flow on mobile
   const oauthInfo = new OAuthInfo({
     appId: "YOUR_APP_ID",
     popup: true // Blocked by most mobile browsers
   });
   ```

   ```javascript
   // Correct: use redirect flow for mobile
   const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
   const oauthInfo = new OAuthInfo({
     appId: "YOUR_APP_ID",
     popup: !isMobile
   });
   ```

3. **Portal URL trailing slash**: A trailing slash in the portal URL causes token validation to fail.
   ```javascript
   // Anti-pattern
   const portal = new Portal({
     url: "https://myorg.maps.arcgis.com/" // Trailing slash
   });

   // Correct
   const portal = new Portal({
     url: "https://myorg.maps.arcgis.com" // No trailing slash
   });
   ```

4. **Token expiration**: Tokens expire. Handle refresh or re-authentication gracefully.

5. **CORS errors**: Configure trusted servers or use a proxy for cross-origin requests to non-ArcGIS servers.

## Request Interceptors

```javascript
import esriConfig from "@arcgis/core/config.js";

esriConfig.request.interceptors.push({
  urls: "https://services.arcgis.com",
  before: (params) => {
    // Add custom headers or modify request
    console.log("Request to:", params.url);
  },
  after: (response) => {
    // Process response
    console.log("Response status:", response.httpStatus);
  },
  error: (error) => {
    console.error("Request failed:", error);
  }
});
```

## Reference Samples

- `identity-oauth-basic` - Basic OAuth 2.0 authentication setup
- `identity-oauth-component` - OAuth component-based authentication
- `basemaps-portal` - Authenticated portal access for basemaps
- `webmap-save` - Saving maps (requires authentication)

## Related Skills

- See `arcgis-portal-content` for managing portal items, WebMaps, and WebScenes.
- See `arcgis-rest-services` for premium REST services requiring authentication.
- See `arcgis-starter-app` for app scaffolding with authentication setup.
