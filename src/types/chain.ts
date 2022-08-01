export interface Genesis {
  genesis_url: string;
}

export interface Codebase {
  git_repo: string;
  recommended_version: string;
  compatible_versions: string[];
}

export interface PersistentPeer {
  id: string;
  address: string;
}

export interface Seed {
  id: string;
  address: string;
}

export interface Peers {
  persistent_peers: PersistentPeer[];
  seeds: Seed[];
}

export interface Rpc {
  address: string;
  provider: string;
}

export interface Rest {
  address: string;
  provider: string;
}

export interface Grpc {
  address: string;
  provider: string;
}

export interface Apis {
  rpc: Rpc[];
  rest: Rest[];
  grpc: Grpc[];
}

export interface Explorer {
  kind: string;
  url: string;
  tx_page: string;
}

export interface ChainConfig {
  $schema: string;
  chain_name: string;
  status: string;
  network_type: string;
  pretty_name: string;
  chain_id: string;
  bech32_prefix: string;
  slip44: number;
  daemon_name: string;
  node_home: string;
  genesis: Genesis;
  codebase: Codebase;
  peers: Peers;
  apis: Apis;
  explorers: Explorer[];
}
