import { beforeEach, describe, expect, it } from 'vitest';
import { elementUpdated, fixture, html, oneEvent } from '@open-wc/testing-helpers';
import { registerIconLibrary } from './library';
import type { IconsMap } from './library';
import type Icon from './icon';
import './icon';

import type GlbErrorEvent from '../../events/glb-error';
import type GlbLoadEvent from '../../events/glb-load';

/* eslint-disable max-len */
const testLibraryIcons:IconsMap = {
  'test-icon1': `
    <svg id="test-icon1">
      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
    </svg>
  `,
  'test-icon2': `
    <svg id="test-icon2">
    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
    </svg>
  `,
  'bad-icon': '<div></div>',
};
/* eslint-enable max-len */

describe('<glb-icon>', () => {
  beforeEach(() => {
    registerIconLibrary('test-library', {
      resolver: (name: keyof typeof testLibraryIcons) => {
        // only for testing a bad request
        if (name === ('bad-request' as keyof typeof testLibraryIcons)) {
          return 'data:image/svg+xml';
        }

        if (name in testLibraryIcons) {
          return `data:image/svg+xml,${encodeURIComponent(testLibraryIcons[name])}`;
        }
        return '';
      },
      mutator: (svg: SVGElement) => svg.setAttribute('fill', 'currentColor'),
    });
  });

  describe('defaults ', () => {
    it('default properties', async () => {
      const el = await fixture<Icon>(html`<glb-icon></glb-icon>`);

      expect(el.name).toBeUndefined();
      expect(el.src).toBeUndefined();
      expect(el.label).toBe('');
      expect(el.library).toBe('default');
    });

    it('renders pre-loaded system icons and emits glb-load event', async () => {
      const el = await fixture<Icon>('<glb-icon library="system"></glb-icon>');

      expect(el.library).toBe('system');

      const listener = oneEvent(el, 'glb-load') as Promise<GlbLoadEvent>;

      el.name = 'check';
      const ev = await listener;
      await elementUpdated(el);

      expect(el.shadowRoot?.querySelector('svg')).toBeTruthy();
      expect(ev).toBeTruthy();
    });

    it('the icon is accessible', async () => {
      const el = await fixture<Icon>('<glb-icon library="system" name="check"></glb-icon>');
      expect(el).toBeTruthy();
      expect(el.library).toBe('system');
    });

    it('the icon has the correct default aria attributes', async () => {
      const el = await fixture<Icon>('<glb-icon library="system" name="check"></glb-icon>');

      expect(el.getAttribute('role')).toBeNull();
      expect(el.getAttribute('aria-label')).toBeNull();
      expect(el.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('when a label is provided', () => {
    it('the icon has the correct default aria attributes', async () => {
      const fakeLabel = 'a label';
      const el = await fixture<Icon>(html` <glb-icon label="${fakeLabel}" library="system" name="check"></glb-icon> `);

      expect(el.getAttribute('role')).toBe('img');
      expect(el.getAttribute('aria-label')).toBe(fakeLabel);
      expect(el.getAttribute('aria-hidden')).toBeNull();
    });
  });

  describe('when a valid src is provided', () => {
    it('the svg is rendered', async () => {
      const fakeId = 'test-src';
      const el = await fixture<Icon>('<glb-icon></glb-icon>');

      const listener = oneEvent(el, 'glb-load');
      el.src = `data:image/svg+xml,${encodeURIComponent(`<svg id="${fakeId}"></svg>`)}`;

      await listener;
      await elementUpdated(el);

      expect(el.shadowRoot?.querySelector('svg')).toBeTruthy();
      expect(el.shadowRoot?.querySelector('svg')?.getAttribute('id')).toBe(fakeId);
    });
  });

  describe('new library', () => {
    it('renders icons from the new library and emits glb-load event', async () => {
      const el = await fixture<Icon>('<glb-icon library="test-library"></glb-icon>');
      const listener = oneEvent(el, 'glb-load') as Promise<GlbLoadEvent>;

      el.name = 'test-icon1';
      await listener;
      await elementUpdated(el);

      expect(el.shadowRoot?.querySelector('svg')).toBeTruthy();
    });

    it('runs mutator from new library', async () => {
      const el = await fixture<Icon>('<glb-icon library="test-library" name="test-icon1"></glb-icon>');
      await elementUpdated(el);

      const svg = el.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('fill')).toBe('currentColor');
    });
  });

  describe('negative cases', () => {
    // using new library so we can test for malformed icons when registered
    it("svg not rendered with an icon that doesn't exist in the library", async () => {
      const el = await fixture<Icon>(html` <glb-icon library="test-library" name="does-not-exist"></glb-icon> `);

      expect(el.shadowRoot?.querySelector('svg')).toBeNull();
    });

    it('emits glb-error when the file cant be retrieved', async () => {
      const el = await fixture<Icon>(html` <glb-icon library="test-library"></glb-icon> `);
      const listener = oneEvent(el, 'glb-error') as Promise<GlbErrorEvent>;

      el.name = 'bad-request';
      const ev = await listener;
      await elementUpdated(el);

      expect(el.shadowRoot?.querySelector('svg')).toBeNull();
      expect(ev).toBeTruthy();
    });

    it("emits glb-error when there isn't an svg element in the registered icon", async () => {
      const el = await fixture<Icon>(html` <glb-icon library="test-library"></glb-icon> `);
      const listener = oneEvent(el, 'glb-error') as Promise<GlbErrorEvent>;

      el.name = 'bad-icon';
      const ev = await listener;
      await elementUpdated(el);

      expect(el.shadowRoot?.querySelector('svg')).toBeNull();
      expect(ev).toBeTruthy();
    });
  });
});
