# download lokalise files
lokalise2 --token 04f13e066a509f278e4cda8546f3fba41fbb20ec --project-id  4090863062a2c441468bc5.70405954  file download --format json
# create tmp folder
mkdir -p /tmp/tmp
# move files to tmp folder
mv */* /tmp/tmp/
# delete jp.json
rm -rf /tmp/tmp/jp.json
# delete empty dir
rm -rf ./*.json
# move files to current dir
mv /tmp/tmp/* ../src/locale/
# delete tmp
rm -rf /tmp/tmp