// /vercel-func.js
import { INestApplication } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { bootstrap } from './main';

// Keep the app instance in memory for subsequent requests
let app : INestApplication;
export default async function handler(req, res) {
  // Bootstrap our NestJS app on cold start
  if (!app) {
    app = await bootstrap()
    // This is important
    await app.init();
  }
  const adapterHost = app.get(HttpAdapterHost);
  const httpAdapter = adapterHost.httpAdapter;
  const instance = httpAdapter.getInstance();

  instance(req, res);
}