import Joi from "joi";

export const validatorQuerySchema = Joi.object({
  correct: Joi.boolean().optional(),
  incorrect: Joi.boolean().optional(),
  csat: Joi.boolean().optional(),
  toeic: Joi.boolean().optional(),
  toefl: Joi.boolean().optional(),
  ielts: Joi.boolean().optional(),
  custom: Joi.boolean().optional(),
  customBookId: Joi.string().optional(),
});
