import { injectable } from "inversify";
import { MachineTsBoiler1Subscriber } from "./subscribers/machine-ts-boiler1-subscriber";
import mqtt, { IClientOptions, MqttClient as MqttClientType } from "mqtt";
import { MQTT_PASSWORD, MQTT_PORT, MQTT_SERVER, MQTT_USERNAME } from "@/config/env";

@injectable()
export class Mqtt {
  private client: mqtt.MqttClient | null = null;

  constructor(
    private readonly machineTsBoiler1: MachineTsBoiler1Subscriber,
  ) {}

  /**
   * Connect to the MQTT broker.
   * @returns The connected MQTT client instance.
   */
  public connect(): MqttClientType {
    const options: IClientOptions = {
      port: parseInt(MQTT_PORT, 10),
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
    };

    if (!this.client) {
      this.client = mqtt.connect(MQTT_SERVER, options);

      this.client.on("connect", () => {
        console.log("Connected to MQTT broker");
      });

      this.client.on("error", (error) => {
        console.error("MQTT Connection Error:", error);
      });
    }

    return this.client;
  }

  /**
   * Set up the subscribers.
   */
  public setSubscriber(): void {
    const client = this.getClient();
    // subscribers
    this.machineTsBoiler1.setup(client);
  }

  /**
   * Retrieve the MQTT client instance.
   * @returns The MQTT client instance.
   * @throws If the client is not connected.
   */
  public getClient(): mqtt.MqttClient {
    if (!this.client) {
      throw new Error("MQTT client is not connected. Call connect() first.");
    }
    return this.client;
  }

  /**
   * Disconnect the MQTT client.
   */
  public disconnect(): void {
    if (this.client) {
      this.client.end();
      console.log("Disconnected from MQTT broker");
      this.client = null;
    }
  }
}
