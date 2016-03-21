'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _rx = require('rx');

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createResponse$(options) {
    return _rx.Observable.create(function (observer) {
        if (typeof options.method !== 'string' || typeof options.path.slice !== 'function') {
            observer.onNext(options);
            observer.onCompleted();
        } else {
            try {
                _model2.default[options.method](options.path).then(function (res) {
                    if (options.invalidatePath) {
                        _model2.default.invalidate(options.invalidatePath);
                    }

                    if (options.resKey) {
                        observer.onNext(_defineProperty({}, options.resKey, res));
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

function makeFalcorDriver() {
    return function falcorDriver(request$) {
        var response$$ = request$.map(function (options) {
            var response$ = createResponse$(options);
            response$.request = options;
            return response$;
        }).publish();

        response$$.connect();

        return response$$;
    };
}

exports.default = makeFalcorDriver;