# [Unblock Embedded Experience]() ·&#x20;

# Unblock SDK

`@simaoptrocha/try-now-sdk` allows you to seamlessly integrate the Unblock widget into your web application.

## 📌 Overview

The Unblock SDK provides a straightforward way to embed and interact with the Unblock widget, ensuring secure communication between your app and the widget.

## 🚀 Installation

You can find the package here - [https://www.npmjs.com/package/@simaoptrocha/try-now-sdk](https://www.npmjs.com/package/@simaoptrocha/try-now-sdk).

### Install via npm:

```sh
npm install @simaoptrocha/try-now-sdk
```

### Install via Yarn:

```sh
yarn add @simaoptrocha/try-now-sdk
```



## 🔧 Initialization

### Importing the loader

```js
import { loadCustomWidget } from '@simaoptrocha/try-now-sdk';
```

### Creating an instance with your setup

```js
const customWidgetLoader = await loadCustomWidget();

const widgetInstance = customWidgetLoader({
  variant: 'embedded',
  containerNodeSelector: '#widget-container',
});
```

### Triggering the display of the widget

```js
widgetInstance.show();
```



## 📡 Parameters

### Required

- **`containerNodeSelector`**: Parent `div` where the widget should be attached. Assign an `id` to the `div` where the widget should be rendered, matching the value passed during initialization.

Example usage:

```jsx
return (
  <section>
    <Element name="features">
      <div
        className="flex justify-center items-center w-full sm:w-4/5"
        style={{ height: '700px', borderRadius: '10px', overflow: 'hidden', margin: '0 auto' }}
      >
        <div
          id="widget-container"
          style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
        ></div>
      </div>
    </Element>
  </section>
);
```

### Optional

- **`walletAddress`**: Merchants can pass a wallet address for authentication. If omitted, the widget prompts users to manually enter a wallet.
- **`chain`**: Passes the blockchain chain ID (e.g., Ethereum - 1, Polygon - 137, Amoy - 80002).
- **`token`**: Specifies the token used. It must be one of the supported tokens for the selected chain. See [supported tokens](#) for details.
- **`options`**: Configuration object for customizing the widget's behavior and appearance.
  - **`text`**: Customizable text within the widget.
  - **`styles`**: Basic styling options (proof of concept for styling support).

## 📝 Text Customization

You can customize text within the widget using the `text` option.

Currently, the only available text options (proof of concept) are:

```js
options: {
  text: {
    introTitle: "Intro main title example",
    introDescription: "Description text example goes here",
    introButtonTitle: "Intro button Title",
    introAdditionalText: "Additional text goes here!"
  }
}
```

## 🎨 Styling

You can customize styles within the widget using the text option.

Currently, the only available styles options (proof of concept) are:

```js
options: {
  styles: { backgroundColor: 'black', color: 'white' }
}
```

## 📬 Contact Us

If you need support, please contact the team.

