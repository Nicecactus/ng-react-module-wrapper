set -e

yarn lint
yarn test:headless

cd projects/nicecactus/ng-react-module-wrapper
yarn version
cd -

yarn build:prod

cd dist/nicecactus/ng-react-module-wrapper
yarn publish --access public --new-version `node -p -e "require('./package.json').version"`
cd -
