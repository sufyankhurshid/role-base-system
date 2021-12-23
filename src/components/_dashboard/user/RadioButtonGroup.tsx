import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material';

export function RadioButtonGroup(props: any) {
  return (
    <div>
      <FormControl component="fieldset">
        <FormLabel component="legend">{props?.title ?? ''}</FormLabel>
        <RadioGroup aria-label={props?.title} name="controlled-radio-buttons-group" {...props}>
          {props.list.map((item: any) => {
            return (
              <FormControlLabel
                key={item.label}
                value={item.value}
                control={
                  props.ischeckbox ? <Checkbox {...props} checked={props.value} /> : <Radio />
                }
                label={item.label}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </div>
  );
}
