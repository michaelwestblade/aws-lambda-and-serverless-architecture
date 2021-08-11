const moment = require("moment");

const greeting = {
  en: "Hello",
  fr: "Bonjour",
  hi: "Namaste",
  es: "Hola",
  pt: "Ola",
  ur: "Assalamo aleikum",
  it: "Ciao",
  de: "Hallo",
};

exports.handler = async (event, context) => {
  const {
    pathParameters: { name },
    queryStringParameters: { lang, ...info },
  } = event;

  const message = `${
    greeting[lang] ? greeting[lang] : greeting["en"]
  }, ${name}`;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message,
      info,
      timestamp: moment().unix(),
    }),
  };
};
