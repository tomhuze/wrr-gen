import chalk from 'chalk';
import fs from 'fs';
import program from 'commander';
import { prompt } from 'enquirer';

const componentTemplate = `import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames/bind';
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
  classNames: PropTypes.string
};
Template.defaultProps = {};
export default Template;
`;

const scssTemplate = `.template {
  margin: 0;
  padding: 0;
}`;

async function onSubmit(name, response) {
  const replaceUpperComponent = componentTemplate.replace(
    /Template/g,
    response
  );
  const replaceUpperStyle = scssTemplate.replace(/Template/g, response);
  const lower = response.toLowerCase();
  const component = replaceUpperComponent.replace(/template/g, lower);
  const style = replaceUpperStyle.replace(/template/g, lower);
  fs.mkdir(response, err => {
    if (err) throw new Error(err.message);
    console.log(
      '  ' + chalk.green('✓') + ` Created ${chalk.bold(response)} Directory`
    );
    fs.writeFile(response + '/index.js', component, err => {
      if (err) throw new Error(err.message);
      console.log(
        '  ' +
          chalk.green('✓') +
          ` Created ${chalk.bold('index.js')} component in ${chalk.bold(
            response
          )} Directory`
      );
    });

    fs.writeFile(response + '/' + response + '.scss', style, err => {
      if (err) throw new Error(err.message);
      console.log(
        '  ' +
          chalk.green('✓') +
          ` Created ${chalk.bold(response + '.scss')} file in ${chalk.bold(
            response
          )} Directory`
      );
    });
  });
}
async function onCancel(prompt) {
  console.log('Exiting without creating anything...');
  process.exit(1);
}

function validateName(value) {
  return !value.match(/([A-Z])\w+/g)
    ? `Component names should start with a capital letter and have only alphabetical characters.`
    : true;
}

function showPrompt() {
  const question = {
    type: 'input',
    name: 'value',
    message: 'What is your Component’s name?',
    validate: validateName,
    onCancel
  };
  prompt(question)
    .then(answer => onSubmit('name', answer.value))
    .catch(console.error);
}

export async function cli() {
  program
    .version('1.0.8')
    .description(
      'Generates React component folder, component file and scss file.\nExecute without a name argument to use interactive prompt'
    )
    .arguments('[name]')
    .action(function(name) {
      if (name) {
        if (validateName(name) === true) {
          onSubmit('name', name);
        } else {
          console.log(chalk.magenta(validateName(name)));
          process.exit(1);
        }
      } else showPrompt();
    })
    .parse(process.argv);
}
