# PollApp

A simple MVP app for creating and voting in polls. Built with SvelteKit, Drizzle ORM, and SQLite. The main goal was to experiment with this stack using Bun as the runtime and to get everything running inside Docker.

## Features

- Create polls with a question and multiple options
- Vote (limited to one vote per IP)
- View poll results
- Form validation (client + server)
- Basic error handling
- Works in Docker

## Tech stack

- **SvelteKit** – frontend and SSR
- **svelte-shadcn** – UI components
- **Drizzle ORM** – database ORM with migrations
- **SQLite** – embedded database
- **Bun** – runtime and dev server
- **Docker** – containerized setup

> Note: Using Bun + Drizzle + SQLite required some extra work, as some Drizzle packages don’t support native SQLite in Bun yet.

## Getting started

1. Clone the repository:

	```bash
	git clone https://github.com/DAHNEEV/pollapp.git
	cd pollapp
	```

2. Start the app:

	```bash
	docker compose up --build
	```
