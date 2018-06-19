interface QueryStringValues {
  [key: string]: string
}

export function stringify(values: QueryStringValues): string {
  if (values == null) {
    return '';
  }

  const keys = Object.keys(values);
  const parameters = [];

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = values[key];

    parameters.push(
      [
        encodeURIComponent(key),
        encodeURIComponent(value)
      ].join('=')
    );
  }

  return parameters.join('&');
}
