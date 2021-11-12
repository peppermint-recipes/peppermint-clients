/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import LocalStore from '@/Stores/LocalStore';
import WebStore from '@/Stores/WebStore';
import { Storable } from '@/types/Storable';

export default class StoreHandler<Type extends Storable> {
  private localStore: LocalStore<Type>;

  private webStore: WebStore<Type>;

  private items: Type[];

  private plattformIsMobile: boolean

  constructor(options: {
    localStore: LocalStore<Type>,
    webStore: WebStore<Type>,
    plattformIsMobile: boolean
  }) {
    this.localStore = options.localStore;
    this.webStore = options.webStore;
    this.items = [];
    this.plattformIsMobile = options.plattformIsMobile;
  }

  async add(item: Type) {
    item.userId = process.env.VUE_APP_USER_ID;
    let itemFromServer;
    try {
      const itemCopy = { ...item };
      itemCopy.id = '';
      itemFromServer = await this.webStore.saveOne(itemCopy);
      this.items.push(itemFromServer);
    } catch (error) {
      console.log(error);
    }

    if (this.plattformIsMobile) {
      if (!itemFromServer) {
        this.items.push(item);
      }
      await this.localStore.persist(this.items);
    }
  }

  public getAll(): Type[] {
    const notDeletedItems: Type[] = [];
    this.items.forEach((item) => {
      if (!item.isDeleted) {
        notDeletedItems.push(item);
      }
    });

    return notDeletedItems;
  }

  public async update(id: string, item: Type) {
    item.userId = process.env.VUE_APP_USER_ID;
    let updatedItemFromServer;
    try {
      updatedItemFromServer = await this.webStore.updateOne(id, item);
      this.items.push(updatedItemFromServer);
    } catch (error) {
      console.log(error);
    }

    if (this.plattformIsMobile) {
      if (!updatedItemFromServer) {
        this.items.push(item);
      }
      await this.localStore.persist(this.items);
    }
  }

  public getById(id: string): Type | undefined {
    return this.items.find((item) => item.id === id);
  }

  public async delete(id: string) {
    let itemToDelete = this.items.find((item) => item.id === id);

    if (!itemToDelete) {
      return;
    }

    itemToDelete.isDeleted = true;

    try {
      itemToDelete = await this.webStore.delete(id);
    } catch (error) {
      console.log(error);
    }

    this.items.push(itemToDelete);

    if (this.plattformIsMobile) {
      this.localStore.persist(this.items);
    }
  }

  public async sync() {
    if (!this.plattformIsMobile) {
      this.items = await this.webStore.get();
      return;
    }

    const webRecipesAsArray = await this.webStore.get();
    const localRecipesAsArray = await this.localStore.read();

    const webRecipes = new Map();
    webRecipesAsArray.forEach((recipe) => webRecipes.set(recipe.id, recipe));

    const localRecipes = new Map();
    localRecipesAsArray.forEach((recipe) => localRecipes.set(recipe.id, recipe));

    const {
      serverDifference,
      localDifference,
    } = this.getDifferences(webRecipes, localRecipes);

    const createdItems = await Promise.all(
      serverDifference.new.map((recipe) => this.webStore.saveOne(recipe)),
    );
    const updatedItems = await Promise.all(
      serverDifference.updated.map((recipe) => this.webStore.updateOne(recipe.id, recipe)),
    );

    const syncedItems = [] as Type[];

    syncedItems.push(
      ...createdItems,
      ...updatedItems,
      ...localDifference.new,
      ...localDifference.updated,
    );

    this.items = syncedItems;

    this.localStore.persist(this.items);
  }

  private getDifferences(serverRecipes: Map<string, Type>, localRecipes: Map<string, Type>) {
    const localRecipesCopy = new Map(localRecipes);
    type Differences = {
      new: Type[],
      updated: Type[],
    }

    const serverDifference: Differences = {
      new: [],
      updated: [],
    };

    const localDifference: Differences = {
      new: [],
      updated: [],
    };

    serverRecipes.forEach((serverRecipe) => {
      const localRecipe = localRecipesCopy.get(serverRecipe.id);

      if (!localRecipe) {
        localDifference.new.push(serverRecipe);
        return;
      }

      // check correct time checks
      if (localRecipe) {
        if (serverRecipe.lastUpdated > localRecipe.lastUpdated) {
          localDifference.updated.push(serverRecipe);
        } else if (serverRecipe.lastUpdated < localRecipe.lastUpdated) {
          serverDifference.updated.push(localRecipe);
        }
        localRecipesCopy.delete(localRecipe.id);
      }
    });

    const array = Array.from(localRecipesCopy.values());
    serverDifference.new.push(...array);

    return {
      serverDifference,
      localDifference,
    };
  }
}
