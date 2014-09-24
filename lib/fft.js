

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

