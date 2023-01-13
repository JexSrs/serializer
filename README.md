# Serializer
A simple dependency-free recursive class/interface serializer.

## Installation
```shell
npm i @jexsrs/serializer
```

## Initialization
First we have to create an array of the types we want to serialize:
```typescript
const types = [Person, Pet]; // The order must always be the same
```
Where `Person` and `Pet` are the following classes
```typescript
class Person {
    name: string;
    pet: Pet;
}

class Pet {
    name: string;
}
```
Then we initialize the Serializer with the given types:
```typescript
import {Serializer} from "@jexsrs/serializer";

const srz = new Serializer(types);
```
After that you can serialize and deserialize the classes as follows:
```typescript
const pet = new Pet();
pet.name = 'Fluffy';

const person = new Person();
person.name = 'Michael';
person.pet = pet;

const serialized: string = srz.serialize(person);
const desrialized: Person = srz.deserialize(serialized);
```

## Keep in mind
The serializer is recursive but cannot handle circular entries, for example:
```typescript
class Person {
    name: string;
    pet: Pet;
}

class Pet {
    name: string;
    owner: Person;
}

const pet = new Pet();
pet.name = 'Fluffy';

const person = new Person();
person.name = 'Michael';
person.pet = pet;

pet.owner = person; // This will cause the failure

const serialized: string = srz.serialize(person); // !!! This will fail
const desrialized: Person = srz.deserialize(serialized);
```
