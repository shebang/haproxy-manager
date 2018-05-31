'use strict';
class StreamMockBase {

    constructor() {

        this.events = {};
    }

    on(event, func) {

        this.events[event] = func;
        return this;
    }

    emit(event, func) {

        if (typeof this.events[event] === 'function') {
            this.events[event](func);
        }
    }
}
exports = module.exports = class StreamMock extends StreamMockBase {

    constructor() {

        super();
        this.stderr = new StreamMockBase();
    }
};
