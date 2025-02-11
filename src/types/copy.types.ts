export interface CopyRelationship {
    id: string;
    copierId: string;
    leaderId: string;
    strategyId: string;
    copierAccountId: string;
    status: "active" | "paused" | "stopped";
    copySize: number; // Amount to copy with
    createdAt: string;
    updatedAt: string;
}
