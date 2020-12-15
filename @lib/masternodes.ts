export type MasternodesDataItem = {
  date: string;
  active: number;
  warmup: number;
};
export type MasternodesData = MasternodesDataItem[];
export type RawMasternodeStats = { ACTIVE: number; WARMUP: number };
