import { DomainEntity } from "../common/domainEntity";
import { DefaultEntityBehaviour } from "../common/dto/common-dto";

export interface IAnnouncement {
  id?: string;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class AnnouncementDomain
extends DomainEntity<IAnnouncement>
implements DefaultEntityBehaviour<IAnnouncement> {
  private constructor(props: IAnnouncement) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IAnnouncement): AnnouncementDomain {
    return new AnnouncementDomain(props);
  }

  public unmarshal(): IAnnouncement {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }
}
