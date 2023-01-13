import {Serializer} from "../src";
import {expect} from "chai";

class Person {
    name!: string;
    pet!: Pet;
}

class Pet {
    name!: string;
    owner: Person | undefined;
}

const srz = new Serializer([Person, Pet]);


describe("Serializer", function () {
    it('Simple recursive', function () {
        const pet = new Pet();
        const person = new Person();

        pet.name = 'Fluffy';
        pet.owner = undefined;

        person.name = 'Michael';
        person.pet = pet;

        const serialized: string = srz.serialize(person);
        const deserialized: Person = srz.deserialize(serialized);

        expect(deserialized.name).to.equal(person.name);
        expect(deserialized.pet.name).to.equal(pet.name);
        expect(deserialized.pet.owner).to.be.null;

        expect(deserialized).to.not.equal(person);
        expect(deserialized.pet).to.not.equal(pet);
    });

    it('Circular', function () {
        const pet = new Pet();
        const person = new Person();

        pet.name = 'Fluffy';
        pet.owner = undefined;

        person.name = 'Michael';
        person.pet = pet;
        pet.owner = person;

        expect(function () { srz.serialize(person) }).to.throw;
    });
});