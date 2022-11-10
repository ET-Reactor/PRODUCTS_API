import http from 'k6/http';
import { check, sleep } from 'k6';
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
  scenarios: {
    products: {
      executor: 'constant-vus',
      exec: 'products',
      vus: 50,
      duration: '1m',
      tags: { name: 'productsURL' },
    },
    product: {
      executor: 'constant-vus',
      exec: 'product',
      vus: 50,
      duration: '1m',
      tags: { name: 'productURL' },
    },
    styles: {
      executor: 'constant-vus',
      exec: 'styles',
      vus: 50,
      duration: '1m',
      tags: { name: 'stylesURL' },
    },
    related: {
      executor: 'constant-vus',
      exec: 'related',
      vus: 50,
      duration: '1m',
      tags: { name: 'relatedURL' },
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
  },
};

export function products() {
  const productsResponse = http.get('http://54.215.236.174:3000/api/products', { tags: { name: 'products' } });
  productsTrend.add(productsResponse.timings.duration);
  check(productsResponse, {
    'Products reponse status is 200': (res) => res.status === 200,
  }) || productsError.add(1);
}

export function product() {
  const productResponse = http.get(`http://54.215.236.174:3000/api/products/${last10PID}`, { tags: { name: 'product' } });
  productTrend.add(productResponse.timings.duration);
  check(productResponse, {
    'Product reponse status is 200': (res) => res.status === 200,
  }) || productError.add(1);
}

export function styles() {
  const stylesResponse = http.get(`http://54.215.236.174:3000/api/products/${last10PID}/styles`, { tags: { name: 'styles' } });
  stylesTrend.add(stylesResponse.timings.duration);
  check(stylesResponse, {
    'Styles reponse status is 200': (res) => res.status === 200,
  }) || stylesError.add(1);
}

export function related() {
  const relatedResponse = http.get(`http://54.215.236.174:3000/api/products/${last10PID}/related`, { tags: { name: 'related' } });
  relatedTrend.add(relatedResponse.timings.duration);
  check(relatedResponse, {
    'Related reponse status is 200': (res) => res.status === 200,
  }) || relatedError.add(1);
}

export default function () {
}