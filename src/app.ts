import fastify from 'fastify';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import cors from '@fastify/cors';
import { PathLike } from 'node:fs';
import { JsonFileStore } from './utils/json-file-store';
import { Pet } from './business/pet-type';
import { PetService } from './business/pet-service';

export default async function createApp(options = {}, dataFilePath: PathLike) {
  const app = fastify(options).withTypeProvider<JsonSchemaToTsProvider>();
  await app.register(cors, {});

  const petStore = new JsonFileStore<Pet>(dataFilePath);
  const petService = new PetService(petStore);

  const postPetSchema = {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
      additionalProperties: false,
    },
  } as const;

  app.post('/pets', { schema: postPetSchema }, async (request, reply) => {
    const { name } = request.body;
    const newPet = await petService.born(name);
    reply.status(201).send(newPet);
  });

  app.get('/pets', async (request, reply) => {
    const pets = await petService.getAllPets();
    reply.send(pets);
  });

  app.get('/pets/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const petId = Number(id);
    if (isNaN(petId)) {
      return reply.status(400).send({ error: 'Invalid pet ID' });
    }
    const pet = await petService.getPetById(petId);
    if (!pet) {
      return reply.status(404).send({ error: 'Pet not found' });
    }
    reply.status(200).send(pet);
  })

  app.post('/pets/:id/food', async (request, reply) => {
    const { id } = request.params as { id: string }
    const petId = Number(id);

    try {
      const updatedPet = await petService.feedPetById(petId);

      if (updatedPet === null) {
        reply.status(404).send({ error: 'Pet not found' });
      } else {
        reply.status(200).send(updatedPet);
      }
    } catch (error) {

      reply.status(400);
    }
  });

  app.post('/pets/:id/age', async (request, reply) => {
    const { id } = request.params as { id: string }
    const petId = Number(id);

    try {
      const updatedPet = await petService.makeOlderPetById(petId);
      if (!updatedPet) {
        return reply.status(404).send({ error: 'Pet not found or is dead' });
      }
      reply.status(200).send(updatedPet);
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  return app;
}