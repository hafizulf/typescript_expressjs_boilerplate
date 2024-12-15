import { injectable } from "inversify";

@injectable()
export class NamespaceConfigService {
  public publicNamespaces: string[] = [];

  setPublicNamespaces(namespaces: string[]): void {
    this.publicNamespaces = namespaces;
  }
}
