import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import PropsContext from '../../lib/PropsContext';
import Rabbit, { RabbitProps } from '../components/animals/Rabbit';
import Repeating, { RepeatingProps } from '../../lib/components/logical/Repeating';
import MovablesStore from '../store/MovablesStore';
import CharacterStore from '../store/CharacterStore';
import GridStore from '../store/GridStore';
import GridUtils from '../utils/Grid';
import EffectsStore from '../store/EffectsStore';
import StatsStore from '../store/StatsStore';
import TileContents from '../TileContents';
import { Directions } from '../../lib/Enums';

import values from '../values.json';
import RabbitData from '../store/models/RabbitData';

export type RabbitsProps = {};

export default class Rabbits extends Component<RabbitsProps> {
  protected onTick(ctx: PropsContext<RabbitsProps>, timeDifference: number): void {
    const characterStore = this.stores.character as CharacterStore;
    const effectsStore = this.stores.effects as EffectsStore;
    const gridStore = this.stores.grid as GridStore;
    const movablesStore = this.stores.movables as MovablesStore;
    const statsStore = this.stores.score as StatsStore;

    movablesStore.setRabbitTargets((row: number, direction: Directions, currentColumn: number): number => {
      // console.log(currentColumn)
      let offset = Math.max(0, Math.round(currentColumn));
      if (direction === Directions.Left) {
        offset = Math.max(0, 8 - offset);
      }

      // x-y-Raster in Array mit bestimmeter Reihe umwandeln
      let contentRow = gridStore.content.map(column => {
        return column[row];
      });

      // Bei Bedarf Startpunkt ändern
      if (direction === Directions.Right) {
        contentRow = contentRow.slice(offset);
      } else {
        contentRow = contentRow.reverse().slice(offset);
      }

      let computedTarget = direction === Directions.Right ? 12 : -4;

      for (const index in contentRow) {
        if (contentRow[index].type === TileContents.Plant) {
          if (direction === Directions.Right) {
            computedTarget = parseInt(index) + offset;
          } else {
            computedTarget = 8 - parseInt(index) - offset;
          }
          break;
        }
      }

      return computedTarget;
    });

    movablesStore.updateRabbits(timeDifference);

    movablesStore.detectHit(characterStore.content.bullets, (x: number, y: number) => {
      const score = 10;
      effectsStore.showSmoke(x + 96, y + 256);
      effectsStore.showScoreEffect(x + 128, y + 320, score);
      statsStore.addScore(score);
    });

    movablesStore.directStillRabbits.forEach(rabbit => {
      if (rabbit.timeLeft === 0) {
        const coords = GridUtils.coordsToField(
          new Coordinates(rabbit.x - 288 + (rabbit.direction === Directions.Right ? 128 : 0), rabbit.y + 108)
        );
        gridStore.removePlant(coords.x, coords.y);
        rabbit.resetTimer();
      }
    });
  }

  protected template: Template = [
    {
      component: new Repeating(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): RepeatingProps => {
        const movablesStore = this.stores.movables as MovablesStore;

        return {
          list: movablesStore.content.rabbits,
          component: (): Rabbit => new Rabbit(),
          position: (data: RabbitData): Coordinates => {
            return new Coordinates(data.x, data.y);
          },
          props: (data: RabbitData): RabbitProps => ({
            direction: data.direction,
            moving: data.x !== data.targetX
          })
        };
      }
    }
  ];
}
