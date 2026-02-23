# Agent Guide: arcgis-authentication

Quick-reference decisions, checklists, and tables for authentication and authorization.

## API Key vs OAuth vs Identity Manager Decision Tree

1. **Does the app access only public basemaps, geocoding, or routing?**
   - Yes --> **API Key** (simplest)

2. **Does the app need to access the user's private content (web maps, feature services)?**
   - Yes --> **OAuth 2.0** (user signs in)

3. **Is this a server-side app with no user interaction?**
   - Yes --> **App token** (client credentials OAuth flow, server-side only)

4. **Is the app connecting to ArcGIS Enterprise (on-premise)?**
   - Yes --> **OAuth 2.0** with custom `portalUrl`

5. **Do you need to access multiple secured services and want automatic token management?**
   - Yes --> **IdentityManager** handles this automatically with OAuth or registered tokens

| Approach | User Sign-In | Setup Complexity | Use Case |
|----------|-------------|-----------------|----------|
| API Key | No | Low | Public apps with basemaps/services |
| OAuth 2.0 (redirect) | Yes | Medium | Web apps needing user content |
| OAuth 2.0 (popup) | Yes | Medium | SPAs that stay on page |
| `<arcgis-oauth>` component | Yes | Low | Quick OAuth with Map Components |
| Registered token | No | Low | Testing / known tokens |

## OAuth Setup Checklist

### Register your app
- [ ] Go to [developers.arcgis.com](https://developers.arcgis.com) (or your Enterprise portal)
- [ ] Create a new OAuth application
- [ ] Note the **App ID** (client ID)
- [ ] Add **redirect URIs** for your app (e.g., `http://localhost:5173`, `https://yourapp.com`)
- [ ] For production: add **referrer restrictions** on the app registration

### Implement in code
- [ ] Import `OAuthInfo` and `esriId` (IdentityManager)
- [ ] Create `OAuthInfo`: `new OAuthInfo({ appId: "YOUR_APP_ID" })`
- [ ] Set `popup: false` for redirect flow, `popup: true` for popup window
- [ ] Register: `esriId.registerOAuthInfos([oauthInfo])`
- [ ] Check existing sign-in: `esriId.checkSignInStatus(portalUrl + "/sharing")`
- [ ] Trigger sign-in: `esriId.getCredential(portalUrl + "/sharing")`
- [ ] Load portal: `new Portal({ authMode: "immediate" })` then `await portal.load()`

### For Enterprise Portal
- [ ] Set `portalUrl` on OAuthInfo: `new OAuthInfo({ appId, portalUrl: "https://your-portal/portal" })`
- [ ] Or set globally: `esriConfig.portalUrl = "https://your-portal/portal"`

### Using the OAuth Component
- [ ] Add `<arcgis-oauth app-id="YOUR_APP_ID">` to HTML
- [ ] Listen for `arcgisSignIn` and `arcgisSignOut` events
- [ ] Access credential from `event.detail.credential`

## Security Checklist

### Token handling
- [ ] Never commit API keys or tokens to source control
- [ ] Use environment variables (e.g., `VITE_ARCGIS_API_KEY`) for API keys
- [ ] For OAuth: tokens are managed by IdentityManager (no manual storage needed)
- [ ] Do not store tokens in `localStorage` for production apps

### CORS and referrers
- [ ] Configure `esriConfig.request.trustedServers` for servers that should receive credentials
- [ ] Set up proxy (`esriConfig.request.proxyUrl`) for services that do not support CORS
- [ ] Configure **allowed referrers** on your API key at developers.arcgis.com
- [ ] For Enterprise: ensure CORS is enabled on the portal and services

### OAuth security
- [ ] Use HTTPS in production (OAuth redirects require it)
- [ ] Register only the redirect URIs you actually use
- [ ] Use `popup: false` (redirect flow) when popup blockers are a concern
- [ ] Handle token expiration: IdentityManager auto-refreshes, but test edge cases

### API Key scoping
- [ ] Generate API keys with minimum required privileges (only basemaps, only geocoding, etc.)
- [ ] Set referrer restrictions to limit where the key can be used
- [ ] Use separate keys for development and production
- [ ] Rotate keys periodically

## Sign-In / Sign-Out Flow Summary

```
App loads
  --> checkSignInStatus()
    --> Signed in? Load Portal, display user info
    --> Not signed in? Show sign-in button
      --> User clicks sign-in
        --> getCredential() triggers OAuth redirect/popup
          --> User authenticates at ArcGIS
            --> Redirect back with token
              --> Load Portal, display user info

Sign out:
  --> esriId.destroyCredentials()
  --> window.location.reload()
```

## Common Token Errors

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `identity-manager:not-authorized` | Missing or expired token | Trigger re-authentication |
| `403 Forbidden` | API key lacks required privilege | Add privilege at developers.arcgis.com |
| `498 Invalid Token` | Token expired or revoked | Refresh or re-authenticate |
| `499 Token Required` | Secured service, no token provided | Register OAuthInfo or set API key |
| CORS error on token request | Portal not configured for CORS | Add to `trustedServers` or use proxy |
