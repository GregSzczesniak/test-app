import { ComponentPropsWithoutRef, ElementType } from 'react';

type ExtendedProps<Props, OverrideProps> = OverrideProps & Omit<Props, keyof OverrideProps>; // We used Omit to exclude prop type conflicts

type ComponentProp<C> = {
  type?: C;
};

type PolymorphicComponentProps<C extends ElementType, Props> = ExtendedProps<
  ComponentPropsWithoutRef<C>,
  Props & ComponentProp<C>
>;

/** Example usage:
 *
 *      interface ButtonProps {
 *         text: string;
 *      }
 *
 *      const defaultElement = 'button';
 *
 *      const Button = <C extends ElementType = typeof defaultElement>({
 *         type,
 *      }: Polymorphic<C, ButtonProps>) => {
 *      const Component = type ?? defaultElement;
 *
 *         return <Component></Component>;
 *      };
 */
export type Polymorphic<C extends ElementType, Props = {}> = PolymorphicComponentProps<C, Props>;
