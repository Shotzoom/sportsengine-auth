export default function poll(
  predicate: () => boolean,
  cb: () => void
): void {
  const interval = setInterval(() => {
    if (predicate()) {
      clearInterval(interval);
      cb();
    }
  });
}
