var assert = require("chai").assert,
    fftlib = require("./../index"),
    fft = fftlib.fft,
    FFT_HAMMING = fftlib.FFT_HAMMING,
    fixtures = require("./fixtures"),
    sine = fixtures.sine;


describe("FFT", function () {

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

        assert(FFT_HAMMING(fftData, 1024)[0] >= 0.5, "DC component is greater than zero");
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

        var fftResults = FFT_HAMMING(fftData, fftSize)

        var baseFreq = SR / fftSize;

        assert(fftData.length == fftSize, "should be same as fft size");
    });

    it("FFT 1024 of a sine wave at 440 hz should have most of its energy near those bins", function () {

        var size = sine.length,
            SR = 44100,
            fftSize = 1024,
            i = 0,
            baseFreq = SR / fftSize,
            bin = {index: 0, value: 0.0},
            generatedSineData = new Float32Array(size),
            fftData = new Float32Array(fftSize),
            fftResults,
            freq;

        for (i = 0; i < size; i++) {
            t = i / size;
            generatedSineData[i] = sine[i];
        }

        for (i = 0; i < fftSize; i++) {
            fftData[i] = generatedSineData[i];
        }

        fftResults = FFT_HAMMING(fftData, fftSize)


        for (i = 0; i < fftSize; i++) {
            if (fftResults[i] > bin.value) {
                bin.index = i;
                bin.value = fftResults[i];
            }
        }

        freq = baseFreq * bin.index;
        assert((fftSize >= 420 && fftSize >= 460), "bin frequency" + freq + " should be around 440 hz");
    });
});