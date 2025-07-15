import BaseRepository from "../common/interfaces/base-repository-interface";
import { IOrigin, Origin } from "./origin-domain";
import { OriginType } from "./origin-dto";


export interface IOriginRepository extends BaseRepository<Origin, IOrigin> {
  findAllByType(type: OriginType): Promise<Origin[]>,
}
