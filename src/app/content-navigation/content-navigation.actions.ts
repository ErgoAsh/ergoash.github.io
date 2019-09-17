import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export enum ContentNavigationActionTypes {
  	SHOW_NEXT_VERTICAL_PAGE = '[ContentNavigation] Show next vertical page',
  	SHOW_PREVIOUS_VERTICAL_PAGE = '[ContentNavigation] Show previous vertical page',
}

export class ShowNextVerticalPageAction implements Action {
  	readonly type = ContentNavigationActionTypes.SHOW_NEXT_VERTICAL_PAGE;
}

export class ShowPreviousVerticalPageAction implements Action {
	readonly type = ContentNavigationActionTypes.SHOW_PREVIOUS_VERTICAL_PAGE;
}

export type ContentNavigationAction = ShowNextVerticalPageAction | ShowPreviousVerticalPageAction;
