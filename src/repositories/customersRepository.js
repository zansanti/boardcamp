import connection from '../database.js';

async function findCustomerByCpf(cpf) {
  const result = await connection.query('SELECT * FROM customers WHERE cpf = $1;', [cpf]);
  return result.rows[0];
}

async function createCustomer(name, phone, cpf) {
  await connection.query(
    'INSERT INTO customers (name, phone, cpf) VALUES ($1, $2, $3);',
    [name, phone, cpf]
  );
}

async function getCustomerById(id) {
  const result = await connection.query('SELECT * FROM customers WHERE id = $1;', [id]);
  return result.rows[0];
}

async function getCustomers() {
  const result = await connection.query('SELECT * FROM customers;');
  return result.rows;
}
export default { findCustomerByCpf, createCustomer, getCustomerById, getCustomers };