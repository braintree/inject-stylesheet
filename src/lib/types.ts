type StyleRule = Record<string, string | number>;

export type Style = Record<
  string,
  string | number | StyleRule | Record<string, StyleRule>
>;
