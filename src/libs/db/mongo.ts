import { MongoClient } from "mongodb";
import { TransactionDoc, UserDoc } from "./models";

async function getMongoClient(dbName: string) {
  console.log("connection db")
  const driver = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_ID}/${dbName}?retryWrites=true&w=majority`;
  const client = await MongoClient.connect(driver);
  return client;
}


class Client {
  async getUser(account: string){
    const client = await getMongoClient("users");
    const db = client.db();
    const usersCollections = db.collection("users");
    const result = await usersCollections.findOne({address:account})
    console.log(result);
    client.close();
    return result
  }
  
  async createUserIfNotExists(userDoc: UserDoc) {
    const client = await getMongoClient("users");
    const db = client.db();
    const usersCollections = db.collection("users");
    if (userDoc.transactions === undefined) {
      userDoc.transactions = [];
    }
    const result = await usersCollections.updateOne(
      {
        address: userDoc.address,
      },
      {
        $setOnInsert: userDoc,
      },
      { upsert: true }
    );
    console.log(result);
    client.close();
  }

  async createTransaction(transactionDoc: TransactionDoc) {
    const client = await getMongoClient("transactions");
    const db = client.db();
    const transactionsCollections = db.collection("transactions");
    const result = await transactionsCollections.insertOne(transactionDoc);
    console.log(result);
    client.close();
  }

  async updateUserTransactions(userAccount: string, txHash: string){
    const client = await getMongoClient("users");
    const db = client.db();
    const usersCollections = db.collection("users");
    const result = await usersCollections.updateOne(
        { address: userAccount },
        { $push: { transactions: txHash } }
     )
    console.log(result);
    client.close();
  }
}

export default new Client();
