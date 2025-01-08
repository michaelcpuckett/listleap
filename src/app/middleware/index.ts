import {
  applyAdditionalRequestProperties as ExpressWorkerApplyAdditionalRequestProperties,
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';

interface FormDataWithArrayValue {
  [key: `${string}[]`]: string[] | undefined;
}

interface FormDataWithStringValue {
  [key: string]: string | undefined;
}

export type NormalizedFormData = FormDataWithArrayValue &
  FormDataWithStringValue;

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
