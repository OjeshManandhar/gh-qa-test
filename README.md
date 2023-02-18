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
  - Can update/delete own items
  - Can't update/delete other users' items
- Admin
  - Can view/create/update/delete users
  - Can view/create/update/delete all items
