import {NumberChoicePad, type NumberChoice} from '../objects/NumberChoicePad';

type CountingChoiceRowProps = {
  readonly choices: readonly NumberChoice[];
  readonly disabled?: boolean;
  readonly onPick: (id: string) => void;
};

/** Horizontal orange number pad — thin wrapper over shared NumberChoicePad. */
export function CountingChoiceRow({
  choices,
  disabled = false,
  onPick,
}: CountingChoiceRowProps) {
  return (
    <NumberChoicePad
      choices={choices}
      layout="row"
      disabled={disabled}
      onPick={onPick}
      testIDPrefix="count-choice"
    />
  );
}
