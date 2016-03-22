import {Observable} from 'rx';
import model from './model'

function createResponse$(request) {
    return Observable.create(observer => {
        if (typeof request.method !== 'string' || typeof request.path.slice !== 'function') {
            observer.onNext(request);
            observer.onCompleted();
        } else {
            try {
                model[request.method](request.path).then(
                    res => {
                        if (request.invalidatePath) {
                            model.invalidate(request.invalidatePath);
                        }

                        if (request.resKey) {
                            observer.onNext({
                                [request.resKey]: res
                            });
                        } else {
                            observer.onNext(res);
                        }

                        observer.onCompleted();
                    },
                    error => {
                        observer.onError(error)
                    }
                );
            } catch (error) {
                observer.onError(error)
            }
        }
    })
}

function isolateSink(request$, scope) {
    return request$.map(request => {
        request._namespace = request._namespace || [];
        request._namespace.push(scope);
        return request;
    })
}

function isolateSource(response$$, scope) {
    let isolatedResponse$$ = response$$.filter(response$ =>
        Array.isArray(response$.request._namespace) &&
        response$.request._namespace.indexOf(scope) !== -1
    );

    isolatedResponse$$.isolateSource = isolateSource;
    isolatedResponse$$.isolateSink = isolateSink;

    return isolatedResponse$$;
}

function makeFalcorDriver() {
    return function falcorDriver(request$) {
        let response$$ = request$.map(request => {
            let response$ = createResponse$(request);

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
    }
}

export default makeFalcorDriver;
