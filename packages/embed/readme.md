# Showwcial Embed

A mini javascript library which enables you embed showwcase `Threads` in your personal site.

## Usage

Follow the instruction below on how the widget can be used.

### Step 1

Include the following script before the closing `</body>` tag.

```js

// Ionicons Lib (This embed widget depends on it, so do well to include it.)
<script
    type="module"
    src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
></script>

// Embed Widget
<script src="https://cdn.jsdelivr.net/npm/showwcial-embed@0.1.0/index.js"></script>
```

### Step 2

Include the widget css lib within yor `<head>` tag.

```js
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/showwcial-embed/style.css"
/>
```

### Step 3

Invoke the widget within your application by calling adding the following code.

```html
<body>
  <div id="unique-id-name"></div>

  <script>
    const embedd = new ShowwcaseEmbed(
      "#unique-id-name",
      [101223, 102777, 103301, 103092] // list of showwcase threads id. you could include one or two threads.
    );
  </script>
</body>
```

> Note!! Make sure the thread id is valid, else, the widget wont work properly.

If all have been done correctly, you should get the following result:

![image](https://raw.githubusercontent.com/Benrobo/showwcial/main/packages/embed/preview.png)
