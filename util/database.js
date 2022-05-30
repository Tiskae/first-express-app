const { MongoClient } = require("mongodb");

let _db;

const mongoConnect = callback => {
  const uri =
    "mongodb+srv://Tiskae:o8M4nQR36nhclwpd@cluster0.irqruor.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // serverApi: ServerApiVersion.v1,
  });
  client.connect((err, result) => {
    // const collection = client.db("test").collection("devices");
    console.log(err);
    // console.log(client.db("cluster0"));

    _db = client.db("cluster0");
    callback(result);
    // perform actions on the collection object
    // client.close();
  });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
