import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  isMathLessonId,
  type MathLessonId,
} from '@features/math/domain/curriculum/types';
import {AdditionScreen, SubtractionScreen} from './AdditionScreen';
import {CountingScreen} from './CountingScreen';
import {LearnNumbersScreen} from './LearnNumbersScreen';
import {MathLessonScreen} from './MathLessonScreen';
import {MissingNumberScreen} from './MissingNumberScreen';
import type {MathStackParamList} from '@navigation/mathTypes';

type Props = NativeStackScreenProps<MathStackParamList, 'Lesson'>;

function resolveLessonId(raw: string): MathLessonId {
  const stripped = raw.replace(/^math\./, '');
  if (isMathLessonId(stripped)) {
    return stripped;
  }
  return 'numbers';
}

/** Routes specialty lessons to dedicated experiences. */
export function MathLessonRouter(props: Props) {
  const lessonId = resolveLessonId(props.route.params.lessonId);
  if (lessonId === 'numbers') {
    return <LearnNumbersScreen {...props} />;
  }
  if (lessonId === 'missing') {
    return <MissingNumberScreen {...props} />;
  }
  if (lessonId === 'counting') {
    return <CountingScreen {...props} />;
  }
  if (lessonId === 'addition') {
    return <AdditionScreen {...props} />;
  }
  if (lessonId === 'subtraction') {
    return <SubtractionScreen {...props} />;
  }
  return <MathLessonScreen {...props} />;
}
