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

export const BookmarkThreadSchema = Joi.object({
  threadId: Joi.number().required(),
});
