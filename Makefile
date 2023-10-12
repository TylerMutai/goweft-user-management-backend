
migrations:
	ts-node-dev --respawn --transpileOnly ./src/migrations.ts

seeders:
	ts-node-dev --respawn --transpileOnly ./src/seeders.ts

server:
	npm run dev;