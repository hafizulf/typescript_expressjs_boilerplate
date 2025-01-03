import { injectable } from "inversify";
import { MqttClient as MqttClientType } from "mqtt/*";

@injectable()
export class MachineTsBoiler1Subscriber {
  private TOPIC_TO_SUBSCRIBE = "device/machine-ts-boiler1/data/example";

  constructor() {}

  public setup(mqttClient: MqttClientType): void {
    mqttClient.subscribe(this.TOPIC_TO_SUBSCRIBE, (err: Error | null) => {
      if (err) {
        console.error("Error subscribing to topic:", err);
        return;
      }

      console.log(`Subscribed to topic: ${this.TOPIC_TO_SUBSCRIBE}`);
    });

    mqttClient.on("message", (topic, message) => {
      console.log(`Message received on topic ${topic}: ${message.toString()}`);
      // add service
    });
  }
}
