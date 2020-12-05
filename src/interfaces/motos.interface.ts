export interface Moto {
  id: string;
  publicId: string | null;
  type: string;
  latitude: number;
  longitude: number;
  provider: {
    name: string;
  };
  battery: number;
  walkTime?: number;
  driveTime?: number | null;
  totalTravelTime?: number | null;
  isIncomming?: boolean;
}
