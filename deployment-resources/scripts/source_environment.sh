# We don't use the shebang here for auto running as you should always run
# this script with `source` or `.` such as `source_environment.sh` or the
# environment variables won't carry over to your script

DIRECTORY=$(dirname ${BASH_SOURCE[0]})
# Taken from https://stackoverflow.com/a/20909045
export $(grep -v '^#' $DIRECTORY/../../.env | xargs)
