import {
  ExpressWorker,
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { PageShell } from 'components/PageShell';
import { renderToString } from 'react-dom/server';
const Routes = () => require('../routes');

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
  }>(Routes())) {
    app.get(
      convertPath(path),
      async (req: ExpressWorkerRequest, res: ExpressWorkerResponse) => {
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
    );
  }
}
