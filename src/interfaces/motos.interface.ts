export interface Moto {
  id: string;
  publicId: string | null;
  type: string;
  latitude: number;
  longitude: number;
  provider: {
    name: string;
    app: {
      android: string;
      ios: string;
    };
  };
  battery: number;
  walkTime?: number;
  driveTime?: number | null;
  totalTravelTime?: number | null;
  isIncomming?: boolean;
  creationTime?: Date;
}
