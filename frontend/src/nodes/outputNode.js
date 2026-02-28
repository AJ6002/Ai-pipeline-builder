// outputNode.js
import { NODE_CONFIGS } from './nodeConfigs';
import { NodeFactory } from './NodeFactory';

export const OutputNode = (props) => (
  <NodeFactory config={NODE_CONFIGS.customOutput} {...props} />
);
