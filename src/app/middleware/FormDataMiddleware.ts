import {
  ExpressWorkerHandler,
  ExpressWorkerRequest,
} from '@express-worker/app';
import { NormalizedFormData } from 'shared/types';

export const FormDataMiddleware: ExpressWorkerHandler = async function (req) {
  if (req.method !== 'POST') {
    (req as ExpressWorkerRequest & { data: NormalizedFormData }).data = {};
    return;
  }

  const rawFormData = req.formData;

  const formData: NormalizedFormData = Object.fromEntries(
    Array.from(rawFormData.entries()).map(([key, value]) => {
      if (key.endsWith('[]')) {
        const allFromKey = rawFormData.getAll(key);
        const onlyFromKey = rawFormData.get(key);

        if (
          allFromKey.length === 1 &&
          allFromKey[0] === onlyFromKey &&
          typeof onlyFromKey === 'string' &&
          onlyFromKey.length > 0
        ) {
          return [key, onlyFromKey.split(',')];
        }

        return [
          key,
          rawFormData.getAll(key).map((v) => {
            return v.toString();
          }),
        ];
      }

      return [key, value.toString()];
    }),
  );

  (req as ExpressWorkerRequest & { data: NormalizedFormData }).data = formData;
};
