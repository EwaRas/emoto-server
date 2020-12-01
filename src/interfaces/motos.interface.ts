export interface Moto {
  id: string;
  publicId: string;
  type: string;
  lat: number;
  lng: number;
  provider: {
    name: string;
  };
  battery: number;
}
