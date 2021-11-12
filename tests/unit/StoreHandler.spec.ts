import LocalStore from '@/Stores/LocalStore';
import WebStore from '@/Stores/WebStore';

import { Storable } from '@/types/Storable';
// import Filesystem from '@/__mocks__/@capacitor/Filesystem';
import ApiClient from '@/__mocks__/ApiClient';

jest.mock('FileSystem');

beforeEach(() => {
  const apiClient = new ApiClient();
  const mockLocalStore = new LocalStore<Storable>('storables');
  const mockWebStore = new WebStore<Storable>('/storable', apiClient);
});

describe('StoreHandler on native', () => {


  it('should save Item in both stores', () => {

  });
});
