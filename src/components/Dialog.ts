import Component from '../../lib/Component'
import { Template } from '../../lib/Types'
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite'
import Coordinates from '../../lib/helpers/Coordinates'

import spriteCornerTopLeft from '../assets/ui/dialog/corner_top_left.png'
import spriteCornerTopRight from '../assets/ui/dialog/corner_top_right.png'
import spriteCornerBottomLeft from '../assets/ui/dialog/corner_bottom_left.png'
import spriteCornerBottomRight from '../assets/ui/dialog/corner_bottom_right.png'
import spriteTop from '../assets/ui/dialog/top.png'
import spriteBottom from '../assets/ui/dialog/bottom.png'
import spriteLeft from '../assets/ui/dialog/left.png'
import spriteRight from '../assets/ui/dialog/right.png'
import spriteBackground from '../assets/ui/dialog/background.png'
import PropsContext from '../../lib/PropsContext'


export type DialogProps = {
   width: number
   height: number
}

export default class Dialog extends Component<DialogProps> {
   template: Template = [
      {
         component: new Sprite(),
         position: (ctx: PropsContext<DialogProps>): Coordinates => new Coordinates(
            0,
            0,
         ),
         props: (ctx: PropsContext<DialogProps>): SpriteProps => ({
            source: spriteCornerTopLeft,
            width: 16,
            height: 16,
         })
      },
      {
         component: new Sprite(),
         position: (ctx: PropsContext<DialogProps>): Coordinates => new Coordinates(
            16,
            0,
         ),
         props: (ctx: PropsContext<DialogProps>): SpriteProps => ({
            source: spriteTop,
            width: ctx.props.width - 32,
            height: 16,
         })
      },
      {
         component: new Sprite(),
         position: (ctx: PropsContext<DialogProps>): Coordinates => new Coordinates(
            ctx.props.width - 16,
            0,
         ),
         props: (ctx: PropsContext<DialogProps>): SpriteProps => ({
            source: spriteCornerTopRight,
            width: 16,
            height: 16,
         })
      },
      {
         component: new Sprite(),
         position: (ctx: PropsContext<DialogProps>): Coordinates => new Coordinates(
            0,
            16,
         ),
         props: (ctx: PropsContext<DialogProps>): SpriteProps => ({
            source: spriteLeft,
            width: 16,
            height: ctx.props.height - 32,
         })
      },
      {
         component: new Sprite(),
         position: (ctx: PropsContext<DialogProps>): Coordinates => new Coordinates(
            ctx.props.width - 16,
            16,
         ),
         props: (ctx: PropsContext<DialogProps>): SpriteProps => ({
            source: spriteRight,
            width: 16,
            height: ctx.props.height - 32,
         })
      },
      {
         component: new Sprite(),
         position: (ctx: PropsContext<DialogProps>): Coordinates => new Coordinates(
            0,
            ctx.props.height - 16,
         ),
         props: (ctx: PropsContext<DialogProps>): SpriteProps => ({
            source: spriteCornerBottomLeft,
            width: 16,
            height: 16,
         })
      },
      {
         component: new Sprite(),
         position: (ctx: PropsContext<DialogProps>): Coordinates => new Coordinates(
            16,
            ctx.props.height - 16,
         ),
         props: (ctx: PropsContext<DialogProps>): SpriteProps => ({
            source: spriteBottom,
            width: ctx.props.width - 32,
            height: 16,
         })
      },
      {
         component: new Sprite(),
         position: (ctx: PropsContext<DialogProps>): Coordinates => new Coordinates(
            ctx.props.width - 16,
            ctx.props.height - 16,
         ),
         props: (ctx: PropsContext<DialogProps>): SpriteProps => ({
            source: spriteCornerBottomRight,
            width: 16,
            height: 16,
         })
      },
      {
         component: new Sprite(),
         position: (ctx: PropsContext<DialogProps>): Coordinates => new Coordinates(
            16,
            16,
         ),
         props: (ctx: PropsContext<DialogProps>): SpriteProps => ({
            source: spriteBackground,
            width: ctx.props.width - 32,
            height: ctx.props.height - 32,
         })
      },
   ]
}
