'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _rx = require('rx');

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createResponse$(request) {
    return _rx.Observable.create(function (observer) {
        if (typeof request.method !== 'string' || typeof request.path.slice !== 'function') {
            observer.onNext(request);
            observer.onCompleted();
        } else {
            try {
                _model2.default[request.method](request.path).then(function (res) {
                    if (request.invalidatePath) {
                        _model2.default.invalidate(request.invalidatePath);
                    }

                    if (request.resKey) {
                        observer.onNext(_defineProperty({}, request.resKey, res));
                    } else {
                        observer.onNext(res);
                    }

                    observer.onCompleted();
                }, function (error) {
                    observer.onError(error);
                });
            } catch (error) {
                observer.onError(error);
            }
        }
    });
}

function isolateSink(request$, scope) {
    return request$.map(function (request) {
        request._namespace = request._namespace || [];
        request._namespace.push(scope);
        return request;
    });
}

function isolateSource(response$$, scope) {
    var isolatedResponse$$ = response$$.filter(function (response$) {
        return Array.isArray(response$.request._namespace) && response$.request._namespace.indexOf(scope) !== -1;
    });

    isolatedResponse$$.isolateSource = isolateSource;
    isolatedResponse$$.isolateSink = isolateSink;

    return isolatedResponse$$;
}

function makeFalcorDriver() {
    return function falcorDriver(request$) {
        var response$$ = request$.map(function (request) {
            var response$ = createResponse$(request);

            if (typeof request.eager === 'boolean' && request.eager) {
                response$ = response$.replay(null, 1);
                response$.connect();
            }

            response$.request = request;

            return response$;
        }).publish();

        response$$.connect();
        response$$.isolateSource = isolateSource;
        response$$.isolateSink = isolateSink;

        return response$$;
    };
}

exports.default = makeFalcorDriver;