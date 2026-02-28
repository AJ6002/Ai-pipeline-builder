// parseVariables.js
// ─────────────────────────────────────────────────────────────────────────────
// Extracts {{variable}} handles from text content.
//
// Rules (defensive programming):
//   ✅ {{name}}        → valid (letter start)
//   ✅ {{_name}}       → valid (underscore start)
//   ✅ {{camelCase}}   → valid
//   ✅ {{name_2}}      → valid
//   ❌ {{123abc}}      → silently ignored (must not start with digit)
//   ❌ {{ spaces }}    → ignored (no whitespace allowed inside)
//   ❌ {{}}            → ignored (empty)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts all unique, valid variable names from a `{{varName}}` template string.
 * @param {string} text - The raw text content to parse.
 * @returns {string[]} - Deduplicated array of valid variable names.
 */
export const parseVariables = (text) => {
    if (!text || typeof text !== 'string') return [];

    // Only match identifiers that start with a letter or underscore,
    // followed by zero or more word characters (letters, digits, underscores).
    const regex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

    const vars = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        vars.push(match[1]);
    }

    // Deduplicate: same variable name → one handle
    return [...new Set(vars)];
};
