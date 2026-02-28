// filterNode.js
import { NODE_CONFIGS } from './nodeConfigs';
import { NodeFactory } from './NodeFactory';

export const FilterNode = (props) => (
    <NodeFactory config={NODE_CONFIGS.filter} {...props} />
);
