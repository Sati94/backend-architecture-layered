import { FastifyInstance } from "fastify";
import createApp from "../src/app"
import { join } from "node:path";
import { PathLike, unlinkSync, mkdirSync, unlink } from "node:fs";

let app: FastifyInstance | undefined;
let testDataFile: PathLike | undefined;


beforeEach(async () => {
  const testDataFileName = `test-data-${Date.now()}.json`
  testDataFile = join(__dirname, 'test-data', testDataFileName)
  mkdirSync(join(__dirname, 'test-data'), { recursive: true });
  app = await createApp({ logger: false }, testDataFile);
})

describe('POST /pets', () => {
  it('should create a pet', async () => {
    const name = 'Fluffy'
    const expectedPet = {
      id: 1,
      name: 'Fluffy',
      age: 1,
      weight: 1,
      food: 1
    }

    const response = await app!
      .inject()
      .body({ name })
      .post('/pets')
    const body = JSON.parse(response.body)

    expect(response.statusCode).toStrictEqual(201);
    expect(body).toStrictEqual(expectedPet)
  })
})

describe('GET /pets', () => {
  it('should get the pets', async () => {
    const createPetBody = { name: 'Fluffy' }
    const expectedPets = [
      { id: 1, name: 'Fluffy', age: 1, weight: 1, food: 1 }
    ]

    await app!
      .inject()
      .body(createPetBody)
      .post('/pets')
    const response = await app!
      .inject()
      .get('/pets')
    const body = JSON.parse(response.body)

    expect(response.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(expectedPets)
  })
})

describe('GET /pets/:id', () => {
  it('should get a pet by ID', async () => {
    const createPetBody = { name: 'Fluffy' };
    const expectedPet = { id: 1, name: 'Fluffy', age: 1, weight: 1, food: 1 };

    // First, create a pet
    await app!
      .inject()
      .body(createPetBody)
      .post('/pets');

    // Now, get the pet by ID
    const response = await app!
      .inject()
      .get('/pets/1'); // Use the ID of the pet created above
    const body = JSON.parse(response.body);

    expect(response.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(expectedPet);
  });

  it('should return 404 if the pet does not exist', async () => {
    const response = await app!
      .inject()
      .get('/pets/999'); // Use a non-existent ID
    expect(response.statusCode).toStrictEqual(404);
  });
});

describe('POST /pets/:id/food', () => {
  it('should feed a pet and increase its food by one', async () => {
    const createPetBody = { name: 'Fluffy' };
    const expectedPet = { id: 1, name: 'Fluffy', age: 1, weight: 1, food: 2 };

    // Create a pet first
    await app!.inject().body(createPetBody).post('/pets');

    // Feed the pet
    const response = await app!.inject().post('/pets/1/food');
    const body = JSON.parse(response.body);

    expect(response.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(expectedPet);
  });

  it('should return 404 if the pet does not exist', async () => {
    const response = await app!.inject().post('/pets/999/food'); // Use a non-existent ID
    expect(response.statusCode).toStrictEqual(404);
    expect(JSON.parse(response.body)).toEqual({ error: 'Pet not found' });
  });

});
describe('POST /pets/:id/age', () => {
  it('should feed a pet and increase its age by one', async () => {
    const createPetBody = { name: 'Fluffy' };
    const expectedPet = { id: 1, name: 'Fluffy', age: 2, weight: 1, food: 1 };


    await app!.inject().body(createPetBody).post('/pets');


    const response = await app!.inject().post('/pets/1/age');
    const body = JSON.parse(response.body);

    expect(response.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(expectedPet);
  });

  it('should return 404 if the pet does not exist', async () => {
    const response = await app!.inject().post('/pets/999/food'); // Use a non-existent ID
    expect(response.statusCode).toStrictEqual(404);
    expect(JSON.parse(response.body)).toEqual({ error: 'Pet not found' });
  });

  it('should return 404 if the pet is already 10 years or older', async () => {
    const createPetBody = { name: 'Oldie' };
    await app!.inject().body(createPetBody).post('/pets');


    for (let i = 0; i < 9; i++) {
      await app!.inject().post('/pets/1/age');
    }

    const response = await app!.inject().post('/pets/1/age');
    expect(response.statusCode).toStrictEqual(404);
    expect(JSON.parse(response.body)).toEqual({ error: 'Pet not found or is dead' });
  });


});

afterEach(() => {
  app?.close();
  unlinkSync(testDataFile!)
})