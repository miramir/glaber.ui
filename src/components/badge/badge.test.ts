import { beforeEach, describe, expect, it, test } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import type Badge from './badge';
import './badge';

describe('<glb-badge>', () => {
  let el: Badge;

  describe('when provided no parameters', () => {
    beforeEach(async () => {
      el = await fixture<Badge>(html` <glb-badge>Badge</glb-badge> `);
    });

    it('should pass accessibility tests with a role of status on the base part.', async () => {
      expect(el).toBeTruthy();

      const part = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(part.getAttribute('role')).toBe('status');
    });

    it('should render the child content provided', () => {
      expect(el.innerText).toBe('Badge');
    });

    it('should default to square styling, with the primary color', () => {
      const part = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(part.classList.value.trim()).toBe('badge badge--primary');
    });
  });

  describe('when provided a pill parameter', () => {
    it('should append the pill class to the classlist to render a pill', async () => {
      el = await fixture<Badge>('<glb-badge pill>Badge</glb-badge>');
      expect(el).toBeTruthy();
      const part = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(part.classList.value.trim()).toBe('badge badge--primary badge--pill');
    });
  });

  describe('when provided a pulse parameter', () => {
    it('should append the pulse class to the classlist to render a pulse', async () => {
      el = await fixture<Badge>('<glb-badge pulse>Badge</glb-badge>');
      expect(el).toBeTruthy();
      const part = el.shadowRoot!.querySelector('[part~="base"]')!;
      expect(part.classList.value.trim()).toBe('badge badge--primary badge--pulse');
    });
  });

  const variants = ['primary', 'success', 'neutral', 'warning', 'danger'];

  test.each(variants)('when passed a variant attribute %s', async (variant: string) => {
    el = await fixture<Badge>(html`<glb-badge variant="${variant}">Badge</glb-badge>`);
    expect(el).toBeTruthy();
    const part = el.shadowRoot!.querySelector('[part~="base"]')!;
    expect(part.classList.value.trim()).toBe(`badge badge--${variant}`);
  });
});
