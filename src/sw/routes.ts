const Routes = {};

      
            import HomePage, {
              getInitialProps as getHomePageProps,
              metadata as HomePageMetadata,
            } from 'app/index';

            Routes['/'] = {
              Component: HomePage,
              getInitialProps: getHomePageProps,
              metadata: HomePageMetadata,
            };
          
        
        export default Routes;
      