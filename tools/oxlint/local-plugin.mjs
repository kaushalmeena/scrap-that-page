// Project-specific lint rules, loaded by oxlint through `jsPlugins`.

const isFunction = (node) =>
  node?.type === "ArrowFunctionExpression" ||
  node?.type === "FunctionExpression";

/**
 * local/no-inline-jsx-function — handlers are declared as named functions
 * above the `return`, never written inline in JSX props:
 *
 *   const handleSave = () => save(script);   // ✓
 *   <Button onClick={handleSave} />          // ✓
 *   <Button onClick={() => save(script)} />  // ✗
 *
 * Per-item handlers in lists belong in a small row component that receives
 * the item and calls its own named handler.
 */
const noInlineJsxFunction = {
  meta: {
    type: "suggestion",
    docs: { description: "Disallow inline functions in JSX attributes." },
    messages: {
      inline:
        "Move this inline function into a named handler declared above the return."
    },
    schema: []
  },
  create(context) {
    return {
      JSXAttribute(node) {
        const value = node.value;
        if (
          value?.type === "JSXExpressionContainer" &&
          isFunction(value.expression)
        ) {
          context.report({ node: value, messageId: "inline" });
        }
      }
    };
  }
};

export default {
  meta: { name: "local" },
  rules: { "no-inline-jsx-function": noInlineJsxFunction }
};
