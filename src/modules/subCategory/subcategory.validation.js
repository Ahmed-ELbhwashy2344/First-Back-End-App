import joi from "joi";

const createSubcategorySchema = joi.object({
  name: joi.string().min(2).max(100).required(),
  category: joi.string().hex().length(24).required(),
});

const getAndDeleteSubcategorySchema = joi.object({
  id: joi.string().hex().length(24).required(),
});

const updateSubcategorySchema = joi.object({
  id: joi.string().hex().length(24).required(), // الـ ID بيجي من الـ Params
  name: joi.string().min(2).max(100),
  category: joi.string().hex().length(24),
});

export {
  createSubcategorySchema,
  getAndDeleteSubcategorySchema,
  updateSubcategorySchema,
};
