import joi from "joi";

export const createBrandySchema = joi.object({
  name: joi.string().min(2).max(25).required(),
});
export const getAndDeleteBrandySchema = joi.object({
  id: joi.string().hex().length(24).required(),
});
export const updateBrandySchema = joi.object({
  name: joi.string().min(2).max(25),
  id: joi.string().hex().length(24).required(),
});
