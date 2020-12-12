# eMoto Server

![eMoto-logo](https://github.com/EwaRas/moto-server/blob/main/eMotoLogo.png)

Nowadays our cities are full of companies offering electric moto sharing services. Users have to spend time switching apps to find motos around and don't have the possibility to compare and know what's the fastest option.

eMoto is the solution for that. Users can see all the available motos in just one map, and quickly know which moto is gonna take them faster to the destination.

But that's not all, with eMoto users can also see the future!

Even in the case of not having any motos around, they can see the incoming ones in the area!


## Description

Web Server for the eMoto app. Find the client side on this repo: [eMoto-client](https://github.com/Marcel2408/emoto-finder).

Our server is built using [Nest.js](https://nestjs.com/) together with [MongoDB](https://www.mongodb.com/) and [Mongoose](https://mongoosejs.com/).

Nest.js is a Node.js framework that takes advantage of the latest JavaScript features, and we combined it with TypeScript for a more robust code environment.

Since our server works with [Fluctuo](https://fluctuo.com/) API to get the real-time moto data and two [Mapbox](https://www.mapbox.com/) APIs to geolocate the motos: ([Geocoding](https://docs.mapbox.com/api/search/geocoding/) and [Navigation](https://docs.mapbox.com/api/navigation/)), you will need tokens to be able to send requests.

## Installation

Clone the repo:

```bash
$ git clone https://github.com/EwaRas/emoto-server.git
$ cd emoto-server
```

Install dependencies:

```bash
$ npm install
```

Create a ```.env``` in the root level of this repo.

Fill the file with the following info:

 ```
FLUCTUO_TOKEN=<replace this with your Fluctuo token>
MAPBOX_TOKEN=<replace this with your Mapbox token>
 ```

## Running the app

```bash
$ npm run start
```

The server will run on localhost:4000

## Developers

- Ewa Rasala - [Github](https://github.com/ewaras) - [LinkedIn](https://www.linkedin.com/in/ewa-rasala)
- Carlos De Sousa - [Github](https://github.com/carlosdsv) - [LinkedIn](https://www.linkedin.com/in/carlosdsv/)
- Rafał Witczak [Github](https://github.com/rafwit/) - [LinkedIn](https://www.linkedin.com/in/rafalwitczak/)
- Marcel Subirana - [Github](https://github.com/marcel2408) - [LinkedIn](https://www.linkedin.com/in/marcel-subirana-campanera/)