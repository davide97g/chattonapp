# Chattonapp

Locally run a custom chat app.

## Setup

- `yarn`
- `yarn setup` for environment variables initialization

## Backend

If it is missing, create your `JWT_SECRET` using the following command:

> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 6. Running Nginx Locally (Without Docker)

If you want to run Nginx directly:

Install Nginx:

`sudo apt update && sudo apt install nginx -y`

Copy the Nginx config:

`sudo cp nginx/default.conf /etc/nginx/sites-available/default`

Restart Nginx:
`sudo systemctl restart nginx`

Now, your frontend and backend will be accessible via http://localhost/ and http://localhost/api/.
