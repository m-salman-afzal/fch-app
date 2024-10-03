module.exports = {
  '**/*.(ts|tsx)': () => 'tsc --skipLibCheck --noEmit --pretty',

  '**/*.(ts|tsx|js)': filenames => [
    `eslint ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')}`
  ],

  '**/*.(md|json)': filenames => `prettier --write ${filenames.join(' ')}`
};
