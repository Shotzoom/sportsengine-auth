export default function listen(
  target: EventTarget,
  event: string,
  listener: EventListener,
  options?: boolean | AddEventListenerOptions
): () => void {
  target.addEventListener(event, listener);

  return function unlisten() {
    target.removeEventListener(event, listener);
  };
}
