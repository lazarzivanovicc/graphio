export class Page<E> {
    offset: number = 0;
    page: number = 0;
    totalPages: number = 0;
    total: number = 0;
    totalElements: number = 0;
    content: E[] = [];
    statusCounts?: any;
    empty: boolean = false;
    first: boolean = false;
    last: boolean = false;
  
    static from(param: any[]) {
      const p = new Page();
      p.content = param;
      p.totalElements = param.length;
      p.total = param.length;
      p.totalPages = 1;
      p.page = 1;
      p.offset = 0;
      return p;
    }
}