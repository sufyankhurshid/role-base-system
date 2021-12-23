export function printLogs(...args: any) {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    console.log(args);
  }
}
