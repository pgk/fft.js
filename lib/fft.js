

var helpers = require("./helpers"),
    swap = helpers.swap,
    newSlice = helpers.newSlice,
    cloneFrame = helpers.cloneFrame,
    TWO_PI = 2 * Math.PI,
    sin = Math.sin;


var fft = function (data, n, isign) {
    if (n < 2 || n&(n - 1)) {
        throw "N must be a power of 2";
    }

    var TwoN, mmax, m, j, istep, i,
        wtemp, wr, wpr, wpi, wi, theta, tempr, tempi;


    TwoN = n * 2;

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
        wtemp = sin(0.5 * theta);
        wpr = -2.0 * wtemp * wtemp;
        wpi = sin(theta);
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



var complexFromReal = function (realdata) {
        var i,j = 0, complexdata = new Float32Array(realdata.length * 2);
        for (i = 0; i < complexdata.length; i = i + 2) {
            complexdata[i] = realdata[j];
            complexdata[i + 1] = 0;
            j++;
        }

        return complexdata;
    };


var calculateMagnitudes = function (data) {
    var len = data.length / 2,
        sqrt = Math.sqrt,
        magnitudes = new Float32Array(len), i, j, re, im, mag;

    j = 0;
    for (i = 0; i < len; i = i + 2) {
        re = data[i];
        im = data[i + 1];
        mag = sqrt(re*re + im*im);
        magnitudes[j] = mag;
        j++;
    }
    return magnitudes;
};

var calculatePhases = function (data) {
    var len = data.length / 2,
        atan = Math.atan,
        phases = new Float32Array(len), i, j, re, im;

    j = 0;
    for (i = 0; i < len; i = i + 2) {
        re = data[i];
        im = data[i + 1];

        phases[j] = atan(im / re);
        j++;
    }
    return phases;
};

var hamming = function (data) {
    var i = 0,
        A = 0.54,
        B = 0.46,
        len = data.length,
        N = len - 1,
        result = new Float32Array(len),
        cos = Math.cos;

    for (i = 0; i < len; i++) {
        result[i] = data[i] * (A - (B * cos(TWO_PI * i) / N));
    }

    return result;
};

var computeHamming = function (length) {
    var i = 0,
        A = 0.54,
        B = 0.46,
        len = length,
        N = len - 1,
        result = [],
        cos = Math.cos;

    for (i = 0; i < len; i++) {
        result[i] = 1.0 * (A - (B * cos(TWO_PI * i) / N));
    }

    return result;
};

var toDB = function (magnitudes) {
    var len = magnitudes.length,
        log10 = function (n) { return Math.log(n) / Math.LN10; },
        results = new Float32Array(len),
        i;

    for (i = 0; i < len; i++) {
        results[i] = 20 * log10(magnitudes[i]);
    }

    return results;
};

var FFT = function (data, n) {
    var data = hamming(data);
    var complexData = complexFromReal(data);
    // return fft(complexData, n, 1);
    var fftResults = fft(complexData, n, 1);
    return toDB(calculateMagnitudes(fftResults));
};

var FFT_HAMMING = function (fftData, fftSize) {
    var fftData = hamming(fftData),
        complexData = complexFromReal(fftData);

    return calculateMagnitudes(fft(complexData, fftSize, 1));

};


exports.hamming = hamming;
exports.toDB = toDB;
exports.calculatePhases = calculatePhases;
exports.calculateMagnitudes = calculateMagnitudes;
exports.complexFromReal = complexFromReal;
exports.fft = fft;
exports.FFT_HAMMING = FFT_HAMMING;
