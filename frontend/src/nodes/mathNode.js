// mathNode.js
import { NODE_CONFIGS } from './nodeConfigs';
import { NodeFactory } from './NodeFactory';

export const MathNode = (props) => (
    <NodeFactory config={NODE_CONFIGS.math} {...props} />
);
