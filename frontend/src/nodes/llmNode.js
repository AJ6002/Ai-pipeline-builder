// llmNode.js
import { NODE_CONFIGS } from './nodeConfigs';
import { NodeFactory } from './NodeFactory';

export const LLMNode = (props) => (
  <NodeFactory config={NODE_CONFIGS.llm} {...props} />
);
