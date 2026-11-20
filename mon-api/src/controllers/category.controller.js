const Category = require('../models/category.model');
const asyncHandler = require('../utils/asyncHandler');
const { success, created, notFound } = require('../utils/response');

const getAll = asyncHandler(async (req, res) => {
  const categories = await Category.findAll();
  return success(res, categories, 'Categories retrieved successfully');
});

const getOne = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return notFound(res, 'Category not found');
  return success(res, category, 'Category retrieved successfully');
});

const store = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  return created(res, category, 'Category created successfully');
});

const update = asyncHandler(async (req, res) => {
  const existing = await Category.findById(req.params.id);
  if (!existing) return notFound(res, 'Category not found');
  const category = await Category.update(req.params.id, req.body);
  return success(res, category, 'Category updated successfully');
});

const destroy = asyncHandler(async (req, res) => {
  const deleted = await Category.remove(req.params.id);
  if (!deleted) return notFound(res, 'Category not found');
  return success(res, null, 'Category deleted successfully');
});

module.exports = { getAll, getOne, store, update, destroy };