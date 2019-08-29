import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PageContent } from '../../models/page-content.model';
import { PageContentActions, PageContentActionTypes } from '../../actions/page-content.actions';

export const pageContentsFeatureKey = 'pageContents';

export interface State extends EntityState<PageContent> {
  // additional entities state properties
}

export const adapter: EntityAdapter<PageContent> = createEntityAdapter<PageContent>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: PageContentActions
): State {
  switch (action.type) {
    case PageContentActionTypes.AddPageContent: {
      return adapter.addOne(action.payload.pageContent, state);
    }

    case PageContentActionTypes.UpsertPageContent: {
      return adapter.upsertOne(action.payload.pageContent, state);
    }

    case PageContentActionTypes.AddPageContents: {
      return adapter.addMany(action.payload.pageContents, state);
    }

    case PageContentActionTypes.UpsertPageContents: {
      return adapter.upsertMany(action.payload.pageContents, state);
    }

    case PageContentActionTypes.UpdatePageContent: {
      return adapter.updateOne(action.payload.pageContent, state);
    }

    case PageContentActionTypes.UpdatePageContents: {
      return adapter.updateMany(action.payload.pageContents, state);
    }

    case PageContentActionTypes.DeletePageContent: {
      return adapter.removeOne(action.payload.id, state);
    }

    case PageContentActionTypes.DeletePageContents: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case PageContentActionTypes.LoadPageContents: {
      return adapter.addAll(action.payload.pageContents, state);
    }

    case PageContentActionTypes.ClearPageContents: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

