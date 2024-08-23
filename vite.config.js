import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react';
import fs from 'fs';

dotenv.config();
const httpsType = process.env.VITE_HTTPS_TYPE;
const certPath = process.env.VITE_HTTPS_CERT_PATH;
const httpsKey = process.env.VITE_HTTPS_KEY_PATH;
const httpsPass = process.env.VITE_HTTPS_PASS;

export default defineConfig(() => {
  console.log('httpsType', httpsType);
  let serverConfig = {};
  switch (httpsType) {
    case 'PFX':
      serverConfig = {
        https: {
          pfx: fs.readFileSync(certPath),
          passphrase: httpsPass,
        },
        host: process.env.VITE_HOST,
        port : process.env.VITE_PORT
      };
      break;
    case 'PEM':
      serverConfig = {
        https: {
          key: fs.readFileSync(httpsKey),
          cert: fs.readFileSync(certPath),
        },
        host: process.env.VITE_HOST,
        port : process.env.VITE_PORT
      };
      break;
    case 'CER' :
      serverConfig = {
        https: {
          cert: fs.readFileSync(certPath),
        },
        host: process.env.VITE_HOST,
        port : process.env.VITE_PORT
      };
      break;
    case 'DER' :
      serverConfig = {
        https: {
          cert: fs.readFileSync(certPath),
        },
        host: process.env.VITE_HOST,
        port : process.env.VITE_PORT
      };
      break; 
    default:
      serverConfig = {
        http: true,
        host: process.env.VITE_HOST,
        port : process.env.VITE_PORT
      };
  }
  return {
    server: serverConfig,
    plugins: [react()],
  };
});
