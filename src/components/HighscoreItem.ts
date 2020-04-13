import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import PropsContext from '../../lib/PropsContext';
import Text, { TextProps } from '../../lib/components/native/Text';

export type HighscoreItemProps = {
  position: number | string;
  name: string;
  score: number | string;
};

export default class HighscoreItem extends Component<HighscoreItemProps> {
  protected template: Template = [
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<HighscoreItemProps>): TextProps => {
        return {
          text: `#${ctx.props.position} ${ctx.props.name}: ${ctx.props.score}`,
          color: '#fff',
          font: 'Heartbit',
          size: 40
        };
      }
    }
  ];
}