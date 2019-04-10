# Set build variables
export HS_BUILD_DATE=`date`
export HS_BUILD_NUMBER=127
export HS_GIT_HASH=`git rev-parse --short HEAD`
export HS_APP_VERSION=`cat package.json | egrep -o '"version"\: "([^\"]+)' | sed -e 's/"version": "//'`
export HS_GA_CODE="UA-115355516-1"

# Build and upload to remote
npm run build && \
rsync -avr ./dist/ root@hbrscnr.club:/var/www/habrascanner/
