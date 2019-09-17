import * as ContentNavigation from './content-navigation/';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
	contentNavigation: ContentNavigation.ContentNavigationState;
}

export const initialState: AppState = {
	contentNavigation: ContentNavigation.initialState
};

export const reducers: ActionReducerMap<AppState> = {
	contentNavigation: ContentNavigation.reducer
};

export const getContentNavigation = (state: AppState) => state.contentNavigation;
