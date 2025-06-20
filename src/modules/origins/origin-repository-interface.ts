import BaseRepository from "../common/interfaces/base-repository-interface";
import { IOrigin, Origin } from "./origin-domain";


export interface IOriginRepository extends BaseRepository<Origin, IOrigin> {}
