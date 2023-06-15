const amqp = require("amqplib");
(async () => {
  let connection;
  const exchange = "direct-logs";
  const text = {
    item_id: "macbook",
    text: "This is a sample message to send receiver to check the ordered Item Availablility",
  };
  try {
    connection = await amqp.connect("amqp://tiennn:tiennn@localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, "direct", {
      durable: true,
    });
    channel.publish(exchange, "error", Buffer.from(JSON.stringify(text)), {
      deliveryMode: true,
    });
    channel.publish(exchange, "info", Buffer.from(JSON.stringify(text)), {
      deliveryMode: true,
    });
    channel.publish(exchange, "debug", Buffer.from(JSON.stringify(text)), {
      deliveryMode: true,
    });
    console.log(" [x] Sent '%s'", text);

    await channel.close();
  } catch (err) {
    console.warn(err);
  } finally {
    if (connection) await connection.close();
  }
})();
