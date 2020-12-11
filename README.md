## eMoto Server

![eMoto-logo](C:\Users\msubi\Desktop\thesis\eMoto-logo.png)

Web Server for the eMoto app. Find the client side on this repo: <link to repo> 

## Description

Our server is built using [Nest.js](https://nestjs.com/) together with [MongoDB](https://www.mongodb.com/) and [Mongoose](https://mongoosejs.com/). 

Nest.js is a Node.js framework that takes advantage of the latest JavaScript features, and we combined it with TypeScript for a more robust code environment.

Since our server works with [Fluctuo](https://fluctuo.com/) API to get the real-time moto data and two [Mapbox](https://www.mapbox.com/) APIs to geolocate the motos ([Geocoding](https://docs.mapbox.com/api/search/geocoding/) and [Navigation](https://docs.mapbox.com/api/navigation/)), you will need tokens to be able to send requests.

## Installation

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