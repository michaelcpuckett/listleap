const Routes = {};

      
            import HomePage, {
              getStaticProps as getHomePageProps,
              metadata as HomePageMetadata,
            } from 'app/index';

            Routes['/'] = {
              Component: HomePage,
              getStaticProps: getHomePageProps,
              metadata: HomePageMetadata,
            };
          

            import NoteDetailPage, {
              getStaticProps as getNoteDetailPageProps,
              metadata as NoteDetailPageMetadata,
            } from 'app/notes/[id]/index';

            Routes['/notes/[id]'] = {
              Component: NoteDetailPage,
              getStaticProps: getNoteDetailPageProps,
              metadata: NoteDetailPageMetadata,
            };
          
        
        export default Routes;
      