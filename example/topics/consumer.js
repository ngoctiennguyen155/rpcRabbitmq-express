const amqp = require("amqplib");
const consumer = async (types) => {
  try {
    const exchange = "topic-logs";
    const connection = await amqp.connect("amqp://tiennn:tiennn@localhost");
    const channel = await connection.createChannel();

    process.once("SIGINT", async () => {
      await channel.close();
      await connection.close();
    });

    await channel.assertExchange(exchange, "topic", { durable: true });
    const data = await channel.assertQueue("", { exclusive: true });

    //
    for (const type of types) {
      await channel.bindQueue(data.queue, exchange, type);
    }

    //
    await channel.consume(
      data.queue,
      (message) => {
        if (message) {
          console.log(
            " [x] Received '%s'",
            JSON.parse(message.content.toString())
          );
        }
      },
      { noAck: true }
    );

    console.log(" [*] Waiting for messages. To exit press CTRL+C");
  } catch (err) {
    console.warn(err);
  }
};

module.exports = { consumer };
