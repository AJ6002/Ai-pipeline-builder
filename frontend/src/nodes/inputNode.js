// inputNode.js
import { NODE_CONFIGS } from './nodeConfigs';
import { NodeFactory } from './NodeFactory';

export const InputNode = (props) => (
  <NodeFactory config={NODE_CONFIGS.customInput} {...props} />
);
