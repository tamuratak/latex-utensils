import * as assert from 'assert'

export function equalOnlyOnExpectedOwnedProperties(actual: any, expected: any, message?: string) {
    if (expected === null || typeof expected !== 'object') {
        if (actual !== expected) {
            throw new assert.AssertionError({actual, expected, message})
        }
        return
    }
    try {
        if (expected instanceof Array) {
            if (!(actual instanceof Array) || actual.length !== expected.length) {
                throw new assert.AssertionError({actual, expected, message})
            }
            for (let i = 0; i < expected.length; i++) {
                equalOnlyOnExpectedOwnedProperties(actual[i], expected[i])
            }
            return
        }
        for (const key in expected) {
            equalOnlyOnExpectedOwnedProperties(actual[key], expected[key])
        }
    } catch (e) {
        if (e instanceof assert.AssertionError) {
            throw new assert.AssertionError({actual, expected, message})
        } else {
            throw e
        }
    }
}
