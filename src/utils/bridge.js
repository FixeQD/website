/**
 * Simple interaction bridge to send signals from UI to Three.js scene
 */
class InteractionBridge {
  constructor() {
    this.subscribers = new Set();
  }

  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  emit(type, data) {
    this.subscribers.forEach(fn => fn(type, data));
  }
}

export const bridge = new InteractionBridge();
