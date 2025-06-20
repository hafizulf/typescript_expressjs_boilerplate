export enum OriginType {
  HTTP = 'http',
  WS = 'ws',
}

export interface TPropsCreateOrigin {
  origin: string;
  type: OriginType;
  isBlocked: boolean;
}
