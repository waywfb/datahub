#!/bin/bash

# In case you have multiple user building on the same machine, you can run this two line to fix the permission issue we encountered.
# sudo chown $USER:$USER /tmp/datahub/logs/*-consumer-job.log
# sudo chown $USER:$USER /tmp/datahub/logs/datahub-upgrade/upgrade*

# expor this env variable to fix a build issue we encountered when building the web-frontend-react and the airflow-plugin
# export NODE_OPTIONS=--max_old_space_size=4096

./gradlew :metadata-io:compileTestJava

./gradlew build \
    -x :metadata-io:checkstyleTest \
    -x :metadata-ingestion:buildWheel \
    -x :metadata-io:test \
    -x :metadata-ingestion:testQuick \
    -x :datahub-web-react:yarnTest \
    -x yarnLint \
    -x :metadata-ingestion:lint
