import fs from 'fs';
import path from 'path';

// Paths
const srcDirectory = path.resolve(__dirname, '../', 'src');
const appDirectory = path.resolve(srcDirectory, 'app');

/**
 * Recursively generates a route manifest for the app directory.
 * @param directory - The current directory to scan.
 * @param baseRoute - The base route for generating paths.
 * @returns A route manifest object.
 */
function generateRoutes(
  directory: string,
  baseRoute: string = '',
): Record<string, string> {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const routes: Record<string, string> = {};

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    const routePath = path.join(baseRoute, entry.name);

    if (entry.isDirectory()) {
      // Recursively process subdirectories
      Object.assign(routes, generateRoutes(entryPath, routePath));
    } else if (entry.isFile() && entry.name === 'index.tsx') {
      // Convert directory path to a route
      const route = routePath
        .replace(/\/index\.tsx$/, '') // Remove /index.tsx
        .replace(/\\/g, '/'); // Normalize slashes

      routes[route || '/'] = `.${entryPath.replace(srcDirectory, '')}`;
    }
  }

  return routes;
}

/**
 * Writes the route manifest to a JSON file.
 */
function writeRoutesToFile() {
  try {
    const routes = generateRoutes(appDirectory);
    const outputPath = path.resolve(__dirname, '../', 'dist', 'routes.json');

    fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));
    console.log(`✅ Route manifest generated: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating routes:', error);
  }
}

// Run the script
writeRoutesToFile();

function getStaticFiles() {
  return fs.readdirSync(path.resolve(__dirname, '../', 'dist'));
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
