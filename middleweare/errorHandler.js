
// const errorHandler = (err, req, res, next) => {
//     if (err instanceof Error) {
//       console.log(err.stack);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       next(err); // Pass non-Error types to the next middleware
//     }
//   };
const errorHandler = (err, req, res, next) => {
    if (err instanceof Error) {
        console.log(err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    } else {
        next(err); // Pass non-Error types to the next middleware
    }
};


  
  module.exports = errorHandler;
  