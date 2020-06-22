exports.main = {
  get: async function (event, context, callback) {
    console.log(JSON.stringify({ event, context }, null, 2));
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        event,
        context,
        message: "hello world",
      }),
    };
    callback(null, response);
  },
};
