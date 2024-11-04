import { join } from "node:path";
import createApp from "./app";

const PORT = 4400;

const options = {
  logger: {
    level: 'debug', 
    transport: {target: 'pino-pretty'}
  }
};

const dataFile = join(__dirname, '..', 'data.json')


async function main() {
  const app = await createApp(options, dataFile)
  app.listen({port: PORT}, (error, address) => {
    if(error) {
      app.log.error(error);
      process.exit(1);
    }
    app.log.info(`Server is started successfully.`)
  });
}

main().catch(console.error)
