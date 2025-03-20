# Chattonapp

Locally run a custom chat app.

## Setup

- `yarn`
- `yarn setup` for environment variables initialization

## Backend

If it is missing, create your `JWT_SECRET` using the following command:

> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
