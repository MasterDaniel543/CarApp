export async function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return { registered: false };
  }
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
    return { registered: true, registration };
  } catch (error) {
    return { registered: false, error: error?.message || String(error) };
  }
}