declare module "vue-d3-network" {
  import { DefineComponent } from "vue";

  interface Node {
    id: string;
    name: string;
    _color?: string;
    _size?: number;
    [key: string]: any;
  }

  interface Link {
    sid: string;
    tid: string;
    _color?: string;
    [key: string]: any;
  }

  interface D3NetworkOptions {
    force?: number;
    size?: { w: number; h: number };
    nodeSize?: number;
    nodeLabels?: boolean;
    linkWidth?: number;
    fontSize?: number;
    canvas?: boolean;
    [key: string]: any;
  }

  interface D3NetworkProps {
    netNodes: Node[];
    netLinks: Link[];
    options?: D3NetworkOptions;
  }

  const D3Network: DefineComponent<D3NetworkProps>;
  export default D3Network;
}
