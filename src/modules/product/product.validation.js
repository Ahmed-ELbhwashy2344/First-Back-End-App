import joi from "joi";

const createProductSchema = joi.object({
    title: joi.string().min(2).max(100).required(),
    description: joi.string().min(5).max(300).required(),
    price: joi.number().min(0).required(),
    priceAfterDiscount: joi.number().min(0).less(joi.ref('price')), // لازم الخصم يكون أقل من السعر الأصلي
    quantity: joi.number().min(0).required(),
    sold: joi.number().min(0).default(0),
    ratingAvg: joi.number().min(1).max(5),
    ratingCount: joi.number().min(0).default(0),
    category: joi.string().hex().length(24).required(),
    subCategory: joi.string().hex().length(24).required(),
    brand: joi.string().hex().length(24).required(),
});

const getAndDeleteProductSchema = joi.object({
    id: joi.string().hex().length(24).required(),
});

const updateProductSchema = joi.object({
    id: joi.string().hex().length(24).required(), // الـ ID بيجي من الـ Params
    title: joi.string().min(2).max(100),
    description: joi.string().min(5).max(300),
    price: joi.number().min(0),
    priceAfterDiscount: joi.number().min(0).less(joi.ref('price')),
    quantity: joi.number().min(0),
    category: joi.string().hex().length(24),
    subCategory: joi.string().hex().length(24),
    brand: joi.string().hex().length(24),
});

export { createProductSchema, getAndDeleteProductSchema, updateProductSchema };