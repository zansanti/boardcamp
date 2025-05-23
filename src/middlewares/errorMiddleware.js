export default function errorMiddleware(err, req, res, next) {

  if (err.type === 'BAD_REQUEST') {
    return res.status(400).send(err.message || 'Dados inválidos!');
  }
  if (err.type === 'CONFLICT') {
    return res.status(409).send(err.message || 'Conflito de dados!');
  }
  if (err.type === 'NOT_FOUND') {
    return res.status(404).send(err.message || 'Recurso não encontrado!');
  }
  if (err.type === 'UNPROCESSABLE_ENTITY') {
    return res.status(422).send(err.message || 'Regra de negócio violada!');
  }

  // Erro genérico (não previsto)
  res.status(500).send('Erro interno do servidor!');
}