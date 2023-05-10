# Icon

[component-header:glb-icon]

Glaber.UI comes bundled with over 1,500 icons courtesy of the [Bootstrap Icons](https://icons.getbootstrap.com/) project. These icons are part of the `default` icon library. If you prefer, you can register [custom icon libraries](#icon-libraries) as well.

?> Depending on how you're loading Glaber.UI, you may need to copy icon assets and/or [set the base path](getting-started/installation#setting-the-base-path) so Glaber.UI knows where to load them from. Otherwise, icons may not appear and you'll see 404 Not Found errors in the dev console.

## Default Icons

All available icons in the `default` icon library are shown below. Click or tap on any icon to copy its name, then you can use it in your HTML like this.

```html
<glb-icon name="icon-name-here"></glb-icon>
```

<div class="icon-search">
  <div class="icon-search-controls">
    <sl-input placeholder="Search Icons" clearable>
      <glb-icon slot="prefix" name="search"></glb-icon>
    </sl-input>
    <sl-select value="outline">
      <sl-option value="outline">Outlined</sl-option>
      <sl-option value="fill">Filled</sl-option>
      <sl-option value="all">All icons</sl-option>
    </sl-select>
  </div>
  <div class="icon-list"></div>
  <input type="text" class="icon-copy-input" aria-hidden="true" tabindex="-1">
</div>

## Examples

### Colors

Icons inherit their color from the current text color. Thus, you can set the `color` property on the `<glb-icon>` element or an ancestor to change the color.

```html preview
<div style="color: #4a90e2;">
  <glb-icon name="exclamation-triangle"></glb-icon>
  <glb-icon name="archive"></glb-icon>
  <glb-icon name="battery-charging"></glb-icon>
  <glb-icon name="bell"></glb-icon>
</div>
<div style="color: #9013fe;">
  <glb-icon name="clock"></glb-icon>
  <glb-icon name="cloud"></glb-icon>
  <glb-icon name="download"></glb-icon>
  <glb-icon name="file-earmark"></glb-icon>
</div>
<div style="color: #417505;">
  <glb-icon name="flag"></glb-icon>
  <glb-icon name="heart"></glb-icon>
  <glb-icon name="image"></glb-icon>
  <glb-icon name="lightning"></glb-icon>
</div>
<div style="color: #f5a623;">
  <glb-icon name="mic"></glb-icon>
  <glb-icon name="search"></glb-icon>
  <glb-icon name="star"></glb-icon>
  <glb-icon name="trash"></glb-icon>
</div>
```

### Sizing

Icons are sized relative to the current font size. To change their size, set the `font-size` property on the icon itself or on a parent element as shown below.

```html preview
<div style="font-size: 32px;">
  <glb-icon name="exclamation-triangle"></glb-icon>
  <glb-icon name="archive"></glb-icon>
  <glb-icon name="battery-charging"></glb-icon>
  <glb-icon name="bell"></glb-icon>
  <glb-icon name="clock"></glb-icon>
  <glb-icon name="cloud"></glb-icon>
  <glb-icon name="download"></glb-icon>
  <glb-icon name="file-earmark"></glb-icon>
  <glb-icon name="flag"></glb-icon>
  <glb-icon name="heart"></glb-icon>
  <glb-icon name="image"></glb-icon>
  <glb-icon name="lightning"></glb-icon>
  <glb-icon name="mic"></glb-icon>
  <glb-icon name="search"></glb-icon>
  <glb-icon name="star"></glb-icon>
  <glb-icon name="trash"></glb-icon>
</div>
```

### Labels

For non-decorative icons, use the `label` attribute to announce it to assistive devices.

```html preview
<glb-icon name="star-fill" label="Add to favorites"></glb-icon>
```

### Custom Icons

Custom icons can be loaded individually with the `src` attribute. Only SVGs on a local or CORS-enabled endpoint are supported. If you're using more than one custom icon, it might make sense to register a [custom icon library](#icon-libraries).

```html preview
<glb-icon src="https://shoelace.style/assets/images/shoe.svg" style="font-size: 8rem;"></glb-icon>
```

## Icon Libraries

You can register additional icons to use with the `<glb-icon>` component through icon libraries. Icon files can exist locally or on a CORS-enabled endpoint (e.g. a CDN). There is no limit to how many icon libraries you can register and there is no cost associated with registering them, as individual icons are only requested when they're used.

Shoelace ships with two built-in icon libraries, `default` and `system`. The [default icon library](#customizing-the-default-library) contains all of the icons in the Bootstrap Icons project. The [system icon library](#customizing-the-system-library) contains only a small subset of icons that are used internally by Shoelace components.

To register an additional icon library, use the `registerIconLibrary()` function that's exported from `utilities/icon-library.js`. At a minimum, you must provide a name and a resolver function. The resolver function translates an icon name to a URL where the corresponding SVG file exists. Refer to the examples below to better understand how it works.

If necessary, a mutator function can be used to mutate the SVG element before rendering. This is necessary for some libraries due to the many possible ways SVGs are crafted. For example, icons should ideally inherit the current text color via `currentColor`, so you may need to apply `fill="currentColor` or `stroke="currentColor"` to the SVG element using this function.

Here's an example that registers an icon library located in the `/assets/icons` directory.

```html
<script type="module">
  import { registerIconLibrary } from '/dist/utilities/icon-library.js';

  registerIconLibrary('my-icons', {
    resolver: name => `/assets/icons/${name}.svg`,
    mutator: svg => svg.setAttribute('fill', 'currentColor')
  });
</script>
```

To display an icon, set the `library` and `name` attributes of an `<glb-icon>` element.

```html
<!-- This will show the icon located at /assets/icons/smile.svg -->
<glb-icon library="my-icons" name="smile"></glb-icon>
```

If an icon is used before registration occurs, it will be empty initially but shown when registered.

The following examples demonstrate how to register a number of popular, open source icon libraries via CDN. Feel free to adapt the code as you see fit to use your own origin or naming conventions.

### Font Awesome

This will register the [Font Awesome Free](https://fontawesome.com/) library using the jsDelivr CDN. This library has three variations: regular (`far-*`), solid (`fas-*`), and brands (`fab-*`). A mutator function is required to set the SVG's `fill` to `currentColor`.

Icons in this library are licensed under the [Font Awesome Free License](https://github.com/FortAwesome/Font-Awesome/blob/master/LICENSE.txt). Some of the icons that appear on the Font Awesome website require a license and are therefore not available in the CDN.

```html preview
<script type="module">
  import { registerIconLibrary } from '/dist/utilities/icon-library.js';

  registerIconLibrary('fa', {
    resolver: name => {
      const filename = name.replace(/^fa[rbs]-/, '');
      let folder = 'regular';
      if (name.substring(0, 4) === 'fas-') folder = 'solid';
      if (name.substring(0, 4) === 'fab-') folder = 'brands';
      return `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.1/svgs/${folder}/${filename}.svg`;
    },
    mutator: svg => svg.setAttribute('fill', 'currentColor')
  });
</script>

<div style="font-size: 24px;">
  <glb-icon library="fa" name="far-bell"></glb-icon>
  <glb-icon library="fa" name="far-comment"></glb-icon>
  <glb-icon library="fa" name="far-hand-point-right"></glb-icon>
  <glb-icon library="fa" name="far-hdd"></glb-icon>
  <glb-icon library="fa" name="far-heart"></glb-icon>
  <glb-icon library="fa" name="far-star"></glb-icon>
  <br />
  <glb-icon library="fa" name="fas-archive"></glb-icon>
  <glb-icon library="fa" name="fas-book"></glb-icon>
  <glb-icon library="fa" name="fas-chess-knight"></glb-icon>
  <glb-icon library="fa" name="fas-dice"></glb-icon>
  <glb-icon library="fa" name="fas-pizza-slice"></glb-icon>
  <glb-icon library="fa" name="fas-scroll"></glb-icon>
  <br />
  <glb-icon library="fa" name="fab-apple"></glb-icon>
  <glb-icon library="fa" name="fab-chrome"></glb-icon>
  <glb-icon library="fa" name="fab-edge"></glb-icon>
  <glb-icon library="fa" name="fab-firefox"></glb-icon>
  <glb-icon library="fa" name="fab-opera"></glb-icon>
  <glb-icon library="fa" name="fab-microsoft"></glb-icon>
</div>
```

### Customizing the Default Library

The default icon library contains over 1,300 icons courtesy of the [Bootstrap Icons](https://icons.getbootstrap.com/) project. These are the icons that display when you use `<glb-icon>` without the `library` attribute. If you prefer to have these icons resolve elsewhere or to a different icon library, register an icon library using the `default` name and a custom resolver.

This example will load the same set of icons from the jsDelivr CDN instead of your local assets folder.

```html
<script type="module">
  import { registerIconLibrary } from '/dist/utilities/icon-library.js';

  registerIconLibrary('default', {
    resolver: name => `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.0.0/icons/${name}.svg`
  });
</script>
```

### Customizing the System Library

The system library contains only the icons used internally by Shoelace components. Unlike the default icon library, the system library does not rely on physical assets. Instead, its icons are hard-coded as data URIs into the resolver to ensure their availability.

If you want to change the icons Glaber.UI uses internally, you can register an icon library using the `system` name and a custom resolver. If you choose to do this, it's your responsibility to provide all of the icons that are required by components. You can reference `src/components/library.system.ts` for a complete list of system icons used by Glaber.UI.

```html
<script type="module">
  import { registerIconLibrary } from '/dist/utilities/icon-library.js';

  registerIconLibrary('system', {
    resolver: name => `/path/to/custom/icons/${name}.svg`
  });
</script>
```

<!-- Supporting scripts and styles for the search utility -->
<script>
  console.log('test');
  function wrapWithTooltip(item) {
    const tooltip = document.createElement('sl-tooltip');
    tooltip.content = item.getAttribute('data-name');

    // Close open tooltips
    document.querySelectorAll('.icon-list sl-tooltip[open]').forEach(tooltip => tooltip.hide());

    // Wrap it with a tooltip and trick it into showing up
    item.parentNode.insertBefore(tooltip, item);
    tooltip.appendChild(item);
    requestAnimationFrame(() => tooltip.dispatchEvent(new MouseEvent('mouseover')));
  }

  fetch('dist/assets/icons/icons.json')
    .then(res => res.json())
    .then(icons => {
      const container = document.querySelector('.icon-search');
      const input = container.querySelector('sl-input');
      const select = container.querySelector('sl-select');
      const copyInput = container.querySelector('.icon-copy-input');
      const loader = container.querySelector('.icon-loader');
      const list = container.querySelector('.icon-list');
      const queue = [];
      let inputTimeout;

      // Generate icons
      icons.map(i => {
        const item = document.createElement('div');
        item.classList.add('icon-list-item');
        item.setAttribute('data-name', i.name);
        item.setAttribute('data-terms', [i.name, i.title, ...(i.tags || []), ...(i.categories || [])].join(' '));
        item.innerHTML = `
          <svg width="1em" height="1em" fill="currentColor">
            <use xlink:href="/assets/icons/sprite.svg#${i.name}"></use>
          </svg>
        `;
        list.appendChild(item);

        // Wrap it with a tooltip the first time the mouse lands on it. We do this instead of baking them into the DOM
        // to improve this page's performance. See: https://github.com/shoelace-style/shoelace/issues/1122
        item.addEventListener('mouseover', () => wrapWithTooltip(item), { once: true });

        // Copy on click
        item.addEventListener('click', () => {
          const tooltip = item.closest('sl-tooltip');
          copyInput.value = i.name;
          copyInput.select();
          document.execCommand('copy');

          if (tooltip) {
            tooltip.content = 'Copied!';
            setTimeout(() => tooltip.content = i.name, 1000);
          }
        });
      });

      // Filter as the user types
      input.addEventListener('sl-input', () => {
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(() => {
          [...list.querySelectorAll('.icon-list-item')].map(item => {
            const filter = input.value.toLowerCase();
            if (filter === '') {
              item.hidden = false;
            } else {
              const terms = item.getAttribute('data-terms').toLowerCase();
              item.hidden = terms.indexOf(filter) < 0;
            }
          });
        }, 250);
      });

      // Sort by type and remember preference
      const iconType = localStorage.getItem('glb-icon:type') || 'outline';
      select.value = iconType;
      list.setAttribute('data-type', select.value);
      select.addEventListener('sl-change', () => {
        list.setAttribute('data-type', select.value);
        localStorage.setItem('glb-icon:type', select.value);
      });
    });
</script>

<style>
  .icon-search {
    border: solid 1px var(--sl-panel-border-color);
    border-radius: var(--sl-border-radius-medium);
    padding: var(--sl-spacing-medium);
  }

  .icon-search [hidden] {
    display: none;
  }

  .icon-search-controls {
    display: flex;
  }

  .icon-search-controls sl-input {
    flex: 1 1 auto;
  }

  .icon-search-controls sl-select {
    width: 10rem;
    flex: 0 0 auto;
    margin-left: 1rem;
  }

  .icon-loader {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 30vh;
  }

  .icon-list {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    position: relative;
    margin-top: 1rem;
  }

  .icon-loader[hidden],
  .icon-list[hidden] {
    display: none;
  }

  .icon-list-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--sl-border-radius-medium);
    font-size: 24px;
    width: 2em;
    height: 2em;
    margin: 0 auto;
    cursor: copy;
    transition: var(--sl-transition-medium) all;
  }

  .icon-list-item:hover {
    background-color: var(--sl-color-primary-50);
    color: var(--sl-color-primary-600);
  }

  .icon-list[data-type="outline"] .icon-list-item[data-name$="-fill"] {
    display: none;
  }

  .icon-list[data-type="fill"] .icon-list-item:not([data-name$="-fill"]) {
    display: none;
  }

  .icon-copy-input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  @media screen and (max-width: 1000px) {
    .icon-list {
      grid-template-columns: repeat(8, 1fr);
    }

    .icon-list-item {
      font-size: 20px;
    }

    .icon-search-controls {
      display: block;
    }

    .icon-search-controls sl-select {
      width: auto;
      margin: 1rem 0 0 0;
    }
  }

  @media screen and (max-width: 500px) {
    .icon-list {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>

[component-metadata:glb-icon]
