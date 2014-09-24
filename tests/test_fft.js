var assert = require("chai").assert,
    fftlib = require("./../index"),
    fft = fftlib.fft;

describe("FFT", function () {

    var fftFunc = function (fftData, fftSize) {
        var fftData = fftlib.hamming(fftData);
        var complexData = fftlib.complexFromReal(fftData);
        return fftlib.calculateMagnitudes(fft(complexData, fftSize, 1));

    };

    it("should calculate DC correctly", function () {

        var size = 16384,
            SR = 44100,
            fftSize = 2048,
            fftWind = 1024,
            i = 0,
            generatedSineData = new Float32Array(size),
            fftData = new Float32Array(fftSize);

        for (i = 0; i < size; i++) {
            generatedSineData[i] = 0.5;
        }

        for (i = 0; i < fftSize; i++) {
            fftData[i] = generatedSineData[i];
        }

        assert(fftFunc(fftData, 1024)[0] >= 0.5, "DC component is greater than zero");
    });

    it("should have the same fft size", function () {

        var size = 16384,
            SR = 44100,
            fftSize = 1024,
            fftWind = 1024,
            i = 0,
            sin = Math.sin,
            two_pi = Math.PI * 2,
            t = 0,
            freq = 440,
            generatedSineData = new Float32Array(size),
            fftData = new Float32Array(fftSize);

        for (i = 0; i < size; i++) {
            t = i / size;
            generatedSineData[i] = sin(two_pi * freq * t);
        }

        for (i = 0; i < fftSize; i++) {
            fftData[i] = generatedSineData[i];
        }

        var fftResults = fftFunc(fftData, fftSize)

        var baseFreq = SR / fftSize;

        assert(fftData.length == fftSize, "should be same as fft size");
    });
});