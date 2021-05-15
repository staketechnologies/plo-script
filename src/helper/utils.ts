import https from 'https';
import axios from 'axios';
import neatCsv from 'neat-csv';
import fs from 'fs';
import stringify from 'csv-stringify/lib/sync';
import path from 'path';
/**
 * a wrapper for node-fetch. Returns the JSON body of the response as string.
 * The body must be a JSON in order for this to work
 * @param url url of the request in string
 */
export async function getJsonRequest(url: string) {
  const response = await axios.get(url);
  return JSON.stringify(response.data);
}

export async function postJsonRequest(url: string, body: object) {
  const response = await axios.post(url, body, {
    headers: { 'Content-Type': 'application/json' },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });
  return JSON.stringify(response.data);
}

export function loadCache<T>(jsonDir: string) {
  try {
    const _cache = fs.readFileSync(jsonDir, { encoding: 'utf8' });
    const cache = JSON.parse(_cache);

    const _prevLocks: Array<T> = cache;
    return _prevLocks;
  } catch (e) {
    return new Array<T>();
  }
}

export function writeCache<T>(data: T, name?: string, saveFolder?: string) {
  const dirName = path.join(saveFolder || process.cwd(), `${name || 'data'}.json`);
  fs.writeFileSync(dirName, JSON.stringify(data));
}

/**
 * Reads a local CSV file and returns a list of key-value pairs
 * @param csvDir location of the csv file to parse
 */
export async function loadCsv(csvDir: string) {
  const data = fs.readFileSync(csvDir);

  const content: { [key: string]: string }[] = await neatCsv(data);

  return content;
}

export function writeCsv<T>(data: T[], name?: string, saveFolder?: string) {
  const dirName = path.join(saveFolder || process.cwd(), `${name || 'data'}.csv`);

  const csvOutput = stringify(data, {
    header: true,
  });

  fs.writeFileSync(dirName, csvOutput);
}

export function promiseMap<T, V>(data: T[], fn: (d: T) => Promise<V>): Promise<V[]> {
  return Promise.all(
    data.map((d: T) => {
      return fn(d);
    }),
  );
}
