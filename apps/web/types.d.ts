declare module 'idb-keyval' {
  export function get<T = any>(key: string): Promise<T | undefined>;
  export function set(key: string, value: any): Promise<void>;
}

declare module 'browser-image-compression' {
  export default function imageCompression(file: File, options: any): Promise<File>;
}
