interface IQueryStringValues {
  [key: string]: string;
}

export function stringify(values: IQueryStringValues): string {
  if (values == null) {
    return "";
  }

  const keys = Object.keys(values);
  const parameters = [];

  for (const key of keys) {
    const value = values[key];

    parameters.push(
      [
        encodeURIComponent(key),
        encodeURIComponent(value)
      ].join("=")
    );
  }

  return parameters.join("&");
}
