import app from './app.js';
import { connectDB } from './db/connect.js';
import { config } from './config/env.js';

async function bootstrap(){
  await connectDB();
  app.listen(config.PORT, ()=> console.log(`[WEB] http://localhost:${config.PORT}`));
}
bootstrap();
