(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

exports = require("./lib/fft");

},{"./lib/fft":3}],2:[function(require,module,exports){

exports.TWO_PI = 2 * Math.PI;

},{}],3:[function(require,module,exports){


var helpers = require("./helpers"),
    swap = helpers.swap,
    newSlice = helpers.newSlice,
    cloneFrame = helpers.cloneFrame,
    TWO_PI = require("./constants").TWO_PI;

exports = function (data, n, isign) {

    var TwoN, mmax, m, j, istep, i,
        wtemp, wr, wpr, wpi, wi, theta, tempr, tempi, sin;
    if (n < 2 || n&(n - 1)) {
        throw "N must be a power of 2";
    }

    TwoN = n * 2;
    sin = Math.sin;

    j = 1;

    for (i = 1; i < TwoN; i += 2) {
        if (j > i) {
            swap(data, j - 1, i - 1);
            swap(data, j, i);
        }

        m = n;

        while (m >= 2 && j > m) {
            j -= m;
            m = m >> 1;
        }

        j += m;

    }

    mmax = 2;

    while (TwoN > mmax) {

        istep = mmax << 1;
        theta = isign * (TWO_PI / mmax);
        wtemp = Math.sin(0.5 * theta);
        wpr = -2.0 * wtemp * wtemp;
        wpi = Math.sin(theta);
        wr = 1.0;
        wi = 0.0;

        for (m = 1; m < mmax; m += 2) {
            for (i=m; i <= TwoN; i += istep) {
                j = i + mmax;
                tempr = wr * data[j - 1] - wi * data[j];
                tempi = wr * data[j] + wi * data[j-1];
                data[j-1] = data[i-1] - tempr;
                data[j] = data[i] - tempi;
                data[i-1] += tempr;
                data[i] += tempi;
            }
            wtemp = wr;
            wr = wr * wpr - wi * wpi + wr;
            wi = wi * wpr + wtemp * wpi + wi;
        }
        mmax = istep;
    }
    return data;
};


},{"./constants":2,"./helpers":4}],4:[function(require,module,exports){

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

},{}]},{},[1]);
