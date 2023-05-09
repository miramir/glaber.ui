type GlbErrorEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'glb-error': GlbErrorEvent;
  }
}

export default GlbErrorEvent;
