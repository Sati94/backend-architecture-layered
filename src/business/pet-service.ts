import { PetRepository } from "../data-access/pet-repository";
import { JsonFileStore } from "../utils/json-file-store";
import { Pet } from "./pet-type";

export class PetService {
    private readonly repository;

    constructor(store: JsonFileStore<Pet>) {
        this.repository = new PetRepository(store);
    }

    async born(name: string): Promise<Pet> {

        return this.repository.create({
            name,
            food: 1,
            weight: 1,
            age: 1
        });
    }

    async getAllPets(): Promise<Pet[]> {
        return this.repository.getAll();
    }

    async getPetById(id: number): Promise<Pet | null> {
        return this.repository.getById(id);
    }

    async feedPetById(id: number): Promise<Pet | null> {
        return this.repository.feedPet(id);
    }

    async makeOlderPetById(id: number): Promise<Pet | null> {
        return this.repository.makeOlder(id);
    }
}