import type { ValidationFunction } from "../types/validation";

const URL_RE =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

// `{{name}}` tokens are resolved at run time, so a URL is checked with each
// token standing in as a plain path segment.
const VARIABLE_TOKEN_RE = /{{[\w-]+}}/g;

export const VALIDATION_FUNCTION: ValidationFunction = {
  required: (value) => value.length > 0,
  url: (value) => URL_RE.test(value.replace(VARIABLE_TOKEN_RE, "x"))
};
