import customersRepository from '../repositories/customersRepository.js';
import customersSchema from '../schemas/customersSchema.js';

async function createCustomer(name, phone, cpf) {
  const validation = customersSchema.validate({ name, phone, cpf });
  if (validation.error) {
    throw { type: 'BAD_REQUEST', message: validation.error.details[0].message };
  }

  const customerExists = await customersRepository.findCustomerByCpf(cpf);
  if (customerExists) {
    throw { type: 'CONFLICT', message: 'CPF já cadastrado!' };
  }

  await customersRepository.createCustomer(name, phone, cpf);
}

async function getCustomerById(id) {
  const customer = await customersRepository.getCustomerById(id);
  if (!customer) {
    throw { type: 'NOT_FOUND', message: 'Cliente não encontrado!' };
  }
  return customer;
}

async function getCustomers() {
  return await customersRepository.getCustomers();
}

export default { createCustomer, getCustomerById, getCustomers };