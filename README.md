# HTTP requests and responses

## Setting up the repo

### Install NPM dependencies

- Issue an `npm install` command.

### Test the server

- Issue an `npm run dev` command.
- Initiate a `GET http://localhost:4400/pets` (e.g. with the REST Client from the `requests.http`) file.

### Test the test framework

- Issue an `npm test -- pets.test.ts` command.
- This run the tests from the `pets.test.ts` file to check the test framework is set up properly.

## Using the repo

- Start a development server in watch mode: `npm run dev`.
- Run all tests: `npm test`.
- Run a specific test file `npm test -- <file name>`.
- Create a production build (TS -> JS): `npm run build`.
- Start the production build: `npm start`.

## Tasks

Check the [tasks.md](./tasks.md) for the details.
