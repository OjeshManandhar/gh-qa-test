# GreekHouse QA Test

Project for QA test at GreekHouse

## Problem Statement

- Users authorization levels
  - Guest
  - User
  - Admin
- Entity
  - Item
    - name
    - price
    - description
- Access control on items depending on user role

## Assumptions

The assumptions I made for access control are the following:

- Guest
  - Can view all items
  - Can't create, update or delete items
- User
  - Can view all items
  - Can create items
  - Can update own items
  - Can't update other users' items
  - Can't delete items
- Admin
  - Can view/create/update/delete users
  - Can view/create/update/delete all items

## Installation

- Mock server
  - Install dependencies with `composer install`
  - Set up [.env](./mock-server/.env) file. You can use the [.env.example](./mock-server/.env.example) file as a template or clone [.env.example](./mock-server/.env.example).
  - Create **database.sqlite** file in [mock-server/database](./mock-server/database) folder
  - Run migrations and seed with `php artisan migrate --seed`
  - Run server with `php artisan serve`
  - Register a user with the following credentials using [Postman](https://www.postman.com/) or similar tool:
    - email: `test@test.com`
    - password: `password`
- API Tests
  - Install dependencies with `npm install`
  - Set up [.env.test](./api-tests/.env.test) file. You can use the [.env.example](./api-tests/.env.example) file as a template.
  - Run tests with `npm test`
