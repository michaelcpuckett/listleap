import HomePage, {
  getInitialProps as getHomePageProps,
  metadata as homePageMetadata,
} from 'app/index';
const Routes = {
  '/': {
    Component: HomePage,
    getInitialProps: getHomePageProps,
    metadata: homePageMetadata,
  },
};
export default Routes;
