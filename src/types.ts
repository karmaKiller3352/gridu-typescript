export interface IObserver {
  handlers: IHandlers;
  isUnsubscribed: boolean;
  _unsubscribe?(): void;

  next(val: IRequestMock): void;
  error(err: IRequestMock): void;
  complete(): void;
  unsubscribe(): void;
}

export interface IResponse {
  status: HTTP_STATUSES;
}

export interface IHandlers {
  next: (val: IRequestMock) => IResponse;
  error: (val: IRequestMock) => IResponse;
  complete: () => void;
}

export interface ISubscribe {
  (observer: IObserver): () => void;
}

export enum HTTP_METHODS {
  POST = "POST",
  GET = "GET",
}

export enum HTTP_STATUSES {
  OK = 200,
  INTERNAL_SERVER_ERROR = 500,
}

export type Roles = ("user" | "admin")[];

export interface IUserMock {
  age: number;
  name: string;
  roles: Roles;
  createdAt: Date;
  isDeleted: boolean;
}

export type Params = {
  id?: string;
};

export interface IRequestMock {
  host: string;
  path: string;
  params: Params;
  body?: IUserMock;
  method: HTTP_METHODS;
}

export type RequestsMock = IRequestMock[];
