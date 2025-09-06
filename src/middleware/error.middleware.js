function notFoundHandler(req, res, next) {
	return res.status(404).json({ error: "Not found" });
}

function errorHandler(err, req, res, next) {
	console.error(err);
	const status = err.status || 500;
	return res.status(status).json({ error: err.message || "Server error" });
}

module.exports = { notFoundHandler, errorHandler }; 