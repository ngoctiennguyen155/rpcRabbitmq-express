const amqp = require("amqplib");
(async () => {
  let connection;
  const queue = "work-queue";
  const text = {
    item_id: "macbook",
    text: "This is a sample message to send receiver to check the ordered Item Availablility",
  };
  try {
    connection = await amqp.connect("amqp://tiennn:tiennn@localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(text)), {
      // deliveryMode: true,
      persistent: true,
    });
    console.log(" [x] Sent '%s'", text);

    await channel.close();
  } catch (err) {
    console.warn(err);
  } finally {
    if (connection) await connection.close();
  }
})();
