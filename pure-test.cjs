const { MongoClient } = require('mongodb');

async function main() {
  const uriSrv = "DATABASE_URL";
  console.log("Testing DIRECT URL with IPv4 forced:", uriSrv);
  
  const client = new MongoClient(uriSrv, {
    family: 4,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });

  try {
    await client.connect();
    console.log("SUCCESS! Connected properly to the remote database.");
    await client.close();
  } catch (err) {
    console.log("SRV URL FAILED:", err.message);
  }
}

main().catch(console.dir);
