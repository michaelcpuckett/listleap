import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
  applyAdditionalRequestProperties as ExpressWorkerApplyAdditionalRequestProperties,
} from '@express-worker/app';
import { NormalizedFormData, Referrer } from 'shared/types';

export interface AdditionalRequestProperties {
  version: number;
  query: Referrer;
  data: NormalizedFormData;
}

export function handleRequest(
  handler: (
    req: ExpressWorkerRequest & AdditionalRequestProperties,
    res: ExpressWorkerResponse,
  ) => Promise<void>,
) {
  return ExpressWorkerApplyAdditionalRequestProperties<AdditionalRequestProperties>(
    handler,
  );
}
