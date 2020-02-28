import cloneDeep from 'clone-deep';
import Coordinates from '../../lib/helpers/Coordinates';
import Store from '../../lib/store/Store';

import TileContents from '../TileContents';
import Random from '../utils/Random';

import values from '../values.json';

type TileData = {
  type: TileContents;
  data: Record<string, any>;
};

type RowData = [TileData, TileData, TileData, TileData, TileData, TileData, TileData, TileData];

export type GridStoreContent = [RowData, RowData, RowData, RowData, RowData, RowData, RowData, RowData];

const initialTile: TileData = {
  type: TileContents.Empty,
  data: {}
};

const generateInitialGrid = (): GridStoreContent => {
  const grid: GridStoreContent = [];
  for (let i = 0; i < 8; i++) {
    const row: RowData = [];
    for (let j = 0; j < 8; j++) {
      const tile = cloneDeep(initialTile);
      row.push(tile);
    }
    grid.push(row);
  }

  let plantsPlaced = 0;
  do {
    const row = Math.floor(Math.random() * 8);
    const col = Math.floor(Math.random() * 8);

    if (grid[row][col].type === TileContents.Plant) {
      continue;
    }

    grid[row][col].type = TileContents.Plant;
    grid[row][col].data = {
      age: Math.random() * values.plant.age.maxStart
    };
    plantsPlaced++;
  } while (plantsPlaced < values.plant.startAmount);

  return grid;
};

export default class GridStore extends Store<GridStoreContent> {
  private timers: number[];
  private _speedMultiplier: number;

  public constructor() {
    const initialGrid = generateInitialGrid();
    super('grid', initialGrid);

    this.timers = [];
    this._speedMultiplier = 1;
  }

  public reset(): void {
    this.update(() => {
      const initialGrid = generateInitialGrid();
      return initialGrid;
    });
  }

  public set speedMultiplier(value: number) {
    this._speedMultiplier = value;
  }

  public start(): void {
    this.growPlants();

    {
      const timeout = setTimeout(() => {
        this.updateMole();
      }, Random.between(values.mole.grace.min, values.mole.grace.max));
      this.timers.push(timeout);
    }

    {
      const timeout = setTimeout(() => {
        this.updateWeed();
      }, Random.between(values.weed.grace.min, values.weed.grace.max));
      this.timers.push(timeout);
    }

    {
      const timeout = setTimeout(() => {
        this.updateLightning();
      }, Random.between(values.lightning.grace.min, values.lightning.grace.max));
      this.timers.push(timeout);
    }
  }

  public stop(): void {
    this.timers.forEach(timer => {
      clearTimeout(timer);
    });
  }

  public removeContent(x: number, y: number): void {
    if (!this.isValidField(x, y)) return;
    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        if (clonedState[x][y].type === TileContents.Lightning) return clonedState;

        clonedState[x][y].type = TileContents.Empty;
        return clonedState;
      }
    );
  }

  public removePlant(x: number, y: number): void {
    if (!this.isValidField(x, y)) return;
    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        if (clonedState[x][y].type !== TileContents.Plant) return clonedState;
        clonedState[x][y].type = TileContents.Empty;

        return clonedState;
      }
    );
  }

  public placePlant(x: number, y: number): void {
    if (!this.isValidField(x, y)) return;
    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        if (oldState[x][y].type !== TileContents.Empty) return oldState;

        const clonedState = cloneDeep(oldState);
        clonedState[x][y].type = TileContents.Plant;
        clonedState[x][y].data = {
          age: 0
        };
        return clonedState;
      }
    );
  }

  private growPlants(): void {
    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        clonedState.forEach(row => {
          row.forEach(tile => {
            if (tile.type === TileContents.Plant) {
              tile.data.age += 100;
            }
          });
        });

        return clonedState;
      }
    );

    const timeout = setTimeout(() => {
      this.growPlants();
    }, 100);
    this.timers.push(timeout);
  }

  private updateMole(): void {
    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        // Überprüfen, ob bereits ein Maulwurf im Spiel ist
        let moleActive = false;
        let molePosition = new Coordinates(0, 0);
        clonedState.forEach((row, rowIndex) => {
          row.forEach((tile, columnIndex) => {
            if (tile.type === TileContents.Mole) {
              moleActive = true;
              molePosition = new Coordinates(columnIndex, rowIndex);
            }
          });
        });

        if (!moleActive) {
          // Mit festgelegter Wahrscheinlichkeit Maulwurf an zufälliger Stelle erscheinen lassen
          if (Math.random() > values.mole.newChance) return oldState;

          const row = Math.floor(Math.random() * 8);
          const col = Math.floor(Math.random() * 8);

          clonedState[row][col].type = TileContents.Mole;
        } else {
          // Maulwurf verschieben und Hügel hinterlassen
          const row = Math.floor(Math.random() * 8);
          const col = Math.floor(Math.random() * 8);
          clonedState[row][col].type = TileContents.Mole;
          clonedState[molePosition.y][molePosition.x].type = TileContents.Molehill;
        }

        return clonedState;
      }
    );

    const timeout = setTimeout(() => {
      this.updateMole();
    }, Random.between(values.mole.spawning.min, values.mole.spawning.max) / this._speedMultiplier);
    this.timers.push(timeout);
  }

  private updateWeed(): void {
    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        const foundWeed: Coordinates[] = [];
        clonedState.forEach((row, rowIndex) => {
          row.forEach((tile, columnIndex) => {
            if (tile.type === TileContents.Weed) {
              foundWeed.push(new Coordinates(columnIndex, rowIndex));
            }
          });
        });

        if (Math.random() < values.weed.newChance) {
          const row = Math.floor(Math.random() * 8);
          const col = Math.floor(Math.random() * 8);
          clonedState[row][col].type = TileContents.Weed;
        }

        foundWeed.forEach(coords => {
          if (Math.random() > 1 / Math.sqrt(foundWeed.length)) return;

          const row = clonedState[coords.y + Math.round(Math.random() * 2) - 1];
          if (!row) return;
          const tile = row[coords.x + Math.round(Math.random() * 2) - 1];
          if (!tile || tile.type !== TileContents.Empty) return;
          tile.type = TileContents.Weed;
        });

        return clonedState;
      }
    );

    const timeout = setTimeout(() => {
      this.updateWeed();
    }, Random.between(values.weed.spawning.min, values.weed.spawning.max) / this._speedMultiplier);
    this.timers.push(timeout);
  }

  private updateLightning(): void {
    const randomRow = Math.floor(Math.random() * 8);
    const randomCol = Math.floor(Math.random() * 8);

    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        for (let rowIndex = -1; rowIndex <= 1; rowIndex++) {
          if (randomRow + rowIndex >= 0 && randomRow + rowIndex <= 7) {
            for (let colIndex = -1; colIndex <= 1; colIndex++) {
              if (randomCol + colIndex >= 0 && randomCol + colIndex <= 7) {
                clonedState[randomRow + rowIndex][randomCol + colIndex].type = TileContents.Empty;
              }
            }
          }
        }
        clonedState[randomRow][randomCol].type = TileContents.Lightning;

        return clonedState;
      }
    );

    const clearTimeout = setTimeout(() => {
      this.update(
        (oldState: GridStoreContent): GridStoreContent => {
          const clonedState = cloneDeep(oldState);
          clonedState[randomRow][randomCol].type = TileContents.Empty;
          return clonedState;
        }
      );
    }, 1400);
    this.timers.push(clearTimeout);

    const repeatTimeout = setTimeout(() => {
      this.updateLightning();
    }, Random.between(values.lightning.spawning.min, values.lightning.spawning.max) / this._speedMultiplier);
    this.timers.push(repeatTimeout);
  }

  public isValidField(x: number, y: number): boolean {
    if (x < 0) return false;
    if (x > 7) return false;
    if (y < 0) return false;
    if (y > 7) return false;
    return true;
  }

  // Gibt ein Array mit allen Feldern zurück
  private get allTiles(): TileData[] {
    let result: TileData[] = [];
    this.content.forEach(row => {
      result = result.concat(row);
    });
    return cloneDeep(result);
  }

  // Gibt die Anzahl der selbst platzierten Pflanzen an
  public get friendlyPlants(): number {
    let amount = 0;
    this.allTiles.forEach(tile => {
      if (tile.type === TileContents.Plant) {
        amount++;
      }
    });
    return amount;
  }
}
