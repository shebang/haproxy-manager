'use strict';
/*
 * credits: Korbinian Kuhn, https://stackoverflow.com/questions/49282667/how-can-i-write-a-unit-test-with-streams-promises-and-pipes-together
 **/

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

    removeListener(event, func) {

        delete this.events[event];
        return this;
    }

    end() {
    }

    write(s) {
    }
}
class StreamMock extends StreamMockBase {

    constructor() {

        super();
        this.stderr = new StreamMockBase();
    }
};

class SocketMock extends StreamMockBase {

    constructor() {

        super();
    }
};


module.exports = {

    StreamMock,
    SocketMock
};
