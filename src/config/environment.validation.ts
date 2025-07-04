import * as joi from 'joi';

export default joi.object({
  NODE_ENV: joi
    .string()
    .valid('development', 'test', 'staging', 'production')
    .default('development'),
  DATABASE_PORT: joi.number().port().default(5432),
  DATABASE_PASSWORD: joi.string().required(),
  DATABASE_HOST: joi.string().required(),
  DATABASE_NAME: joi.string().required(),
  DATABASE_USER: joi.string().required(),
  PROFILE_API_KEY: joi.string().required(),
  JWT_SECRET: joi.string().required(),
  JWT_TOKEN_AUDIENCE: joi.string().required(),
  JWT_TOKEN_ISSUER: joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: joi.number().required(),
  JWT_REFRESH_TOKEN_TTL: joi.number().required(),
  API_VERSION: joi.string().required(),
  MAIL_HOST: joi.string().required(),
  SMTP_USERNAME: joi.string().required(),
  SMTP_PASSWORD: joi.string().required(),
});
