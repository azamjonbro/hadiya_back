const Joi = require('joi');

const validations = {
  superadmin: {
    create: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required()
    }),
    update: Joi.object({
      username: Joi.string(),
      password: Joi.string(),
      name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string()
    })
  },
  manager: {
    create: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      superadminId: Joi.number().required()
    }),
    update: Joi.object({
      username: Joi.string(),
      password: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
      superadminId: Joi.number()
    })
  },
  category: {
    create: Joi.object({
      name: Joi.string().required(),
      status: Joi.boolean()
    }),
    update: Joi.object({
      name: Joi.string(),
      status: Joi.boolean()
    })
  },
  product: {
    create: Joi.object({
      name: Joi.string().required(),
      price: Joi.string().required(),
      saleprice: Joi.string(),
      salePercent: Joi.number(),
      quantity: Joi.number().required(),
      categoryId: Joi.number().required()
    }),
    update: Joi.object({
      name: Joi.string(),
      price: Joi.string(),
      saleprice: Joi.string(),
      salePercent: Joi.number(),
      quantity: Joi.number(),
      categoryId: Joi.number()
    })
  },
  user: {
    create: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      phone: Joi.string().required()
    }),
    update: Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      phone: Joi.string()
    })
  }
};

module.exports = validations;
