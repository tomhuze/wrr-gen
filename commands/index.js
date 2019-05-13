import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Text } from 'ink';
import fs from 'fs';

/// This command generates a folder, a component file and a scss file
const WrrGen = ({ name }) => {
  const componentTemplate = `import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import styles from './Template.scss';

const cx = classnames.bind(styles);
/**
 * Template description
 */
function Template({ classNames, children, ...props }) {
  const templateClasses = cx({
    template: true,
    [classNames]: true
  });
  return (
    <div className={templateClasses} {...props}>
      {children}
    </div>
  );
}
Template.propTypes = {
  /**
   * The content of the component
   */
  children: PropTypes.node,
  /**
   * css modules class(es) passed from parent
   */
  classNames: PropTypes.object
};
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

WrrGen.propTypes = {
  ///Component name - will be folder name, and used throughout component code
  name: PropTypes.string.isRequired
};

export default WrrGen;