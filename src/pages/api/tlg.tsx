import { getBlockNumber } from "@/libs/alchemy";
import { CurrentConfig } from "@/libs/config";
import { quote } from "@/libs/quote";
import { NextApiHandler } from "next";
import ReactDomServer from "react-dom/server";

const handler: NextApiHandler = async (req, res) => {
  const tgbot = process.env.TELEGRAM_TOKEN;

  if (req.body.message.text === "/getQuote") {
    const outputAmount = await quote();
    const messageJsx = (
      <>
        Quote input amount: <b>{CurrentConfig.tokens.amountIn}</b> <b>{CurrentConfig.tokens.in.symbol}</b>.%0AQuote 
        output amount: <b>{outputAmount}</b> <b>{CurrentConfig.tokens.out.symbol}</b>.
      </>
    );
    const message = ReactDomServer.renderToString(messageJsx);
    const ret = await fetch(
      `https://api.telegram.org/bot${tgbot}/sendMessage?chat_id=${req.body.message.chat.id}&text=${message}&parse_mode=HTML`
    );
  }
  if (req.body.message.text === "/getBlockNumber") {
    const blockNumber = await getBlockNumber();
    const messageJsx = (
      <>
        The block number is <b>{blockNumber}</b>.%0ATo get a list of commands
        sends /help
      </>
    );
    const message = ReactDomServer.renderToString(messageJsx);
    const ret = await fetch(
      `https://api.telegram.org/bot${tgbot}/sendMessage?chat_id=${req.body.message.chat.id}&text=${message}&parse_mode=HTML`
    );
  }
  if (req.body.message.text === "/start") {
    const messageJsx = (
      <>
        Welcome to <i>NextJS News Channel</i>{" "}
        <b>{req.body.message.from.username}</b>.%0ATo get a list of commands
        sends /help
      </>
    );
    const message = ReactDomServer.renderToString(messageJsx);
    const ret = await fetch(
      `https://api.telegram.org/bot${tgbot}/sendMessage?chat_id=${req.body.message.chat.id}&text=${message}&parse_mode=HTML`
    );
  }
  if (req.body.message.text === "/help") {
    const messageJsx = (
      <>
        Help for <i>NextJS News Channel</i>.%0AUse /getQuote to get a quote for 1000 USDC/WETH on Uniswap
      </>
    );
    const message = ReactDomServer.renderToString(messageJsx);
    const ret = await fetch(
      `https://api.telegram.org/bot${tgbot}/sendMessage?chat_id=${req.body.message.chat.id}&text=${message}&parse_mode=HTML`
    );
  }
  res.status(200).send("OK");
};

export default handler;
