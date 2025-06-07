import React, { forwardRef } from 'react';
import { NumericFormat } from 'react-number-format';

const InputCurrency = React.memo(({ name, label, value, onChange }) => {
  return (
    <div className="form-input">
      <label className="title-add" htmlFor={name}>{label}</label>
      <NumericFormat
        id={name}
        name={name}
        thousandSeparator="."
        decimalSeparator=","
        prefix="Rp. "
        allowNegative={false}
        value={value}
        onValueChange={(values) => {
          onChange(name, values.value);
        }}
        customInput={forwardRef((props, ref) => (
          <input {...props} ref={ref} />
        ))}
        required
      />
    </div>
  );
});

export default InputCurrency;