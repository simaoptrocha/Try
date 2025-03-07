(function (global) {

  class SimpleWidget {
    baseUrl = "https://main.dq2rjlvczplxw.amplifyapp.com" 
    constructor({ containerNodeSelector, walletAddress, chain, token, options }) {
  
      this.options = options;
      this.containerNodeSelector = containerNodeSelector || "#widget-container"; 
      this.walletAddress = walletAddress || null; 
      this.chain = chain || null;
      this.token = token || null;
      this.widgetInstance = null;
    }

    getWidgetInstance() {
      return this.widgetInstance
    }

    show() {
      this.cleanupEventListeners();
      this.widgetInstance = this.createEmbeddedWidget();

      return this.widgetInstance;
    }

    createEmbeddedWidget() {
      const url = this.constructUrl();

      const container = document.querySelector(this.containerNodeSelector);
      if (!container) {
        throw new Error(`Container not found for selector: ${this.containerNodeSelector}`);
      }


      const iframe = this.createIframe(url);
      container.appendChild(iframe);

      return {
        cleanup: () => iframe.remove(),
        targetWindow: iframe.contentWindow,
      };
    }

    constructUrl() {
      const url = new URL(this.baseUrl);
      const params = new URLSearchParams();

      if (this.walletAddress) params.append("walletAddress", this.walletAddress);
      if (this.chain) params.append("chain", this.chain);
      if (this.token) params.append("token", this.token);
      if (this.options?.text) params.append("text", JSON.stringify(this.options.text));
      if (this.options?.styles) params.append("styles", JSON.stringify(this.options.styles));

      return `${url.toString()}?${params.toString()}`;
    }

    createIframe(url) {
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = "none";
      return iframe;
    }

    createCloseButton(onClick) {
      const closeButton = document.createElement("button");
      closeButton.classList.add("simple-widget__close");
      closeButton.innerHTML = "✕";
      closeButton.addEventListener("click", onClick);
      return closeButton;
    }


    cleanupOverlay(overlay) {
      overlay.remove();
      window.removeEventListener("keydown", this.handleEscPress.bind(this));
    }

    cleanupEventListeners() {
      window.removeEventListener("keydown", this.handleEscPress.bind(this));
    }

    handleEscPress(event) {
      if (event.key === "Escape") {
        const overlay = document.querySelector('[data-simple-widget="true"]');
        if (overlay) {
          this.cleanupOverlay(overlay);
        }
      }
    }
  }

  let instance = null;

  global.SimpleWidgetLoader = {
    init: (options) => {
      if (instance) {
        instance.cleanupEventListeners();
        instance = null;
      }
      instance = new SimpleWidget(options);
      return instance;
    },
  };
})(window);
