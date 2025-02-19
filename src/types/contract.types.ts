export interface BaseContract {
  symbol: string;
  contractId: string;
  contractType: string;
  currency: string;
  strategyName: string;
  leader: string;
  leaderId: string;
  strategyId: string;
  stake: number;
}

export interface MultiplierContract extends BaseContract {
  multiplier: number;
  contractCost: number;
}
