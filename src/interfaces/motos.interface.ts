export interface Moto {
  id: string;
  publicId: string | null;
  type: string;
  lat: number;
  lng: number;
  provider: {
    name: string;
  };
  battery: number;
  walkTime?: number;
  driveTime?: number | null;
  totalTime?: number | null;
}
