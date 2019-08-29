import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { PageContent } from '../models/page-content.model';

export enum PageContentActionTypes {
  LoadPageContents = '[PageContent] Load PageContents',
  AddPageContent = '[PageContent] Add PageContent',
  UpsertPageContent = '[PageContent] Upsert PageContent',
  AddPageContents = '[PageContent] Add PageContents',
  UpsertPageContents = '[PageContent] Upsert PageContents',
  UpdatePageContent = '[PageContent] Update PageContent',
  UpdatePageContents = '[PageContent] Update PageContents',
  DeletePageContent = '[PageContent] Delete PageContent',
  DeletePageContents = '[PageContent] Delete PageContents',
  ClearPageContents = '[PageContent] Clear PageContents'
}

export class LoadPageContents implements Action {
  readonly type = PageContentActionTypes.LoadPageContents;

  constructor(public payload: { pageContents: PageContent[] }) {}
}

export class AddPageContent implements Action {
  readonly type = PageContentActionTypes.AddPageContent;

  constructor(public payload: { pageContent: PageContent }) {}
}

export class UpsertPageContent implements Action {
  readonly type = PageContentActionTypes.UpsertPageContent;

  constructor(public payload: { pageContent: PageContent }) {}
}

export class AddPageContents implements Action {
  readonly type = PageContentActionTypes.AddPageContents;

  constructor(public payload: { pageContents: PageContent[] }) {}
}

export class UpsertPageContents implements Action {
  readonly type = PageContentActionTypes.UpsertPageContents;

  constructor(public payload: { pageContents: PageContent[] }) {}
}

export class UpdatePageContent implements Action {
  readonly type = PageContentActionTypes.UpdatePageContent;

  constructor(public payload: { pageContent: Update<PageContent> }) {}
}

export class UpdatePageContents implements Action {
  readonly type = PageContentActionTypes.UpdatePageContents;

  constructor(public payload: { pageContents: Update<PageContent>[] }) {}
}

export class DeletePageContent implements Action {
  readonly type = PageContentActionTypes.DeletePageContent;

  constructor(public payload: { id: string }) {}
}

export class DeletePageContents implements Action {
  readonly type = PageContentActionTypes.DeletePageContents;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearPageContents implements Action {
  readonly type = PageContentActionTypes.ClearPageContents;
}

export type PageContentActions =
 LoadPageContents
 | AddPageContent
 | UpsertPageContent
 | AddPageContents
 | UpsertPageContents
 | UpdatePageContent
 | UpdatePageContents
 | DeletePageContent
 | DeletePageContents
 | ClearPageContents;
