// src/auth.js

// Replace with your actual Deriv App ID
export const APP_ID = "33tOVg0Ab0mwjyV0Uwiuq";

// Replace with your registered redirect URL
export const REDIRECT_URI = window.location.origin;

// Deriv OAuth login
export function loginWithDeriv() {
  const oauthUrl =
    `https://oauth.deriv.com/oauth2/authorize` +
    `?app_id=${APP_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  window.location.href = oauthUrl;
}

// Read token from URL after login
export function getTokenFromUrl() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);

  return (
    params.get("access_token") ||
    params.get("token") ||
    null
  );
}

// Save token locally
export function saveToken(token) {
  localStorage.setItem("deriv_token", token);
}

// Get saved token
export function getSavedToken() {
  return localStorage.getItem("deriv_token");
}

// Logout
export function logout() {
  localStorage.removeItem("deriv_token");
  window.location.reload();
}
