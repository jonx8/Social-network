import path from 'path';

export const PORT: number = 3000;
export const SECRET_KEY: string = 'secret';
export const ROLLBAR_POST_TOKEN: string = "8994e9940a214736a00a9a38eab2ff61";
export const __projectDir = path.resolve(__dirname, '../../');
export const __publicDir = path.resolve(__projectDir, './dist/public');
export const __jsonStorageDir = path.resolve(__projectDir, './dist/data');

