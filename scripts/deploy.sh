# Set build variables
export HS_BUILD_DATE=`date`
export HS_BUILD_NUMBER=127
export HS_GIT_HASH=`git rev-parse --short HEAD`
export HS_APP_VERSION=`cat package.json | egrep -o '"version"\: "([^\"]+)' | sed -e 's/"version": "//'`

# Build
npm run build

# Upload to remote
rsync -avr ./dist/ root@habrascanner.com:/var/www/habrascanner/
