import { NextApiHandler } from "next";
import client from "../../libs/db/mongo";
import { TransactionDoc } from "@/libs/db/models";

interface TransactionsGetQuery {
  currentAccount: string;
}

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const { txDoc, currentAccount, txHash } = req.body;

    console.log(req.body);

    await client.createTransaction(txDoc);

    await client.updateUserTransactions(currentAccount, txHash);

    res.status(200).json({ message: "OK" });
  } else {
    const query: TransactionsGetQuery = Array.isArray(req.query)
      ? req.query[0]
      : req.query;

    const transactions = await client.getAllTransactions(query.currentAccount);

    if (transactions) {
      const response: TransactionDoc[] = transactions.map((transaction) => {
        return {
          id: transaction.id,
          fromAddress: transaction.fromAddress,
          toAddress: transaction.toAddress,
          timestamp: transaction.timestamp,
          txHash: transaction.txHash,
          amount: transaction.amount,
        };
      });
      res.status(200).json(response);
    } else {
      res.status(200).json({
        message: "No transactions for the account " + query.currentAccount,
      });
    }
  }
};

export default handler;
