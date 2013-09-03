#!/bin/bash
# Install node packages
echo "Note: this script should be run from wherever your package.json file exists"
npm install

echo "Please enter your github id:"
read GITHUB_USERNAME
echo "You entered: $GITHUB_USERNAME"

echo "Please enter your email (for github commits):"
read GITHUB_EMAIL
echo "You entered: $GITHUB_EMAIL"

git config --global user.name $GITHUB_USERNAME
git config --global user.email $GITHUB_EMAIL

# Login to Heroku, then create apps.
# See:
# https://devcenter.heroku.com/articles/keys
# https://devcenter.heroku/articles/multiple-environments
heroku login
heroku keys:add
heroku apps:create $GITHUB_USERNAME-s-pixelalchemies --remote staging-heroku
heroku apps:create $GITHUB_USERNAME-pixelalchemies --remote production-heroku
