import {inject, Provider} from '@loopback/context';
import {HandlerContext, LogError, Reject, RestBindings} from '@loopback/rest';
import {HttpError} from 'http-errors';
import {ErrorWriterOptions, writeErrorToResponse} from 'strong-error-handler';
import {HttpStatusMapping} from '../keys';
// Make this mapping configurable at RestServer level,
// allow apps and extensions to contribute additional mappings.
// can find this in the keys file in root directory
const {codeToStatusCodeMap} = HttpStatusMapping;

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

    // check if the error message has "(::Custom Error::)".
    //  if so, parse the error message and get the error
    // type and message from it
    if (err.message.indexOf('(::Custom Error::)') > -1) {
      const errorMessage: String = err.message.split('(::Custom Error::) ')[1];
      const parsedErrorMessage = errorMessage.split('{{End}}');
      const [type, message] = parsedErrorMessage;
      err.message = message;
      err.name = type;
      err.status = codeToStatusCodeMap[type] || 500;
    }
    // message and set the status code and message to the error object.
    writeErrorToResponse(err, request, response, this.errorWriterOptions);
    this.logError(error, statusCode, request);
  }
}
