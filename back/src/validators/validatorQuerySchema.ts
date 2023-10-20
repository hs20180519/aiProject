import Joi from "joi";

export const validatorQuerySchema = Joi.object({
  correct: Joi.string().optional(),
  incorrect: Joi.string().optional(),
  csat: Joi.string().optional(),
  toeic: Joi.string().optional(),
  toefl: Joi.string().optional(),
  custom: Joi.string().optional(),
  customBookId: Joi.string().optional(),
});
