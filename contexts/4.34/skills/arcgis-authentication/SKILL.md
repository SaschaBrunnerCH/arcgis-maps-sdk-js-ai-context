---
name: arcgis-authentication
description: Implement authentication with ArcGIS using OAuth 2.0, API keys, and identity management. Use for accessing secured services, portal items, and user-specific content.
---

# ArcGIS Authentication

Use this skill for implementing authentication, OAuth, API keys, and identity management.

## OAuth 2.0 Authentication

### Basic OAuth Setup
```javascript
import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";
import Portal from "@arcgis/core/portal/Portal.js";

// Create OAuthInfo with your app ID
const oauthInfo = new OAuthInfo({
  appId: "YOUR_APP_ID", // Register at developers.arcgis.com
  popup: false // false = redirect, true = popup window
});

// Register with IdentityManager
esriId.registerOAuthInfos([oauthInfo]);
```

### Check Sign-In Status
```javascript
async function checkSignIn() {
  try {
    await esriId.checkSignInStatus(oauthInfo.portalUrl + "/sharing");
    // User is signed in
    const portal = new Portal({ authMode: "immediate" });
    await portal.load();
    console.log("Signed in as:", portal.user.username);
    return portal;
  } catch {
    // User is not signed in
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
    console.log("Credential obtained:", credential);
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

const oauthInfo = new OAuthInfo({
  appId: "YOUR_APP_ID"
});

esriId.registerOAuthInfos([oauthInfo]);

// Check if already signed in
esriId.checkSignInStatus(oauthInfo.portalUrl + "/sharing")
  .then(() => {
    // Already signed in, load portal
    const portal = new Portal({ authMode: "immediate" });
    return portal.load();
  })
  .then((portal) => {
    console.log("Welcome,", portal.user.fullName);
    displayUserContent(portal);
  })
  .catch(() => {
    // Not signed in, show sign-in button
    showSignInButton();
  });

function showSignInButton() {
  const btn = document.getElementById("signInBtn");
  btn.onclick = () => {
    esriId.getCredential(oauthInfo.portalUrl + "/sharing")
      .then(() => {
        window.location.reload();
      });
  };
}
```

## OAuth Component

```html
<!-- Using OAuth component -->
<arcgis-oauth app-id="YOUR_APP_ID"></arcgis-oauth>

<script type="module">
  const oauthComponent = document.querySelector("arcgis-oauth");

  oauthComponent.addEventListener("arcgisSignIn", (event) => {
    console.log("Signed in:", event.detail.credential);
  });

  oauthComponent.addEventListener("arcgisSignOut", () => {
    console.log("Signed out");
  });
</script>
```

## API Keys

### Configure API Key
```javascript
import esriConfig from "@arcgis/core/config.js";

// Set API key for accessing services
esriConfig.apiKey = "YOUR_API_KEY";

// Now basemaps and services will use the API key
const map = new Map({
  basemap: "arcgis/streets" // Requires API key
});
```

### API Key in HTML
```html
<script>
  // Set before loading the SDK
  window.esriConfig = {
    apiKey: "YOUR_API_KEY"
  };
</script>
<script src="https://js.arcgis.com/4.34/"></script>
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

### Get Token Manually
```javascript
const credential = await esriId.getCredential("https://services.arcgis.com/...");
console.log("Token:", credential.token);
console.log("Expires:", new Date(credential.expires));
```

### Register Token
```javascript
esriId.registerToken({
  server: "https://services.arcgis.com/",
  token: "YOUR_TOKEN"
});
```

## Portal User Information

```javascript
import Portal from "@arcgis/core/portal/Portal.js";

const portal = new Portal({ authMode: "immediate" });
await portal.load();

// User info
console.log("Username:", portal.user.username);
console.log("Full name:", portal.user.fullName);
console.log("Email:", portal.user.email);
console.log("Role:", portal.user.role);
console.log("Thumbnail:", portal.user.thumbnailUrl);

// Organization info
console.log("Org name:", portal.name);
console.log("Org ID:", portal.id);
```

## Query User Items

```javascript
import Portal from "@arcgis/core/portal/Portal.js";
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams.js";

const portal = new Portal({ authMode: "immediate" });
await portal.load();

// Query user's items
const queryParams = new PortalQueryParams({
  query: `owner:${portal.user.username}`,
  sortField: "modified",
  sortOrder: "desc",
  num: 20
});

const result = await portal.queryItems(queryParams);

result.results.forEach(item => {
  console.log(item.title, item.type, item.id);
});
```

## Credential Persistence

```javascript
// Clear stored credentials
esriId.destroyCredentials();

// Find a specific credential
const credential = esriId.findCredential("https://services.arcgis.com/...");
```

## Handling Authentication Errors

```javascript
// Global handler for authentication challenges
esriId.on("credential-create", (event) => {
  console.log("New credential created:", event.credential);
});

// Handle layer authentication errors
layer.on("layerview-create-error", (event) => {
  if (event.error.name === "identity-manager:not-authorized") {
    console.log("Authentication required for this layer");
    signIn();
  }
});
```

## Trusted Servers

```javascript
import esriConfig from "@arcgis/core/config.js";

// Add servers that should receive credentials automatically
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

## Reference Samples

- `identity-oauth-basic` - Basic OAuth2 authentication setup
- `identity-oauth-component` - OAuth component-based authentication

## Common Pitfalls

1. **App ID registration**: App ID must be registered with correct redirect URIs

2. **Popup blockers**: OAuth popups may be blocked - use redirect flow as fallback

3. **Token expiration**: Tokens expire - handle refresh or re-authentication

4. **CORS errors**: Configure trusted servers or use proxy for cross-origin

5. **Portal URL mismatch**: Ensure portal URL matches exactly (trailing slashes matter)

