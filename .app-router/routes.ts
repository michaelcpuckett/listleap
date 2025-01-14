const Routes = {};

import NoteDetailPage, {
  getStaticProps as getNoteDetailPageProps,
  metadata as NoteDetailPageMetadata,
} from 'app/notes/[id]/page';

Routes['/notes/[id]'] = {
  Component: NoteDetailPage,
  getStaticProps: getNoteDetailPageProps,
  metadata: NoteDetailPageMetadata,
};

import HomePage, {
  getStaticProps as getHomePageProps,
  metadata as HomePageMetadata,
} from 'app/page';

Routes['/'] = {
  Component: HomePage,
  getStaticProps: getHomePageProps,
  metadata: HomePageMetadata,
};

export default Routes;
