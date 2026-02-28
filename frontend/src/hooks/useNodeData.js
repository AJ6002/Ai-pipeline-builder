// useNodeData.js
// ─────────────────────────────────────────────────────────────────────────────
// Thin hook that gives any node clean read/write access to its own fields.
// Keeps node components decoupled from direct store access.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback } from 'react';
import { useStore } from '../store';

/**
 * Returns the current field values and a setter for a given node id.
 *
 * Usage inside any node:
 *   const { data, setField } = useNodeData(id);
 *   setField('myField', newValue);
 *
 * @param {string} nodeId
 */
export const useNodeData = (nodeId) => {
    const updateNodeField = useStore((state) => state.updateNodeField);

    const setField = useCallback(
        (fieldName, value) => {
            updateNodeField(nodeId, fieldName, value);
        },
        [nodeId, updateNodeField]
    );

    return { setField };
};
