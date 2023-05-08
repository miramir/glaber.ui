/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* @todo Доделать генерацию отображения мета информации компонентов */
(() => {
  const customElements = fetch('/custom-elements.json')
    .then(res => res.json())
    .catch(err => console.error(err));

  function getAllComponents(metadata) {
    const allComponents = [];
    metadata.modules?.forEach((module) => {
      module.declarations?.forEach((declaration) => {
        if (declaration.customElement) {
          // Generate the dist path based on the src path and attach it to the component
          declaration.path = module.path.replace(/^src\//, 'dist/').replace(/\.ts$/, '.js');
          allComponents.push(declaration);
        }
      });
    });

    return allComponents;
  }

  function getComponent(metadata, tagName) {
    return getAllComponents(metadata).find(component => component.tagName === tagName);
  }

  function escapeHtml(html) {
    if (!html) {
      return '';
    }
    return html
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }

  function renderPropRow(prop) {
    const hasAttribute = !!prop.attribute;
    const isAttributeDifferent = prop.attribute !== prop.name;
    let attributeInfo = '';

    if (!hasAttribute) {
      attributeInfo = '<br><small>(property only)</small>';
    } else if (isAttributeDifferent) {
      attributeInfo = `
        <br>
        <glb-tooltip content="This attribute is different from its property">
          <small><code class="nowrap">${escapeHtml(prop.attribute)}</code></small>
        </glb-tooltip>`;
    }

    return `
      <tr>
        <td><code class="nowrap">${escapeHtml(prop.name)}</code>${attributeInfo}</td>
        <td>${escapeHtml(prop.description)}</td>
        <td style="text-align: center;">${prop.reflects ? '<sl-icon label="yes" name="check-lg"></sl-icon>' : ''}</td>
        <td>${prop.type?.text ? `<code>${escapeHtml(prop.type?.text || '')}</code>` : '-'}</td>
        <td>${prop.default ? `<code>${escapeHtml(prop.default)}</code>` : '-'}</td>
      </tr>
    `;
  }

  function createPropsTable(props) {
    const table = document.createElement('table');
    table.classList.add('metadata-table');

    table.innerHTML = `
      <thead><tr><th>Name</th><th>Description</th><th>Reflects</th><th>Type</th><th>Default</th></tr></thead>
      <tbody>
        ${props.map(prop => renderPropRow(prop)).join('')}
        <tr>
          <td class="nowrap"><code>updateComplete</code></td>
          <td>
            A read-only promise that resolves when the component has
            <a href="/getting-started/usage?id=component-rendering-and-updating">finished updating</a>.
          </td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    `;

    return table.outerHTML;
  }

  function createPartsTable(parts) {
    const table = document.createElement('table');
    table.classList.add('metadata-table');
    table.innerHTML = `
      <thead><tr><th>Name</th><th>Description</th></tr></thead>
      <tbody>
        ${parts.map(part => `
              <tr>
                <td class="nowrap"><code>${escapeHtml(part.name)}</code></td>
                <td>${escapeHtml(part.description)}</td>
              </tr>
           `).join('')}
      </tbody>
    `;

    return table.outerHTML;
  }

  function createCustomPropertiesTable(styles) {
    const table = document.createElement('table');
    table.classList.add('metadata-table');
    table.innerHTML = `
      <thead><tr><th>Name</th><th>Description</th><th>Default</th></tr></thead>
      <tbody>
        ${styles.map(style => `
              <tr>
                <td class="nowrap"><code>${escapeHtml(style.name)}</code></td>
                <td>${escapeHtml(style.description)}</td>
                <td>${style.default ? `<code>${escapeHtml(style.default)}</code>` : ''}</td>
              </tr>
            `).join('')}
      </tbody>
    `;

    return table.outerHTML;
  }

  function createDependenciesList(targetComponent, allComponents) {
    const ul = document.createElement('ul');
    const dependencies = [];

    // Recursively fetch sub-dependencies
    function getDependencies(tag) {
      const component = allComponents.find(c => c.tagName === tag);
      if (!component || !Array.isArray(component.dependencies)) {
        return;
      }

      component.dependencies?.forEach((dependentTag) => {
        if (!dependencies.includes(dependentTag)) {
          dependencies.push(dependentTag);
        }
        getDependencies(dependentTag);
      });
    }

    getDependencies(targetComponent);
    dependencies.sort().forEach((tag) => {
      const li = document.createElement('li');
      li.innerHTML = `<code>&lt;${tag}&gt;</code>`;
      ul.appendChild(li);
    });

    return ul.outerHTML;
  }

  function createAnimationsTable(animations) {
    const table = document.createElement('table');
    table.classList.add('metadata-table');
    table.innerHTML = `
      <thead><tr><th>Name</th><th>Description</th></tr></thead>
      <tbody>
        ${animations.map(animation => `
              <tr>
                <td class="nowrap"><code>${escapeHtml(animation.name)}</code></td>
                <td>${escapeHtml(animation.description)}</td>
              </tr>
            `).join('')}
      </tbody>
    `;

    return table.outerHTML;
  }

  function createSlotsTable(slots) {
    const table = document.createElement('table');
    table.classList.add('metadata-table');
    table.innerHTML = `
      <thead><tr><th>Name</th><th>Description</th></tr></thead>
      <tbody>
        ${slots.map(slot => `
              <tr>
                <td class="nowrap">${slot.name ? `<code>${escapeHtml(slot.name)}</code>` : '(default)'}</td>
                <td>${escapeHtml(slot.description)}</td>
              </tr>
            `).join('')}
      </tbody>
    `;

    return table.outerHTML;
  }

  function createEventsTable(events) {
    const table = document.createElement('table');
    table.classList.add('metadata-table');
    table.innerHTML = `
      <thead><tr><th data-flavor="html">Name</th><th>Description</th><th>Event Detail</th></tr></thead>
      <tbody>
        ${events.map(event => `
              <tr>
                <td data-flavor="html"><code class="nowrap">${escapeHtml(event.name)}</code></td>
                <td>${escapeHtml(event.description)}</td>
                <td>${event.type?.text ? `<code>${escapeHtml(event.type?.text)}` : '-'}</td>
              </tr>
            `).join('')}
      </tbody>
    `;

    return table.outerHTML;
  }

  function renderMethodRow(method) {
    return `
      <tr>
        <td class="nowrap"><code>${escapeHtml(method.name)}()</code></td>
        <td>${escapeHtml(method.description)}</td>
        <td>${method.parameters?.length ? `
            <code>
            ${escapeHtml(method.parameters.map(param => `${param.name}: ${param.type?.text || ''}`).join(', '))}
            </code>
          ` : '-'}
        </td>
      </tr>
    `;
  }

  function createMethodsTable(methods) {
    const table = document.createElement('table');
    table.classList.add('metadata-table');
    table.innerHTML = `
      <thead><tr><th>Name</th><th>Description</th><th>Arguments</th></tr></thead>
      <tbody>
        ${methods.map(method => renderMethodRow(method)).join('')}
      </tbody>
    `;

    return table.outerHTML;
  }

  if (!window.$docsify) {
    throw new Error('Docsify must be loaded before installing this plugin.');
  }

  window.$docsify.plugins.push((hook) => {
    hook.mounted(async () => {
      const metadata = await customElements;
      const target = document.querySelector('.app-name');

      // Add version
      const version = document.createElement('div');
      version.classList.add('sidebar-version');
      version.textContent = `v${metadata.package.version}`;
      target.appendChild(version);

      // Store version for reuse
      sessionStorage.setItem('sl-version', metadata.package.version);
    });

    hook.beforeEach(async (content, next) => {
      const metadata = await customElements;

      // Replace %VERSION% placeholders
      content = content.replace(/%VERSION%/g, metadata.package.version);

      // Handle [component-header] tags
      content = content.replace(/\[component-header:([a-z-]+)\]/g, (match, tag) => {
        const component = getComponent(metadata, tag);
        let result = '';

        if (!component) {
          console.error(`Component not found in metadata: ${tag}`);
          return next(content);
        }

        let badgeType;
        switch (component.status) {
          case 'stable': badgeType = 'primary'; break;
          case 'experimental': badgeType = 'warning'; break;
          case 'planned': badgeType = 'neutral'; break;
          case 'deprecated': badgeType = 'danger'; break;
          default: badgeType = 'neutral';
        }

        result += `
          <div class="component-header">
            <div class="component-header__tag">
              <code>&lt;${component.tagName}&gt; | ${component.title ?? component.name}</code>
              <glb-badge>Since ${component.since || '?'}</glb-badge>
              <glb-badge variant="${badgeType}" style="text-transform: capitalize;">${component.status}</glb-badge>
            </div>

            <div class="component-header__summary">${component.summary ? component.summary : ''}</div>
          </div>
        `;

        return result.replace(/^ +| +$/gm, '');
      });

      // Handle [component-metadata] tags
      content = content.replace(/\[component-metadata:([a-z-]+)\]/g, (match, tag) => {
        const component = getComponent(metadata, tag);
        let result = '';

        if (!component) {
          console.error(`Component not found in metadata: ${tag}`);
          return next(content);
        }

        // Remove members that are private or don't have a description
        const members = component.members?.filter(member => member.description && member.privacy !== 'private');
        const methods = members?.filter(prop => prop.kind === 'method' && prop.privacy !== 'private');
        const props = members?.filter((prop) => {
          // Look for a corresponding attribute
          const attribute = component.attributes?.find(attr => attr.fieldName === prop.name);
          if (attribute) {
            prop.attribute = attribute.name || attribute.fieldName;
          }

          return prop.kind === 'field' && prop.privacy !== 'private';
        });

        if (component.slots?.length) {
          result += `
            ## Slots
            ${createSlotsTable(component.slots)}

            _TODO: Write doc about using slots._
          `;
        }

        if (props?.length) {
          result += `
            ## Attributes & Properties
            ${createPropsTable(props)}

            _TODO: Write doc about attributes and properties._
          `;
        }

        if (component.events?.length) {
          result += `
            ## Events
            ${createEventsTable(component.events)}

            _TODO: Write doc about listening to events._
          `;
        }

        if (methods?.length) {
          result += `
            ## Methods

            ${createMethodsTable(methods)}

            _TODO: Write doc about calling methods._
          `;
        }

        if (component.cssProperties?.length) {
          result += `
            ## CSS Custom Properties
            ${createCustomPropertiesTable(component.cssProperties)}

            _TODO: Write doc about customizing CSS Custom Properties._
          `;
        }

        if (component.cssParts?.length) {
          result += `
            ## CSS Parts
            ${createPartsTable(component.cssParts)}

            _TODO: Write doc about customizing CSS Parts._
          `;
        }

        if (component.animations?.length) {
          result += `
            ## Animations
            ${createAnimationsTable(component.animations)}

            _TODO: Write doc about customizing animations._
          `;
        }

        if (component.dependencies?.length) {
          result += `
            ## Dependencies

            This component automatically imports the following dependencies.

            ${createDependenciesList(component.tagName, getAllComponents(metadata))}
          `;
        }
        // Strip whitespace so markdown doesn't process things as code blocks
        return result.replace(/^ +| +$/gm, '');
      });

      next(content);
    });
  });
})();
