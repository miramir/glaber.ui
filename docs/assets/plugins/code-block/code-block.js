/* global Prism */

(() => {
  let count = 1;

  if (!window.$docsify) {
    throw new Error('Docsify must be loaded before installing this plugin.');
  }

  function runScript(script) {
    const newScript = document.createElement('script');

    if (script.type === 'module') {
      newScript.type = 'module';
      newScript.textContent = script.innerHTML;
    } else {
      newScript.appendChild(document.createTextNode(`(() => { ${script.innerHTML} })();`));
    }

    script.parentNode.replaceChild(newScript, script);
  }

  window.$docsify.plugins.push((hook) => {
    // Convert code blocks to previews
    hook.afterEach((html, next) => {
      const domParser = new DOMParser();
      const doc = domParser.parseFromString(html, 'text/html');

      [...doc.querySelectorAll('code[class^="lang-"]')].forEach((code) => {
        if (code.classList.contains('preview')) {
          const isExpanded = code.classList.contains('expanded');
          const pre = code.closest('pre');
          const sourceGroupId = `code-block-source-group-${count}`;
          const toggleId = `code-block-toggle-${count}`;

          pre.setAttribute('data-lang', pre.getAttribute('data-lang').replace(/ preview$/, ''));
          pre.setAttribute('aria-labelledby', toggleId);

          const codeBlock = `
            <div class="code-block ${isExpanded ? 'code-block--expanded' : ''}">
              <div class="code-block__preview">
                ${code.textContent}
                <div class="code-block__resizer">
                  <sl-icon name="grip-vertical"></sl-icon>
                </div>
              </div>

              <div class="code-block__source-group" id="${sourceGroupId}">
                <div class="code-block__source code-block__source--html">
                  ${pre.outerHTML}
                </div>
              </div>

              <div class="code-block__buttons">
                <button
                  type="button"
                  class="code-block__button code-block__toggle"
                  aria-expanded="${isExpanded ? 'true' : 'false'}"
                  aria-controls="${sourceGroupId}"
                >
                  Source
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          `;

          pre.replaceWith(domParser.parseFromString(codeBlock, 'text/html').body);

          count++;
        }
      });

      // Force the highlighter to run again so JSX fields get highlighted properly
      requestAnimationFrame(() => Prism.highlightAll());

      next(doc.body.innerHTML);
    });

    // After the page is done loading, force scripts in previews to execute
    hook.doneEach(() => {
      [...document.querySelectorAll('.code-block__preview script')].map(script => runScript(script));
    });

    // Horizontal resizing
    hook.doneEach(() => {
      [...document.querySelectorAll('.code-block__preview')].forEach((preview) => {
        const resizer = preview.querySelector('.code-block__resizer');
        let startX;
        let startWidth;

        function setWidth(width) {
          // eslint-disable-next-line no-param-reassign
          preview.style.width = `${width}px`;
        }

        function dragMove(event) {
          setWidth(startWidth + (event.changedTouches ? event.changedTouches[0].pageX : event.pageX) - startX);
        }

        function dragStop() {
          preview.classList.remove('code-block__preview--dragging');
          document.documentElement.removeEventListener('mousemove', dragMove);
          document.documentElement.removeEventListener('touchmove', dragMove);
          document.documentElement.removeEventListener('mouseup', dragStop);
          document.documentElement.removeEventListener('touchend', dragStop);
        }

        function dragStart(event) {
          startX = event.changedTouches ? event.changedTouches[0].pageX : event.clientX;
          startWidth = parseInt(document.defaultView.getComputedStyle(preview).width, 10);
          preview.classList.add('code-block__preview--dragging');
          event.preventDefault();
          document.documentElement.addEventListener('mousemove', dragMove);
          document.documentElement.addEventListener('touchmove', dragMove);
          document.documentElement.addEventListener('mouseup', dragStop);
          document.documentElement.addEventListener('touchend', dragStop);
        }

        resizer.addEventListener('mousedown', dragStart);
        resizer.addEventListener('touchstart', dragStart, { passive: true });
      }, false);
    });
  });

  function toggleSource(event, codeBlock, force) {
    const toggle = codeBlock.querySelector('.code-block__toggle');

    if (toggle) {
      codeBlock.classList.toggle('code-block--expanded', force === undefined ? undefined : force);
      event.target.setAttribute('aria-expanded', codeBlock.classList.contains('code-block--expanded'));
    }
  }

  // Toggle source mode
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.code-block__button');
    const codeBlock = button?.closest('.code-block');

    if (button?.classList.contains('code-block__toggle')) {
      // Toggle source
      toggleSource(event, codeBlock);
    }
  });
})();
