import Joi from "joi";

export const LoginSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().optional().alphanum().min(4).required(),
});

export const VerifyUserSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
});

export const PostThreadSchema = Joi.object({
  content: Joi.array().items(Joi.string().required()),
  title: Joi.string().allow(""),
  image: Joi.string().allow(""),
});

export const BookmarkDataSchema = Joi.object({
  id: Joi.number().required(),
  type: Joi.string().required(),
});

export const NotifierVariantSchema = Joi.object({
  tags: Joi.array().items(Joi.string().required()).max(10),
  communities: Joi.array().items(Joi.string()),
  name: Joi.string().required(),
  icon: Joi.string().required(),
  type: Joi.string().required(),
});

export const SiteSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  slug: Joi.string().required(),
  themeName: Joi.string().required(),
  notionPageId: Joi.string().required(),
});
