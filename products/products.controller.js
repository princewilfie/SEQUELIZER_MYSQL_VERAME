const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const productService = require('./product.service');

// Routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// Controller functions
function getAll(req, res, next) {
    productService.getAll()
        .then(products => res.json(products))
        .catch(next);
}

function getById(req, res, next) {
    productService.getById(req.params.id)
        .then(product => res.json(product))
        .catch(next);
}

function create(req, res, next) {
    productService.create(req.body)
        .then(product => res.json({message: 'Product Created'}))
        .catch(next);
}

function update(req, res, next) {
    productService.update(req.params.id, req.body)
        .then(product => res.json({message: 'Product updated'}))
        .catch(next);
}

function _delete(req, res, next) {
    productService.delete(req.params.id)
        .then(() => res.json({ message: 'Product deleted' }))
        .catch(next);
}

// Request validation schemas
function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string().required(),
        quantity: Joi.number().integer().min(0).required() // Added quantity validation
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().empty(''),
        description: Joi.string().empty(''),
        price: Joi.number().empty(''),
        category: Joi.string().empty(''),
        quantity: Joi.number().integer().min(0).empty('') // Added quantity validation
    });
    validateRequest(req, next, schema);
}
