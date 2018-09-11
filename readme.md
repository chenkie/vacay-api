# Vacay API

## Getting Started

Welcome to the Vacay API.

Start by installing the dependencies. Make sure you have Node installed and then run:

```bash
npm install
```

## Run the API

Make sure you have nodemon installed globally

```bash
npm i nodemon
```

Then run the `dev` script to start the API.

```
npm run dev
```

The API will be served at `localhost:3000`.

## Rename `.env.example`

The API relies on keys supplied in the `.env` file. A sample `.env` file is provided with the key names. Rename `.env.example` to `.env` and populate the keys.

## Get an mLab Account

The login and signup transactions won't work until you have set up the API and connected to mLab.

Go to [mLab](https://mlab.com) and sign up for an account. Create a new sandbox database and a user for it. Copy the connection string and paste it into the `.env.example` file at the root of this project.
