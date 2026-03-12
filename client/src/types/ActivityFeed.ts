export interface ActivityFeed {
  id: string;
  actorId?: string;
  actorName: string;
  action: string;
  details: string;
  module: string;
  createdAt: Date;
}
