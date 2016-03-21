import makeFalcorDriver from './falcor-driver'

export {
    /**
     * Falcor Driver factory.
     *
     * This is a function which, when called, returns a Falcor Driver for Cycle.js
     * apps. The driver is also a function, and it takes an Observable of requests
     * as input, and generates a metastream of responses.
     *
     * **Requests**. The Observable of requests always emit objects. Object properties
     * should be the name of the method to execute on Falcor model and route's path
     * in the form of an array.
     * `request` object properties:
     *
     * - `method` *(String)*: the falcor model method. **required**
     * - `path` *(Array)*: array representing a model's route path. **required**
     * - `resKey` *(String)*: optional key in which the response will be wrapped
     * - `invalidatePath` *(Array)*: array with path to invalidate upon received
     * response from provided path
     *
     * **Responses**. A metastream is an Observable of Observables. The response
     * metastream emits Observables of responses. These Observables of responses
     * have a `request` field attached to them (to the Observable object itself)
     * indicating which request (from the driver input) generated this response
     * Observable. The response Observables themselves emit the response object
     * received by invoking the provided falcor model method with the provided path.
     *
     * @param {Object} options an object with method and path
     * @return {Function} the Falcor Driver function
     * @function makeFalcorDriver
     */
    makeFalcorDriver
};
