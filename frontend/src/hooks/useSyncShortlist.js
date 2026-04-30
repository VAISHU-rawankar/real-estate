import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated } from '@store/slices/authSlice';
import { selectShortlistItems, clearShortlist } from '@store/slices/shortlistSlice';
import { useAddToShortlistMutation } from '@store/api/userApi';

export function useSyncShortlist() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const localItems = useSelector(selectShortlistItems);
  const [addToShortlist] = useAddToShortlistMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    const sync = async () => {
      if (isAuthenticated && localItems.length > 0) {
        // Sync each local item to the backend
        // We do this sequentially or in parallel
        const promises = localItems.map(id => addToShortlist(id).unwrap().catch(() => {}));
        await Promise.all(promises);
        
        // Once synced, we can clear local storage so we only rely on API
        // But wait, the shortlistSlice also serves as the UI state.
        // We'll keep it for now but maybe just clear the localStorage specific part?
        // Actually, let's keep it simple.
      }
    };
    
    sync();
  }, [isAuthenticated, localItems, addToShortlist]);
}
