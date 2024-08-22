import { DefaultEntityBehaviour } from "./dto/common-dto";

export interface IPagination {
  page: number;
  limit: number;
  offset: number;
  totalRows: number;
  currentRows: number;
  totalPages: number;
  prevPage: number | null;
  nextPage: number | null;
}

export class Pagination implements IPagination, DefaultEntityBehaviour<IPagination> {
  page: number = 1;
  limit: number = 10;
  offset: number = 0;
  totalRows: number = 0;
  currentRows: number = 0;
  totalPages: number = 0;
  prevPage: number | null = null;
  nextPage: number | null = null;

  private constructor(props: IPagination) {
    Object.assign(this, props);
  }

  public static create(
    { page, limit }: { page: number, limit: number }
  ): Pagination {
    return new Pagination({
      page: page,
      limit: limit,
      offset: (page - 1) * limit,
      totalRows: 0,
      currentRows: 0,
      totalPages: 0,
      nextPage: null,
      prevPage: null,
    })
  }

  generateMeta(totalRow: number, fetchedLength: number): Pagination {
    this.totalRows = totalRow
    this.currentRows = this.offset + fetchedLength
    this.totalPages = Math.ceil(this.totalRows / this.limit)
    this.prevPage = this.page === 1 ? null : this.page -1
    this.nextPage = this.page === this.totalPages
      ? null
      : this.totalPages > 1
        ? this.page + 1
        : null;
    return this;
  }

  omitProperties<key extends keyof IPagination>(
    key: keyof IPagination
  ): Omit<IPagination, key> {
    const data = this.unmarshal();
    delete data[key];
    return data;
  }

  unmarshal(): IPagination {
    return {
      page: this.page,
      limit: this.limit,
      offset: this.offset,
      totalRows: this.totalRows,
      currentRows: this.currentRows,
      nextPage: this.nextPage,
      prevPage: this.prevPage,
      totalPages: this.totalPages,
    };
  }
}
