const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const fs = require('fs');
const Transform = require('stream').Transform;

const csvStringifier = createCsvStringifier({
  header: [{
    id: 'id', title: 'id'
  }, {
    id: 'name', title: 'name'
  }, {
    id: 'slogan', title: 'slogan'
  }, {
    id: 'description', title: 'description'
  }, {
    id: 'category', title: 'category'
  }, {
    id: 'default_price', title: 'default_price'
  }]
});

let readStream = fs.createReadStream('./data/products.csv');
let writeStream = fs.createWriteStream('./data/cleanproducts.csv');

class CSVCleaner extends Transform {
  constructor(options) {
    super(options);
  }
}

_transform(chunk, encoding, next) {
  for (let key in chunk) {
    // trims whitespace
    let trimKey = key.trim();
    chunk[trimKey] = chunk[key];
    if (key !== trimKey) {
      delete chunk[key];
    }
  }

  // filters out all non-number characters
  let onlyNumbers = chunk.default_price.replace(/\D/g, '');
  chunk.default_price = onlyNumbers;

  // use our csvStringifier to turn our chunk into a csv string
  chunk = csvStringifier.stringifyRecords([chunk]);
  this.push(chunk);

  next();
}

const transformer = new CSVCleaner({ writableObjectMode: true });

//write header
writeStream.write(csvStringifier.getHeaderString());
readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => { console.log('finished transforming products'); });