import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const productsError = new Rate('/GET products errors');
export const productsTrend = new Trend('/GET products API uptime');
export const productError = new Rate('/GET product errors');
export const productTrend = new Trend('/GET product API uptime');
export const stylesError = new Rate('/GET styles errors');
export const stylesTrend = new Trend('/GET styles API uptime');
export const relatedError = new Rate('/GET related errors');
export const relatedTrend = new Trend('/GET related API uptime');

export const last10PID = randomIntBetween(900012, 1000012);

export const options = {
  discardResponseBodies: true,
  // stages: [
  //   { duration: '0.5m', target: 10 },
  //   { duration: '0.5m', target: 10 },
  //   { duration: '0.5m', target: 0 },
  // ],
  scenarios: {
    products: {
      executor: 'constant-vus',
      exec: 'products',
      vus: 10,
      duration: '1m',
      tags: { name: 'productsURL' },
    },
    product: {
      executor: 'constant-vus',
      exec: 'product',
      vus: 10,
      duration: '1m',
      tags: { name: 'productURL' },
    },
    styles: {
      executor: 'constant-vus',
      exec: 'styles',
      vus: 10,
      duration: '1m',
      tags: { name: 'stylesURL' },
    },
    related: {
      executor: 'constant-vus',
      exec: 'related',
      vus: 10,
      duration: '1m',
      tags: { name: 'relatedURL' },
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(90)<2000'],
  },
};

export function products() {
  const productsResponse = http.get('http://localhost:3000/api/products', { tags: { name: 'productsURL' } });
  productsTrend.add(productsResponse.timings.duration);
  check(productsResponse, {
    'Products reponse status is 200': (res) => res.status === 200,
    // 'get response body is not empty': (res) => Object.keys(res.body).length > 0,
  }) || productsError.add(1);
  sleep(1);
}

export function product() {
  console.log('PID for Product', last10PID);
  const productResponse = http.get(`http://localhost:3000/api/products/${last10PID}`, { tags: { name: 'productURL' } });
  productTrend.add(productResponse.timings.duration);
  check(productResponse, {
    'Product reponse status is 200': (res) => res.status === 200,
    // 'get response body is not empty': (res) => Object.keys(res.body).length > 0,
  }) || productError.add(1);
  sleep(1);
}

export function styles() {
  console.log('PID for Styles', last10PID);
  const stylesResponse = http.get(`http://localhost:3000/api/products/${last10PID}/styles`, { tags: { name: 'stylesURL' } });
  stylesTrend.add(stylesResponse.timings.duration);
  check(stylesResponse, {
    'Styles reponse status is 200': (res) => res.status === 200,
    // 'get response body is not empty': (res) => Object.keys(res.body).length > 0,
  }) || stylesError.add(1);
  sleep(1);
}

export function related() {
  console.log('PID for Related', last10PID);
  const relatedResponse = http.get(`http://localhost:3000/api/products/${last10PID}/related`, { tags: { name: 'relatedURL' } });
  relatedTrend.add(relatedResponse.timings.duration);
  check(relatedResponse, {
    'Related reponse status is 200': (res) => res.status === 200,
    // 'get response body is not empty': (res) => Object.keys(res.body).length > 0,
  }) || relatedError.add(1);
  sleep(1);
}

export default function () {
  // const last10PID = randomIntBetween(900012, 1000012);
  // const responses = http.batch([
  //   // ['GET', `http://localhost:3000/api/products`, null, { tags: { name: 'productsURL' } }],
  //   ['GET', `http://localhost:3000/api/products/${last10PID}`, null, { tags: { name: 'productURL' } }],
  //   ['GET', `http://localhost:3000/api/products/${last10PID}/styles`, null, { tags: { name: 'stylesURL' } }],
  //   ['GET', `http://localhost:3000/api/products/${last10PID}/related`, null, { tags: { name: 'relatedURL' } }],
  // ]);

  // group('Products API uptime check', () => {
  //   const productsResponse = responses[0];
  //   productsTrend.add(productsResponse.timings.duration);
  //   check(productsResponse, {
  //     'status is 200': (res) => res.status === 200,
  //     // 'get response body is not empty': (res) => Object.keys(res.body).length > 0,
  //   }) || productsError.add(1);
  //   sleep(1);
  // });

  // group('Product API uptime check', () => {
  //   const productResponse = responses[1];
  //   productTrend.add(productResponse.timings.duration);
  //   check(productResponse, {
  //     'status is 200': (res) => res.status === 200,
  //     // 'get response body is not empty': (res) => Object.keys(res.body).length > 0,
  //   }) || productError.add(1);
  //   sleep(1);
  // });

  // group('Styles API uptime check', () => {
  //   const stylesResponse = responses[2];
  //   stylesTrend.add(stylesResponse.timings.duration);
  //   check(stylesResponse, {
  //     'status is 200': (res) => res.status === 200,
  //     // 'get response body is not empty': (res) => Object.keys(res.body).length > 0,
  //   }) || stylesError.add(1);
  //   sleep(1);
  // });

  // group('Related API uptime check', () => {
  //   const relatedResponse = responses[3];
  //   relatedTrend.add(relatedResponse.timings.duration);
  //   check(relatedResponse, {
  //     'status is 200': (res) => res.status === 200,
  //     // 'get response body is not empty': (res) => Object.keys(res.body).length > 0,
  //   }) || relatedError.add(1);
  //   sleep(1);
  // });
}
/*
scenarios: {
    products: {
      executor: 'ramping-vus',
      tags: { testID: 'products' },
      startVUs: 0,
      stages: [
        { duration: '0.5m', target: 5 },
        { duration: '1m', target: 5 },
        { duration: '0.5m', target: 0 },
      ],
    },
    product: {
      executor: 'ramping-vus',
      tags: { testID: 'product' },
      startVUs: 0,
      stages: [
        { duration: '0.5m', target: 5 },
        { duration: '1m', target: 5 },
        { duration: '0.5m', target: 0 },
      ],
    },
    styles: {
      executor: 'ramping-vus',
      tags: { testID: 'styles' },
      startVUs: 0,
      stages: [
        { duration: '0.5m', target: 5 },
        { duration: '1m', target: 5 },
        { duration: '0.5m', target: 0 },
      ],
    },
    related: {
      executor: 'ramping-vus',
      tags: { testID: 'related' },
      startVUs: 0,
      stages: [
        { duration: '0.5m', target: 5 },
        { duration: '1m', target: 5 },
        { duration: '0.5m', target: 0 },
      ],
    },
  },
*/