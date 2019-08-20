export class TimeoutError extends Error {
    constructor(s: string) {
        super(s)
    }
}

export class TimeoutTracer {
    private _start: number

    constructor(readonly timeout: number) {
        this._start = Date.now()
    }

    trace() {
        const now = Date.now()
        if ( (now - this._start) > this.timeout ) {
            throw new TimeoutError('could not complete parsing within the given time.')
        }
    }

}
