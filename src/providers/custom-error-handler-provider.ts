import {inject, Provider} from '@loopback/context';
import {HandlerContext, LogError, Reject, RestBindings} from '@loopback/rest';
import {HttpError} from 'http-errors';
import {ErrorWriterOptions, writeErrorToResponse} from 'strong-error-handler';

// Make this mapping configurable at RestServer level,
// allow apps and extensions to contribute additional mappings.
const codeToStatusCodeMap: {[key: string]: number} = {
  ENTITY_NOT_FOUND: 404,
};

export class CustomErrorProvider implements Provider<Reject> {
  constructor(
    @inject(RestBindings.SequenceActions.LOG_ERROR)
    protected logError: LogError,
    @inject(RestBindings.ERROR_WRITER_OPTIONS, {optional: true})
    protected errorWriterOptions?: ErrorWriterOptions,
  ) {}

  value(): Reject {
    return (context, error) => this.action(context, error);
  }

  action({request, response}: HandlerContext, error: Error) {
    const err = <HttpError>error;
    if (!err.status && !err.statusCode && err.code) {
      const customStatus = codeToStatusCodeMap[err.code];
      if (customStatus) {
        err.statusCode = customStatus;
      }
    }

    const statusCode = err.statusCode || err.status || 500;

    // check if the status code is 500. if so, parse the
    // message and set the status code and message to the error object.
    writeErrorToResponse(err, request, response, this.errorWriterOptions);
    this.logError(error, statusCode, request);
  }
}
