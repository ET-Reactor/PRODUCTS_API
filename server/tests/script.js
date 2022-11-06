import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate } from 'k6/metrics';

export const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '0.5m', target: 5 },
    { duration: '1m', target: 5 },
    { duration: '0.5m', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<200'],
  }
};

export default function () {
  const responses = http.batch([
    'http://localhost:3000/api/products',
    'http://localhost:3000/api/products/1',
  ]);

  group('Products API uptime check', () => {
    check(responses[0], {
      'status is 200': (res) => res.status === 200,
      'get response body is defined': (res) => res.body !== undefined,
    }) || errorRate.add(1);
    sleep(1);
  });

  group('Product API uptime check', () => {
    check(responses[1], {
      'status is 200': (res) => res.status === 200,
      'get response body is defined': (res) => res.body !== undefined,
    }) || errorRate.add(1);
    sleep(1);
  });
}