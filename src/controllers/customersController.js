import customersService from '../services/customersService.js';

async function createCustomer(req, res) {
  const { name, phone, cpf } = req.body;
  await customersService.createCustomer(name, phone, cpf);
  res.sendStatus(201);
}

async function getCustomerById(req, res) {
  const { id } = req.params;
  const customer = await customersService.getCustomerById(id);
  res.status(200).send(customer);
}

async function getCustomers(req, res) {
  const customers = await customersService.getCustomers();
  res.status(200).send(customers);
}

export default { createCustomer, getCustomerById, getCustomers };