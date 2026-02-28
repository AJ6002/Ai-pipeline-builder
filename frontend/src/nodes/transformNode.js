// transformNode.js
import { NODE_CONFIGS } from './nodeConfigs';
import { NodeFactory } from './NodeFactory';

export const TransformNode = (props) => (
    <NodeFactory config={NODE_CONFIGS.transform} {...props} />
);
