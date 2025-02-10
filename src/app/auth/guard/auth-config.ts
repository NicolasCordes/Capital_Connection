import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
    issuer: 'https://dev-a80pak0n1qa4bidm.us.auth0.com/',
    clientId: 'SvIoX8xs8NC5pmBOSpz5lqrLDIzOLzXJ',
    redirectUri: window.location.origin + '/callback',
    responseType: 'code',
    scope: 'openid profile email',
    silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
    useSilentRefresh: false,
    customQueryParams: {
      audience: 'https://capital-connection-api'
    },
    strictDiscoveryDocumentValidation: false,
    showDebugInformation: true
  };
