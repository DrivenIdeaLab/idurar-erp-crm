/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');

const currency = require('currency.js');

// dayjs is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
const dayjs = require('dayjs');
exports.dayjs = dayjs; // Export dayjs if it was previously exported as moment

// Making a static map is really long - this is a handy helper function to make one

// inserting an SVG
exports.icon = (name) => {
  try {
    return fs.readFileSync(`./public/images/icons/${name}.svg`);
  } catch (error) {
    return null;
  }
};

exports.image = (name) => fs.readFileSync(`./public/images/photos/${name}.jpg`);

// Some details about the site
exports.siteName = `Express.js / MongoBD / Rest Api`;

exports.timeRange = (start, end, format, interval) => {
  if (format == undefined) {
    format = 'HH:mm';
  }

  if (interval == undefined) {
    interval = 60;
  }
  interval = interval > 0 ? interval : 60;

  const range = [];
  while (dayjs(start).isBefore(dayjs(end))) {
    range.push(dayjs(start).format(format));
    start = dayjs(start).add(interval, 'minutes');
  }
  return range;
};

exports.calculate = {
  add: (firstValue, secondValue) => {
    return currency(firstValue).add(secondValue).value;
  },
  sub: (firstValue, secondValue) => {
    return currency(firstValue).subtract(secondValue).value;
  },
  multiply: (firstValue, secondValue) => {
    return currency(firstValue).multiply(secondValue).value;
  },
  divide: (firstValue, secondValue) => {
    return currency(firstValue).divide(secondValue).value;
  },
};
