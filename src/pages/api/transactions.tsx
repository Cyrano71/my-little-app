import { NextApiHandler } from "next";
import client from "../../libs/db/mongo";

const handler: NextApiHandler = async (req, res) => {
  const { txDoc, currentAccount, txHash } = req.body;

  console.log(req.body)

  await client.createTransaction(txDoc);

  await client.updateUserTransactions(currentAccount, txHash);

  res.status(200).json({message: "OK"});
};

export default handler;
