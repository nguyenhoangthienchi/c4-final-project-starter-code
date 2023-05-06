set DOCKER_IMAGE_TAG=v2
docker-compose build
docker tag todo-app-client:%DOCKER_IMAGE_TAG% jayesd3v/todo-app-client:%DOCKER_IMAGE_TAG%
docker push jayesd3v/todo-app-client:%DOCKER_IMAGE_TAG%