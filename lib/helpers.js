
exports.swap = function (data, i, j) {
    var tmpi = data[i];

    data[i] = data[j];
    data[j] = tmpi;
};


exports.newSlice = function (source, size, offset) {
    var len = source.length,
        dataSlice = new Float32Array(size),
        remaining = len - offset;

    for (i = 0; i < size; i++) {
        dataSlice[i] = (remaining >= size) ? source[i + offset] : 0.0;
    }

    return dataSlice;
};

var cloneFrame = function (frame) {
    return newSlice(frame, frame.length, 0);
};
