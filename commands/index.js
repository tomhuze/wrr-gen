import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Text } from 'ink';
import fs from 'fs';

const Generate = ({ name }) => {
  const componentTemplate = `import React, { useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './Template.scss';

const cx = classnames.bind(styles);
/**
 * Template description
 */
function Template({ classNames, children, ...props }) {
  const templateClasses = cx({
    'template': true,
    ...classNames
  });
  return (
    <div className={templateClasses} {...props}>
      {children}
    </div>
  );
}

Template.propTypes = {};

Template.defaultProps = {};

export default Template;
`;
  const scssTemplate = `.template {
  margin: 0;
  padding: 0;
}`;
  const [output, setOutput] = useState([]);
  useEffect(() => {
    const replaceUpperComponent = componentTemplate.replace(/Template/g, name);

    const replaceUpperStyle = scssTemplate.replace(/Template/g, name);
    const lower = name.toLowerCase();
    const component = replaceUpperComponent.replace(/template/g, lower);

    const style = replaceUpperStyle.replace(/template/g, lower);
    fs.mkdir(name, err => {
      setOutput([`Created ${name} Directory`]);
      fs.writeFile(name + '/index.js', component, err => {
        setOutput(output => [...output, `Created index.js component`]);
      });
      fs.writeFile(name + '/' + name + '.scss', style, err => {
        setOutput(output => [...output, `Created ${name}.scss file`]);
      });
    });
  }, []);
  return (
    <>
      {output.map((text, i) => (
        <Text key={i}>{text}</Text>
      ))}
    </>
  );
};

Generate.propTypes = {
  name: PropTypes.string.isRequired
};

export default Generate;
