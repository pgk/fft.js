
exports.swap = function (data, i, j) {
	var tmpi = data[i];

	data[i] = data[j];
	data[j] = tmpi;
};


exports.newSlice = function (source, size, offset) {
	var len = source.length,
		dataSlice = _.range(size).map(function () { return 0.0; }), //remove underscore dependency
		remaining = len - offset;

	for (i = 0; i < size; i++) {
		if (remaining >= size) {
			dataSlice[i] = source[i + offset];
		};
	}

	return dataSlice;
};

var cloneFrame = function (frame) {
	return newSlice(frame, frame.length, 0);
};