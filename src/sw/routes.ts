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
          

            import NoteDetailPage, {
              getInitialProps as getNoteDetailPageProps,
              metadata as NoteDetailPageMetadata,
            } from 'app/notes/[id]/index';

            Routes['/notes/[id]'] = {
              Component: NoteDetailPage,
              getInitialProps: getNoteDetailPageProps,
              metadata: NoteDetailPageMetadata,
            };
          
        
        export default Routes;
      