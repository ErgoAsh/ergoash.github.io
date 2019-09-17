export interface ContentNavigationState {
	currentVerticalPosition: number;
	maxPosition: number;
}

export const initialState: ContentNavigationState = {
	currentVerticalPosition: 0,
	maxPosition: 4
} as ContentNavigationState;
