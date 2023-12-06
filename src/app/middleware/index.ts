import {
  ExpressWorkerHandler,
  ExpressWorkerRequest,
  ExpressWorkerResponse,
  applyAdditionalRequestProperties,
} from '@express-worker/app';
import { NormalizedFormData, Referrer } from 'shared/types';

export interface AdditionalRequestProperties {
  ref: Referrer;
  data: NormalizedFormData;
}

export function applyMiddleware(
  handler: (
    req: ExpressWorkerRequest & AdditionalRequestProperties,
    res: ExpressWorkerResponse,
  ) => Promise<void>,
) {
  return applyAdditionalRequestProperties<AdditionalRequestProperties>(handler);
}
