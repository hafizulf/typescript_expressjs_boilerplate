import TYPES from "@/types";
import { inject, injectable } from "inversify";
import { IMenu } from "./menu-domain";
import { IMenuRepository } from "./menu-repository-interface";

@injectable()
export class MenuService {
  constructor(
    @inject(TYPES.IMenuRepository) private _repository: IMenuRepository,
  ) {}

  public async findAll(): Promise<IMenu[]> {
    return (await this._repository.findAll()).map((el) => el.unmarshal());
  }

  public async findAllParents(): Promise<IMenu[]> {
    return (await this._repository.findAllParents()).map((el) => el.unmarshal());
  }

  public async findChildsByParentId(parentId: string): Promise<IMenu[]> {
    return (await this._repository.findChildsByParentId(parentId)).map((el) => el.unmarshal());
  }

  public async store(props: IMenu): Promise<IMenu> {
    return (await this._repository.store(props)).unmarshal();
  }

  public async findById(id: string): Promise<IMenu> {
    return (await this._repository.findById(id)).unmarshal();
  }

  public async update(id: string, props: IMenu): Promise<IMenu | null> {
    return (await this._repository.update(id, props)).unmarshal();
  }

  public async delete(id: string): Promise<boolean> {
    return this._repository.delete(id);
  }
}
