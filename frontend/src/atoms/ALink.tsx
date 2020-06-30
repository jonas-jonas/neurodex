import * as React from 'react';
import classNames from 'classnames';
import { buttonBaseClasses, buttonColorClasses } from './utils';
import { LinkProps, Link } from 'react-router-dom';

type ALinkProps = {
  colorClasses?: string;
  additionalClasses?: string;
} & LinkProps;

const ALink: React.FC<ALinkProps> = ({ children, colorClasses, additionalClasses, ...rest }) => {
  const classes = classNames(buttonBaseClasses, colorClasses, additionalClasses, {
    [buttonColorClasses]: !colorClasses,
  });

  return (
    <Link className={classes} {...rest}>
      {children}
    </Link>
  );
};

export default ALink;
