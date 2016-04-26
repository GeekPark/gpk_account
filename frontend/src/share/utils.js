export function parseErr(str) {
  let err;
  try {
    err = JSON.parse(str).errors;
  } catch (e) {
    console.error(e);
    err = false;
  }
  return err;
}
