import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
  applyAdditionalRequestProperties as ExpressWorkerApplyAdditionalRequestProperties,
} from '@express-worker/app';
import { NormalizedFormData } from 'shared/types';

export interface AdditionalRequestProperties {
  version: number;
  query: Record<string, string>;
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
