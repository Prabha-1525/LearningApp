import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {MathStackParamList} from '@navigation/mathTypes';

import {EquationLessonScreen} from './EquationLessonScreen';

type Props = NativeStackScreenProps<MathStackParamList, 'Lesson'>;

export function AdditionScreen(props: Props) {
  return <EquationLessonScreen {...props} mode="addition" />;
}

export function SubtractionScreen(props: Props) {
  return <EquationLessonScreen {...props} mode="subtraction" />;
}
