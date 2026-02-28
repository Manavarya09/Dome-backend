const express = require('express');
const router = express.Router();

const FinanceController = require('./finance.controller');
const validate = require('../../middleware/validation.middleware');
const authenticate = require('../../middleware/auth.middleware');
const {
    createTransactionSchema,
    updateTransactionSchema,
    getTransactionsQuerySchema,
} = require('./finance.schema');

// All finance routes require authentication
router.use(authenticate);

router.get('/', validate(getTransactionsQuerySchema), FinanceController.getTransactions);
router.post('/', validate(createTransactionSchema), FinanceController.createTransaction);
router.put('/:id', validate(updateTransactionSchema), FinanceController.updateTransaction);
router.delete('/:id', FinanceController.deleteTransaction);

module.exports = router;
