// apiNode.js
import { NODE_CONFIGS } from './nodeConfigs';
import { NodeFactory } from './NodeFactory';

export const ApiNode = (props) => (
    <NodeFactory config={NODE_CONFIGS.apiCall} {...props} />
);
