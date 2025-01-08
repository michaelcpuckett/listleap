import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { HomePage } from 'components/pages/HomePage';
import { handleRequest } from 'middleware/index';
import { renderToString } from 'react-dom/server';

export async function GetHome(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    const renderResult = renderToString(
      <HomePage
        version={req.version}
        query={req.query}
        url={req.url}
      />,
    );

    res.send(`<!DOCTYPE html>${renderResult}`);
  })(req, res);
}
