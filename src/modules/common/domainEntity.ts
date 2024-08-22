import { uuidv7 } from "uuidv7";

export abstract class DomainEntity<T> {
  protected props: T;
  protected readonly _id: string;

  constructor(props: T, id?: string, ) {
    this.props = props;
    this._id = id? id : uuidv7();
  }
}
