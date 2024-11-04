import fastify from 'fastify';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'
import cors from '@fastify/cors';
import { readFile, writeFile } from 'node:fs/promises';
import { PathLike, existsSync, writeFileSync } from 'node:fs';

function getNextId<T extends {id: number}>(items: T[]) {
  if (items.length === 0) {
    return 1;
  }
  const ids = items.map(item => item.id);
  const maxId = Math.max(...ids);
  return maxId + 1;
}

class JsonFileStore<T> {
  constructor(private readonly path: PathLike) {
    if(!existsSync(this.path)) {
      writeFileSync(this.path, '[]', 'utf-8');
    }
  }

  async read() {
    const content = await readFile(this.path, 'utf-8');
    const data = JSON.parse(content) as T[];
    return data 
  }
  async write(data: T[]) {
    const content = JSON.stringify(data, null, 2);
    await writeFile(this.path, content, 'utf-8');
  } 

}


type Pet = {
  id: number,
  name: string
  food: number,
  weight: number
  age: number,
}

export default async function createApp(options = {}, dataFilePath: PathLike) {
  const app = fastify(options).withTypeProvider<JsonSchemaToTsProvider>()
  await app.register(cors, {});

  const petStore = new JsonFileStore<Pet>(dataFilePath);

  const postPetSchema = {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
      additionalProperties: false
    }
  } as const
  app.post(
    '/pets',
    { schema: postPetSchema },
    async (request, reply) => {
      const { name } = request.body

      const pets = await petStore.read();
      const nextId = getNextId(pets);
      const newPet: Pet = {
        id: nextId,
        name,
        food: 1,
        weight: 1,
        age: 1
      }
      pets.push(newPet);
      await petStore.write(pets);

      reply.status(201);
      return newPet;
    }
  )

  app.get(
    '/pets',
    async () => {
      const pets = await petStore.read();
      return pets;
    }
  )

  return app;
}