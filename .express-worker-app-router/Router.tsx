import { ExpressWorker } from '@express-worker/app';
import { PageShell } from '@express-worker/app-router/PageShell';
import { renderToString } from 'react-dom/server';
import Routes from './routes';

interface FormDataWithArrayValue {
  [key: `${string}[]`]: string[] | undefined;
}

interface FormDataWithStringValue {
  [key: string]: string | undefined;
}

type NormalizedFormData = FormDataWithArrayValue & FormDataWithStringValue;

interface AdditionalRequestProperties {
  query: Record<string, string>;
  data: NormalizedFormData;
}

function convertPath(path: string) {
  return path.replace(/\[([^\]]+)\]/g, ':$1');
}

export default function useAppRouter(app: ExpressWorker) {
  for (const [path, { Component, getStaticProps, metadata }] of Object.entries<{
    Component: React.ComponentType<any>;
    getStaticProps?: (
      params: Record<string, string>,
    ) => Promise<Record<string, any>>;
    metadata?: {
      title: string;
      description?: string;
    };
  }>(Routes)) {
    app.get(
      convertPath(path),
      ExpressWorker.applyAdditionalRequestProperties<AdditionalRequestProperties>(
        async (req, res) => {
          try {
            const initialProps = getStaticProps
              ? await getStaticProps(req.params)
              : {};

            const renderResult = renderToString(
              <PageShell
                {...(metadata || {})}
                initialData={initialProps}
              >
                <Component {...initialProps} />
              </PageShell>,
            );

            res.send(renderResult);
          } catch (error) {
            res.status(404).send('Not found');
          }
        },
      ),
    );
  }
}
