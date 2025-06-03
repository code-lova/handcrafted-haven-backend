import createHttpError from "http-errors";


const notFound = (req, res, next) => {
  next(createHttpError(404, `Route ${req.originalUrl} does not exist on this server`));
};

export default notFound;
