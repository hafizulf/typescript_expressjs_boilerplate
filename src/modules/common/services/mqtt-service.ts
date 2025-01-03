import { Mqtt } from "@/libs/mqtt/mqtt-index";
import { inject, injectable } from "inversify";

@injectable()
export class MqttService {
  constructor(
    @inject(Mqtt) private mqtt: Mqtt,
  ) {}

  public publish(topic: string, message: string): void {
    this.mqtt.getClient().publish(topic, message);
  }
}
