export enum ACTION_EVENTS {
  "REFETCH_ORGS" = "REFETCH_ORGS",
}

type EventFnType = () => void;

class EventEmitter {
  private callbacks: Partial<Record<ACTION_EVENTS, EventFnType[]>> = {};

  add(name: ACTION_EVENTS, cb: EventFnType) {
    if (!this.callbacks[name]) {
      this.callbacks[name] = [];
    }
    this.callbacks[name].push(cb);
  }

  trigger(name: ACTION_EVENTS) {
    this.callbacks[name]?.forEach((_cb) => {
      _cb();
    });
  }
}

export const actions = new EventEmitter();
