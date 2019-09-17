import { reducer } from './content-navigation.reducer';
import { initialState } from './content-navigation.state';
import { ShowNextVerticalPageAction, ShowPreviousVerticalPageAction } from './content-navigation.actions';

describe('ContentNavigation Reducer', () => {
  	describe('unknown action', () => {
		it('should return the previous state', () => {
			const action = {} as any;
			const result = reducer(initialState, action);
			expect(result).toEqual(initialState);
		});
	}),
	describe('known actions', () => {
		it('should return next page', () => {
			const action = new ShowNextVerticalPageAction();
			const result = reducer({ ...initialState, currentVerticalPosition: 2}, action);
			expect(result.currentVerticalPosition).toBe(3);
		});
		it('should return previous page', () => {
			const action = new ShowPreviousVerticalPageAction();
			const result = reducer({ ...initialState, currentVerticalPosition: 2 }, action);
			expect(result.currentVerticalPosition).toBe(1);
		});
		it('should not return page number below 0', () => {
			const action = new ShowPreviousVerticalPageAction();
			const result = reducer({ ...initialState, currentVerticalPosition: 0 }, action);
			expect(result.currentVerticalPosition).toBe(0);
		});
		it('should not return page number above max', () => {
			const action = new ShowNextVerticalPageAction();
			const result = reducer({ ...initialState, currentVerticalPosition: initialState.maxPosition }, action);
			expect(result.currentVerticalPosition).toBe(initialState.maxPosition);
		});
	});
});
