import { Pet, PetProperties } from "../business/pet-type"
import { JsonFileStore } from "../utils/json-file-store";

function getNextId<T extends { id: number }>(items: T[]) {
    if (items.length === 0) {
        return 1;
    }
    const ids = items.map(item => item.id);
    const maxId = Math.max(...ids);
    return maxId + 1;
}

export class PetRepository {
    constructor(
        private readonly store: JsonFileStore<Pet>
    ) { }

    async create(petProperties: PetProperties): Promise<Pet> {
        const pets = await this.store.read();
        const nextId = getNextId(pets);

        const newPet: Pet = {
            ...petProperties,
            id: nextId,
        };

        pets.push(newPet);
        await this.store.write(pets);
        return newPet;
    }

    async getAll(): Promise<Pet[]> {
        return this.store.read();
    }

    async getById(id: number): Promise<Pet | null> {
        const pets = await this.store.read();
        const pet = pets.find(pet => pet.id === id);
        return pet || null;

    }

    async feedPet(id: number): Promise<Pet | null> {
        const pets = await this.store.read();
        const pet = pets.find(pet => pet.id === id);
        if (!pet) {
            return null;
        }

        pet.food += 1;
        await this.store.write(pets);

        return pet;
    }

    async makeOlder(id: number): Promise<Pet | null> {
        const pets = await this.store.read();
        const pet = pets.find(pet => pet.id === id);
        if (!pet) {
            return null;
        }

        if (pet.age >= 10) {
            return null;
        }

        pet.age += 1;
        await this.store.write(pets);

        return pet;
    }
}
