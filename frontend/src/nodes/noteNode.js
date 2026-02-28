// noteNode.js
import { NODE_CONFIGS } from './nodeConfigs';
import { NodeFactory } from './NodeFactory';

export const NoteNode = (props) => (
    <NodeFactory config={NODE_CONFIGS.note} {...props} />
);
