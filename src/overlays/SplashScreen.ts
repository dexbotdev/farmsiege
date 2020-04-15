import { Template, TransformationConfig } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import PropsContext from '../../lib/PropsContext';
import Rectangle, { RectangleProps } from '../../lib/components/native/Rectangle';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';
import Text, { TextProps } from '../../lib/components/native/Text';

import Logo, { LogoProps } from '../components/Logo';

export type SplashScreenProps = {
  finishedCallback: () => void;
};

export default class SplashScreen extends Component<SplashScreenProps> {
  private readonly totalDuration = 3000;
  private timer = 0;
  private callbackExecuted = false;

  protected onTick(ctx: PropsContext<SplashScreenProps>, timeDifference: number): void {
    this.timer += timeDifference;
    if (this.timer >= this.totalDuration && !this.callbackExecuted) {
      ctx.props.finishedCallback();
      this.callbackExecuted = true;
    }
  }

  private get logoProgress(): number {
    return Math.min(1.5, this.timer / 500);
  }

  private get opacity(): number {
    if (this.timer < 2000) {
      return 1;
    }
    return Math.max(0, (3000 - this.timer) / 1000);
  }

  protected template: Template = [
    {
      component: new Rectangle(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): RectangleProps => ({
        width: 1600,
        height: 1200,
        color: `rgba(255, 255, 255, ${this.opacity})`
      })
    },
    {
      component: new Logo(),
      position: (): Coordinates => new Coordinates(444, 150),
      props: (): LogoProps => ({
        progress: this.logoProgress
      }),
      transform: (): TransformationConfig => ({
        opacity: {
          value: this.opacity
        }
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(600, 800 - 30),
      props: (): SpriteProps => ({
        source: 'https://www.gravatar.com/avatar/70f77192f7f326cfd0d8c9f22e52af7d?d=404&r=g&s=64',
        width: 64,
        height: 64
      }),
      transform: (): TransformationConfig => ({
        opacity: {
          value: this.opacity
        },
        clip: {
          circle: {
            center: new Coordinates(32, 32),
            radius: 32
          }
        }
      }),
      show: (): boolean => this.logoProgress >= 1.5
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(1000, 800),
      props: (): TextProps => ({
        text: 'Felix Wotschofsky',
        align: 'end',
        baseline: 'middle',
        color: `rgba(0, 0, 0, ${this.opacity})`,
        font: 'Heartbit',
        size: 64
      }),
      show: (): boolean => this.logoProgress >= 1.5
    }
  ];
}
