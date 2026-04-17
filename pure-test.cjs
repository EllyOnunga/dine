const { MongoClient } = require('mongodb');

async function main() {
  const uriSrv = "mongodb://elly:elly@ac-d862qfj-shard-00-00.vvy07rk.mongodb.net:27017,ac-d862qfj-shard-00-01.vvy07rk.mongodb.net:27017,ac-d862qfj-shard-00-02.vvy07rk.mongodb.net:27017/quty?tls=true&replicaSet=atlas-2y4p5q-shard-0&authSource=admin&retryWrites=true&w=majority";
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
