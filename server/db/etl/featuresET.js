const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const fs = require('fs');
const Transform = require('stream').Transform;

const csvStringifier = createCsvStringifier({
  header: [{
    id: 'id', title: 'id'
  }, {
    id: 'product_id', title: 'product_id'
  }, {
    id: 'feature', title: 'feature'
  }, {
    id: 'value', title: 'value'
  }],
  decodeStrings: false
});

let readStream = fs.createReadStream('data/testfeatures.csv');
let writeStream = fs.createWriteStream('data/cleantestfeatures.csv');

class CSVCleaner extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, next) {
    // console.log('pre loop', chunk.feature);
    for (let key in chunk) {
      // trims whitespace
      let trimKey = key.trim();
      chunk[trimKey] = chunk[key];
      if (key !== trimKey) {
        delete chunk[key];
      }
    }

    // filters out all non-number characters
    let onlyIDNumbers = chunk.id.replace(/\D/g, '');
    let onlyProductIDNumbers = chunk.product_id.replace(/\D/g, '');
    chunk.id = onlyIDNumbers;
    chunk.product_id = onlyProductIDNumbers;

    // if data doesnt end properly clear finish

    // use our csvStringifier to turn our chunk into a csv string
    chunk = csvStringifier.stringifyRecords([chunk]);
    this.push(chunk);

    next();
  }
}


const transformer = new CSVCleaner({ writableObjectMode: true });

//write header
writeStream.write(csvStringifier.getHeaderString());
readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => { console.log('finished transforming features'); });