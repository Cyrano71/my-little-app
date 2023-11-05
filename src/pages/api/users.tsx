import { NextApiHandler, NextApiResponse } from "next";
import client from "../../libs/db/mongo";
import { UserDoc } from "@/libs/db/models";

interface UserQuery {
  currentAccount: string;
}

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const { userDoc } = req.body;

    await client.createUserIfNotExists(userDoc);

    res.status(200).send("OK");
  } else {
    //https://stackoverflow.com/questions/70551909/nextjs-api-with-typescript-restricting-nextapirequest-query-param-to-just-strin
    const query: UserQuery = Array.isArray(req.query)
      ? req.query[0]
      : req.query;

    const clientRes = await client.getUser(query.currentAccount);

    if (clientRes) {
      const response: UserDoc = {
        _id: clientRes._id.toString(),
        userName: clientRes.userName,
        address: clientRes.address,
        transactions: clientRes.transactions,
      };
      res.status(200).json(response);
    } else {
      res.status(200).json({
        message: "No use for the account " + query.currentAccount,
      });
    }
  }
};

export default handler;
