import { ContentNavigationAction, ContentNavigationActionTypes } from './content-navigation.actions';
import { ContentNavigationState } from './content-navigation.state';

export function reducer(state: ContentNavigationState, action: ContentNavigationAction): ContentNavigationState {
  	switch (action.type) {
		case ContentNavigationActionTypes.SHOW_NEXT_VERTICAL_PAGE: {
			return {
				...state,
				currentVerticalPosition: Math.min(state.currentVerticalPosition + 1, state.maxPosition),
			};
		}

		case ContentNavigationActionTypes.SHOW_PREVIOUS_VERTICAL_PAGE: {
			return {
				...state,
				currentVerticalPosition: Math.max(state.currentVerticalPosition - 1, 0),
			};
		}

		default: {
			return { ...state };
		}
  	}
}
