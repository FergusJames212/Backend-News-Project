exports.handleInvalidPath = (req, res) => {
  res.status(404).send({ msg: "Invalid path"});
};

exports.handleStatus500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};

exports.handlePSQL400 = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23502") {
    res.status(400).send({msg: "Not null violation"})
  } else {
    next(err);
  };
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err === "No article of that id found") {
    res.status(404).send({ msg: err });
  } else {
    next(err);
  };
};
