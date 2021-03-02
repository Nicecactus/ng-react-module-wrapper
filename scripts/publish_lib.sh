set -e

yarn lint
yarn test:headless
if [[ -v "${1}" ]]; then
    yarn version
else
    yarn version --new-version $1
fi

yarn build:prod

cd dist/nicecactus/ng-react-module-wrapper
yarn publish --access public --new-version `node -p -e "require('./package.json').version"`
cd -
