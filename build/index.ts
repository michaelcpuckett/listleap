import fs from 'fs';
import path from 'path';

function getAppRoutes() {
  const routes = {};

  const appDir = path.resolve(__dirname, '../', 'src', 'app');
  const pageFiles = fs.readdirSync(appDir);

  pageFiles.forEach((file) => {
    const pagePath = path.resolve(appDir, file);

    // Check if the file is a directory
    if (fs.lstatSync(pagePath).isDirectory()) {
      return;
    }

    const pageName = file.replace(/\.tsx$/, '');

    const pageModule = require(pagePath);
    const { default: Component, getInitialProps, metadata } = pageModule;

    routes[`/${pageName}`] = {
      Component,
      getInitialProps,
      metadata,
    };
  });

  return routes;
}

/*
Format:
import HomePage, {
  getInitialProps as getHomePageProps,
  metadata as homePageMetadata,
} from 'app/index';

Routes['/'] = {
  Component: HomePage,
  getInitialProps: getHomePageProps,
  metadata: homePageMetadata,
};

export default Routes;
*/
function writeAppRoutesToFile() {
  try {
    const routes = getAppRoutes();
    const outputPath = path.resolve(__dirname, '../', 'src', 'sw', 'routes.ts');

    fs.writeFileSync(
      outputPath,
      `const Routes = {};

      ${Object.entries<{
        Component: Function;
        getInitialProps: Function;
        metadata: Record<string, string>;
      }>(routes)
        .map(([route, { Component }]) => {
          return `
            import ${Component.name}, {
              getInitialProps as get${Component.name}Props,
              metadata as ${Component.name}Metadata,
            } from 'app${route}';

            Routes['${route.replace('index', '')}'] = {
              Component: ${Component.name},
              getInitialProps: get${Component.name}Props,
              metadata: ${Component.name}Metadata,
            };
          `;
        })
        .join('\n')}
        
        export default Routes;
      `,
    );
    console.log(`✅ Routes generated successfully! See ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating routes:', error);
  }
}

writeAppRoutesToFile();

function getStaticFiles() {
  return fs.readdirSync(path.resolve(__dirname, '../', 'dist')).map((file) => {
    return '/' + file;
  });
}

function writeStaticFilesToFile() {
  try {
    const staticFiles = getStaticFiles();
    const outputPath = path.resolve(__dirname, '../', 'dist', 'static.json');

    fs.writeFileSync(outputPath, JSON.stringify(staticFiles, null, 2));

    console.log(`✅ Static files generated successfully! See ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating static files:', error);
  }
}

writeStaticFilesToFile();
