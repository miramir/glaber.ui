import { LitElement } from 'lit';
import type { CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getIconLibrary, unwatchIcon, watchIcon } from './library';
import { watch } from '../../internal/watch';
import styles from './icon.styles';

const CACHEABLE_ERROR = Symbol('cacheable error');
const RETRYABLE_ERROR = Symbol('retryable error');
type SVGResult = SVGSVGElement | typeof RETRYABLE_ERROR | typeof CACHEABLE_ERROR;

let parser: DOMParser;
const iconCache = new Map<string, Promise<SVGResult>>();

/**
 * Icons are symbols that can be used to represent various options within an application.
 * @documentation none
 * @tag glb-icon
 * @status stable
 * @since 0.0.1
 *
 * @event sl-load - Emitted when the icon has loaded.
 * @event sl-error - Emitted when the icon fails to load due to an error.
 *
 * @csspart svg - The internal SVG element.
 */
@customElement('glb-icon')
export default class Icon extends LitElement {
  static styles: CSSResultGroup = styles;

  /** Given a URL, this function returns the resulting SVG element or an appropriate error symbol. */
  private static async resolveIcon(url: string): Promise<SVGResult> {
    let fileData: Response;
    try {
      fileData = await fetch(url, { mode: 'cors' });
      if (!fileData.ok) return fileData.status === 410 ? CACHEABLE_ERROR : RETRYABLE_ERROR;
    } catch {
      return RETRYABLE_ERROR;
    }

    try {
      const div = document.createElement('div');
      div.innerHTML = await fileData.text();

      const svg = div.firstElementChild;
      if (svg?.tagName?.toLowerCase() !== 'svg') return CACHEABLE_ERROR;

      if (!parser) parser = new DOMParser();
      const doc = parser.parseFromString(svg.outerHTML, 'text/html');

      const svgEl = doc.body.querySelector('svg');
      if (!svgEl) return CACHEABLE_ERROR;

      return document.adoptNode(svgEl);
    } catch {
      return CACHEABLE_ERROR;
    }
  }

  @state() private svg: SVGElement | null = null;

  /** The name of the icon to draw. Available names depend on the icon library being used. */
  @property({ reflect: true }) name?: string;

  /**
   * An external URL of an SVG file. Be sure you trust the content you are including, as it will be executed as code and
   * can result in XSS attacks.
   */
  @property() src?: string;

  /**
   * An alternate description to use for assistive devices. If omitted, the icon will be considered presentational and
   * ignored by assistive devices.
   */
  @property() label = '';

  /** The name of a registered custom icon library. */
  @property({ reflect: true }) library = 'default';

  connectedCallback() {
    super.connectedCallback();
    watchIcon(this);
  }

  firstUpdated() {
    this.setIcon();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    unwatchIcon(this);
  }

  private getUrl() {
    const library = getIconLibrary(this.library);
    if (this.name && library) {
      return library.resolver(this.name);
    }
    return this.src;
  }

  @watch('label')
  handleLabelChange() {
    const hasLabel = typeof this.label === 'string' && this.label.length > 0;

    if (hasLabel) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', this.label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }
  }

  @watch(['name', 'src', 'library'])
  async setIcon() {
    const library = getIconLibrary(this.library);
    const url = this.getUrl();

    if (!url) {
      this.svg = null;
      return;
    }

    let iconResolver = iconCache.get(url);
    if (!iconResolver) {
      iconResolver = Icon.resolveIcon(url);
      iconCache.set(url, iconResolver);
    }

    const svg = await iconResolver;
    if (svg === RETRYABLE_ERROR) {
      iconCache.delete(url);
    }

    if (url !== this.getUrl()) {
      // If the url has changed while fetching the icon, ignore this request
      return;
    }

    let eventName = '';

    switch (svg) {
      case RETRYABLE_ERROR:
      case CACHEABLE_ERROR:
        this.svg = null;
        eventName = 'glb-error';
        break;
      default:
        this.svg = svg.cloneNode(true) as SVGElement;
        library?.mutator?.(this.svg);
        eventName = 'glb-load';
    }

    const event = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: false,
      composed: true,
    });

    this.dispatchEvent(event);
  }

  render() {
    return this.svg;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'glb-icon': Icon;
  }
}
