// FAVOR LEAR O README DO PROJETO PARA PODER REALIZAR OS TESTES DE FINALIZAR ALUGUEL DE FORMA CORRETA
import express from 'express';
import gamesRouter from './routers/gamesRouter.js';
import customersRouter from './routers/customersRouter.js';
import rentalsRouter from './routers/rentalsRouter.js';
import errorMiddleware from './middlewares/errorMiddleware.js';


const app = express();
app.use(express.json());

process.on('unhandledRejection', (err) => {
  console.error('🚨 ERRO NÃO TRATADO (Promise):', err.stack || err);
});

process.on('uncaughtException', (err) => {
  console.error('💥 ERRO CATASTRÓFICO:', err.stack || err);
  process.exit(1);
});
app.use(gamesRouter);
app.use(customersRouter);
app.use(rentalsRouter);
app.use(errorMiddleware);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

process.on('uncaughtException', (err) => {
  console.error("💥 ERRO NÃO TRATADO:", err.stack);
});