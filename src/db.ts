import { Moto } from './interfaces/motos.interface';

const motosArr: Moto[] = [
  {
    id: 'Y2l0eXNjb290Ok1PVE9SU0NPT1RFUjpGRS03MzgtQkM=',
    publicId: 'FE-738-BC',
    type: 'MOTORSCOOTER',
    lat: 48.82782,
    lng: 2.3843216666666662,
    provider: {
      name: 'Cityscoot',
    },
    battery: 89,
  },
  {
    id: 'Y2l0eXNjb290Ok1PVE9SU0NPT1RFUjpFWC03NTYtVEc=',
    publicId: 'EX-756-TG',
    type: 'MOTORSCOOTER',
    lat: 48.83073,
    lng: 2.3869916666666664,
    provider: {
      name: 'Cityscoot',
    },
    battery: 86,
  },
  {
    id: 'Y2l0eXNjb290Ok1PVE9SU0NPT1RFUjpFWC0zMTYtWUE=',
    publicId: 'EX-316-YA',
    type: 'MOTORSCOOTER',
    lat: 48.830753333333334,
    lng: 2.3870000000000005,
    provider: {
      name: 'Cityscoot',
    },
    battery: 89,
  },
  {
    id: 'Y2l0eXNjb290Ok1PVE9SU0NPT1RFUjpGSi0zNDItREw=',
    publicId: 'FJ-342-DL',
    type: 'MOTORSCOOTER',
    lat: 48.830735,
    lng: 2.386938333333333,
    provider: {
      name: 'Cityscoot',
    },
    battery: 91,
  },
  {
    id: 'Y2l0eXNjb290Ok1PVE9SU0NPT1RFUjpGQi0zNjMtV0c=',
    publicId: 'FB-363-WG',
    type: 'MOTORSCOOTER',
    lat: 48.83079166666666,
    lng: 2.3869633333333335,
    provider: {
      name: 'Cityscoot',
    },
    battery: 91,
  },
];

const user = {
  _id: '123',
  name: 'ewa',
  password: 'hello',
  lat: 41.39568,
  lng: 2.1902,
  favorites: [
    {
      label: 'Codeworks',
      destination: `Carrer d'Avila 27, Barcelona`,
      lat: 41.395121557960834,
      lng: 2.1979545270592546,
    },
    {
      label: 'Home',
      destination: `Carrer de Mallorca 278, 08037 Barcelona`,
      lat: 41.39566,
      lng: 2.16501,
    },
  ],
};

export { motosArr, user };
