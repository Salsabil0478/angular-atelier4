const express = require('express');
const router = express.Router();
const controller = require('../controllers/category.controller');
const { validateCategory } = require('../middlewares/validate.middleware');

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', validateCategory, controller.store);
router.put('/:id', validateCategory, controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;