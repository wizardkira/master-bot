docker compose up -d postgres redis
npm install
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend
npm run prisma:seed --workspace backend
npm run dev:backend
