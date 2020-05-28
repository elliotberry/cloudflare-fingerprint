addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);

  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hashHex = hashArray
    .map((b) => ("00" + b.toString(16)).slice(-2))
    .join("");
  return hashHex;
}
async function getAllHeadersSent(req) {
  let newHeadersObj = {};
  for await (let pair of req.headers.entries()) {
    console.log(pair[0] + ": " + pair[1]);
    newHeadersObj[pair[0]] = pair[1];
  }
  return newHeadersObj;
}
async function hashRequest(req) {
  const headerValues = [
    req.headers.get("user-agent"),
    req.headers.get("cf-ipcountry"),
    req.headers.get("cf-connecting-ip"),
    req.headers.get("accept-language"),
  ];
  const headerValuesString = headerValues.join("");
  return await sha256(headerValuesString);
}
async function doSomething(results) {
  console.log(results);
}
async function handleRequest(req) {
  const identifier = await hashRequest(req);
  const theReqHeaders = await getAllHeadersSent(req);
  await doSomething({
    "hash": identifier,
    "requestHeaders": theReqHeaders
  })
  return await fetch(req); //Go through with the original request, perfomring secret fun fingerprinting
}
