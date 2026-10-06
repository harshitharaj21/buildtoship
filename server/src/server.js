import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 To-Do Backend API Server is running!`);
  console.log(`📡 Port:        ${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Health:      http://localhost:${PORT}/health`);
  console.log(`📋 API Routes:  http://localhost:${PORT}/api/tasks`);
  console.log(`=========================================`);
});
