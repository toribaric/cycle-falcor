import {Observable} from 'rx';
import model from './model'

function createResponse$(options) {
    return Observable.create(observer => {
        if (typeof options.method !== 'string' || typeof options.path.slice !== 'function') {
            observer.onNext(options);
            observer.onCompleted();
        } else {
            try {
                model[options.method](options.path).then(
                    res => {
                        if (options.invalidatePath) {
                            model.invalidate(options.invalidatePath);
                        }

                        if (options.resKey) {
                            observer.onNext({
                                [options.resKey]: res
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

function makeFalcorDriver() {
    return function falcorDriver(request$) {
        let response$$ = request$.map(options => {
            let response$ = createResponse$(options);
            response$.request = options;
            return response$;
        }).publish();

        response$$.connect();

        return response$$;
    }
}

export default makeFalcorDriver;
