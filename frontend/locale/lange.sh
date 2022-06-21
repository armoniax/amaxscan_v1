# download lokalise files
lokalise2 --token 04f13e066a509f278e4cda8546f3fba41fbb20ec --project-id  980207176285de067d4774.55774828  file download --format json
# create tmp folder
mkdir -p ./tmp
# move files to tmp folder
mv */* ./tmp/
# delete empty dir
rm -rf ./*.json
# move files to current dir
mv ./tmp/* ../src/lang/
# delete all empty dir
rmdir ./*