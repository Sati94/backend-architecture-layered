# Tasks

## Use Case

- We are going to create a server that manage a pet keeping application, like Tamagochies, similar to Tetova Teve Club, Hosemberkepzo.
- The user can create a new pet.
- The user can get the list of pets.
- The user can get the status of one pet.
- The user the user can feed a given pet.
- The user can make older a pet of one day.

When a day passes, the pet behaves like this:

- If there is food in front of it, it eats it. Hence the food is decreased by one and its weight increased by one.
- If there is no food in front of the pet, its weight is decreased by one if at least it has one weight.
- If the pet's weight goes to zero, unfortunately it is dead.
- When a pet is dead it is not possible to feed them or make it older.

## Task 1: Get to know your code

Answer these questions:

- What is the entrypoint of this application?
- How can we start a dev server?
- Where can you find the API specification?
- What endpoints are currently implemented?

## Task 2: Refactor our code

Answer these questions:

- What is the problem with the code from clean coding point of view?
- What kind of concerns can you recognize in the `app.ts`?
- What kind of tests are easy to write to this code?

Refactor the code to the *Layered Architecture* layers: Presentational Layer, Business Logic Layer, Data Access Layer.

- Use services to the business logic.
- Use repositories to the data access.

## Task 3: Get one pet's status

**User Story:** As a pet keeper I can get the details of my pet, so I can decide what actions I can perform on it.

- Implement a new endpoint `GET /pets/:id`.
- Implement the business logic to the right place.
- Use the data access layer to accomplish the task.
- Use the API definition to accomplish the endpoint's requirements.
- Optional: Create tests for this use case.

Hint: You can return `null` from the business logic layer to indicate that a pet is not found. Another option is throw a custom exception and catch it in the Presentational layer. 

## Task 4: Feed the pet

**User Story:** As a pet keeper I can feed my pet, so I can save it from starving.

- Implement the new endpoint `POST /pets/{petId}/food`.
- It should increase the pet's food property by one.
- Handle the pet not found and pet is dead status codes.
- Optional: Create tests for this use case.

Hint: you can throw different custom exceptions from the business logic layer, catch them in the presentational layer
and create replies based on that.

## Task 5: Make the pet older

**User Story:** As a pet keeper I can feed my pet, so I can save it from starving.

- Implement the new endpoint `POST /pets/{petId}/age`.
- It should implement the day passes logic described above
- Handle the pet not found and pet is dead status codes.
- Optional: Create tests for this use case.



