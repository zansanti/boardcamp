import express from 'express';
import customersController from '../controllers/customersController.js';

const router = express.Router();

router.get('/customers', customersController.getCustomers);
router.post('/customers', customersController.createCustomer);
router.get('/customers/:id', customersController.getCustomerById);

export default router;