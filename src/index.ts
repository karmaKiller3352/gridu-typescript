import {
  HTTP_METHODS,
  HTTP_STATUSES,
  IHandlers,
  IRequestMock,
  ISubscribe,
  IUserMock,
  RequestsMock,
  IResponse,
  IObserver,
} from "./types";

export class Observer implements IObserver {
  handlers: IHandlers;
  isUnsubscribed: boolean;
  _unsubscribe?(): void;

  constructor(handlers: IHandlers) {
    this.handlers = handlers;
    this.isUnsubscribed = false;
  }

  next(value: IRequestMock) {
    if (this.handlers.next && !this.isUnsubscribed) {
      this.handlers.next(value);
    }
  }

  error(error: IRequestMock) {
    if (!this.isUnsubscribed) {
      if (this.handlers.error) {
        this.handlers.error(error);
      }

      this.unsubscribe();
    }
  }

  complete() {
    if (!this.isUnsubscribed) {
      if (this.handlers.complete) {
        this.handlers.complete();
      }

      this.unsubscribe();
    }
  }

  unsubscribe() {
    this.isUnsubscribed = true;

    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
}

class Observable {
  private _subscribe: ISubscribe;

  constructor(subscribe: ISubscribe) {
    this._subscribe = subscribe;
  }

  static from(values: RequestsMock) {
    return new Observable((observer: IObserver) => {
      values.forEach((value) => {
        observer.next(value);
      });

      observer.complete();

      return () => {
        console.log("unsubscribed");
      };
    });
  }

  subscribe(obs: IHandlers) {
    const observer = new Observer(obs);

    observer._unsubscribe = this._subscribe(observer);

    return {
      unsubscribe() {
        observer.unsubscribe();
      },
    };
  }
}

const userMock: IUserMock = {
  age: 26,
  isDeleted: false,
  name: "User Name",
  createdAt: new Date(),
  roles: ["user", "admin"],
};

const requestsMock: RequestsMock = [
  {
    method: HTTP_METHODS.POST,
    host: "service.example",
    path: "user",
    body: userMock,
    params: {},
  },
  {
    method: HTTP_METHODS.GET,
    host: "service.example",
    path: "user",
    params: {
      id: "3f5h67s4s",
    },
  },
];

const handleRequest = (request: IRequestMock): IResponse => {
  // handling of request
  return { status: HTTP_STATUSES.OK };
};
const handleError = (error: IRequestMock): IResponse => {
  // handling of error
  return { status: HTTP_STATUSES.INTERNAL_SERVER_ERROR };
};

const handleComplete = (): void => console.log("complete");

const requests$ = Observable.from(requestsMock);

const subscription = requests$.subscribe({
  next: handleRequest,
  error: handleError,
  complete: handleComplete,
});

subscription.unsubscribe();
