import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  isMathLessonId,
  type MathLessonId,
} from '@features/math/domain/curriculum/types';
import {LearnNumbersScreen} from './LearnNumbersScreen';
import {MathLessonScreen} from './MathLessonScreen';
import type {MathStackParamList} from '@navigation/mathTypes';

type Props = NativeStackScreenProps<MathStackParamList, 'Lesson'>;

function resolveLessonId(raw: string): MathLessonId {
  const stripped = raw.replace(/^math\./, '');
  if (isMathLessonId(stripped)) {
    return stripped;
  }
  return 'numbers';
}

/** Routes numbers to the dedicated teach-first experience. */
export function MathLessonRouter(props: Props) {
  const lessonId = resolveLessonId(props.route.params.lessonId);
  if (lessonId === 'numbers') {
    return <LearnNumbersScreen {...props} />;
  }
  return <MathLessonScreen {...props} />;
}
