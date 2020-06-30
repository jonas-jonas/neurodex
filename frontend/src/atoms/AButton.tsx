import * as React from 'react';
import classNames from 'classnames';
import { buttonBaseClasses, buttonColorClasses } from './utils';

type AButtonProps = {
  colorClasses?: string;
  additionalClasses?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const AButton: React.FC<AButtonProps> = ({ children, colorClasses, additionalClasses, ...rest }) => {
  const classes = classNames(buttonBaseClasses, colorClasses, additionalClasses, {
    [buttonColorClasses]: !colorClasses,
  });

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};

export default AButton;
