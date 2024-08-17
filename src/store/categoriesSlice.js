
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload;
    },
    addWidget(state, action) {
      const { categoryId, widget } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category && category.widgets) {
        category.widgets.push(widget);
      } else if (category) {
        category.widgets = [widget]; // Initialize widgets array if undefined
      }
    },
    removeWidget(state, action) {
      const { categoryId, widgetId } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category && category.widgets) {
        category.widgets = category.widgets.filter(widget => widget.id !== widgetId);
      }
    },
  },
});

export const { setCategories, addWidget, removeWidget } = categoriesSlice.actions;
export default categoriesSlice.reducer;