const amqp = require("amqplib");
(async () => {
  try {
    const exchange = "logs";
    const connection = await amqp.connect("amqp://tiennn:tiennn@localhost");
    const channel = await connection.createChannel();

    process.once("SIGINT", async () => {
      await channel.close();
      await connection.close();
    });

    await channel.assertExchange(exchange, "fanout", { durable: true });
    const data = await channel.assertQueue("", { exclusive: true });
    await channel.bindQueue(data.queue, exchange, "");
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
})();
