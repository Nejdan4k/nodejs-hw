import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // перевірка, що це саме HttpError з пакету http-errors
  if (err instanceof createHttpError.HttpError) {
    const status = err.status ?? 500;

    return res.status(status).json({
      message: err.message ?? err.name,
    });
  }

  console.error('Unexpected error:', err);

  const status = err.status ?? 500;

  return res.status(status).json({
    message: err.message ?? 'Something went wrong',
  });
};