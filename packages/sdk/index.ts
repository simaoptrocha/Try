/* eslint-disable @typescript-eslint/no-explicit-any */
const scriptLoadingStatus = {
  isLoading: false,
  isLoaded: false,
};
declare global {
  interface Window {
    SimpleWidgetLoader: any;
  }
}
window.SimpleWidgetLoader = window.SimpleWidgetLoader || {};

function sendHandshakeMessage(widgetInstance: any, retries = 30, delay = 1000) {
  let attempt = 0;

  const tryHandshake = () => {
    const instance = widgetInstance.getWidgetInstance();
    if (instance && instance.targetWindow) {
      instance.targetWindow.postMessage(
        {
          type: 'parent-handshake',
          parentOrigin: window.location.origin,
          text: {},
        },
        '*'
      );
    }
    attempt++;
    if (attempt < retries) {
      setTimeout(tryHandshake, delay);
    } else {
      return;
    }
  };

  tryHandshake();
}

async function loadCustomWidget() {
  return new Promise((resolve, reject) => {
    const scriptSrc = "https://main.d1lhmcsifcqof1.amplifyapp.com/index.js"
    scriptLoadingStatus.isLoading = true;
      const script = document.createElement('script');
      script.async = true;
      script.src = scriptSrc;
      script.addEventListener('load', () => {
        scriptLoadingStatus.isLoading = false;
        scriptLoadingStatus.isLoaded = true;

        if (window.SimpleWidgetLoader) {
          const originalInit = window.SimpleWidgetLoader.init;
          const wrappedInit = (options: any) => {
            const widgetInstance = originalInit(options);
            
            sendHandshakeMessage(widgetInstance);
            
            return widgetInstance;
          };
          resolve(wrappedInit);
        } else {
          reject(new Error('SimpleWidgetLoader is not available after script load.'));
        }
      });
      script.addEventListener('error', (error) => {
        scriptLoadingStatus.isLoading = false;
        scriptLoadingStatus.isLoaded = false;
        reject(new Error('Failed to load custom widget script.'));
      });
      document.body.appendChild(script);
    
  });
}

export { loadCustomWidget };
