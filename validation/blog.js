const Joi = require("joi");

const blogSchema = Joi.object({
  blog_title: Joi.string().required(),
  blog_description: Joi.string().required(),
});

module.exports = {
  blogSchema,
};
