# Akka Serverless - eCommerce Example App

A JavaScript-based eCommerce example app for [Akka Serverless](https://developer.lightbend.com/docs/akka-serverless/)

Features include:

* Different eventsourced services for `warehouse`, `orders`, and `users`

## What is this example?

To help you get started with Akka Serverless, we've built some example apps that showcase the capabilities of the platform. This example application mimics a company that uses Akka Serverless as the backend to their eCommerce platform, keeping track of users, orders, and inventory.

## Prerequisites

To build and deploy this example application, you'll need to have:

* An [Akka Serverless account](https://docs.cloudstate.com/getting-started/lightbend-account.html)
* Node.js v12 or higher installed
* The Docker CLI installed

## Build, Deploy, and Test

Currently, there are three services built to support this eCommerce example app:

* [Orders](./orders): This service keeps track of the order history of users
* [Users](./users): This service keeps track of all users and has a collection of **orderIDs** to get order details from the orders service
* [Warehouse](./warehouse): This service keeps track of all the inventory

### Build your containers

To build your own containers, execute the below commands:

```bash
## Set your dockerhub username
export DOCKER_REGISTRY=docker.io
export DOCKER_USER=<your dockerhub username>

## Build containers for each of the services
BASE_DIR=`pwd`
for i in orders users warehouse; do
  cd $BASE_DIR/$i
  docker build . -t $DOCKER_REGISTRY/$DOCKER_USER/$i:1.0.0
done
```

### Deploy your container

To deploy the containers as a service in Akka Serverless, you'll need to:

```bash
## Set your dockerhub username
export DOCKER_REGISTRY=docker.io
export DOCKER_USER=<your dockerhub username>

## Push the containers to a container registry
for i in orders users warehouse; do
  docker push $DOCKER_REGISTRY/$DOCKER_USER/$i:1.0.0
done

## Set your Akka Serverless project name
export AKKASLS_PROJECT=<your project>

## Deploy the services to your Akka Serverless project
for i in orders users warehouse; do
  akkasls svc deploy $i $DOCKER_REGISTRY/$DOCKER_USER/$i:1.0.0 --project $AKKASLS_PROJECT
done
```

### Testing your service

To test your services, you'll first need to expose them on a public URL

```bash
## Set your Akka Serverless project name
export AKKASLS_PROJECT=<your project>

## Expose the services with a public HTTP endpoint
for i in orders users warehouse; do
  akkasls svc expose $i --enable-cors --project $AKKASLS_PROJECT
done
```

From there, you can use the endpoints with the below cURL commands for each of the operations that the service exposes.

#### Warehouse

##### Receive Product

```bash
curl --request POST \
  --url https://<your Akka Serverless endpoint>/warehouse/5c61f497e5fdadefe84ff9b9 \
  --header 'Content-Type: application/json' \
  --data '{
    "id": "5c61f497e5fdadefe84ff9b9",
    "name": "Yoga Mat",
    "description": "Limited Edition Mat",
    "imageURL": "/static/images/yogamat_square.jpg",
    "price": 62.5,
    "stock": 5,
    "tags": [
        "mat"
    ]
}'
```

##### Get Product Details

```bash
curl --request GET \
  --url https://<your Akka Serverless endpoint>/warehouse/5c61f497e5fdadefe84ff9b9
```

##### Update Stock

```bash
curl --request POST \
  --url https://<your Akka Serverless endpoint>/warehouse/5c61f497e5fdadefe84ff9b9/stock \
  --header 'Content-Type: application/json' \
  --data '{
    "id": "5c61f497e5fdadefe84ff9b9",
    "stock": 10
}'
```

#### Users

##### New User

```bash
curl --request POST \
  --url https://<your Akka Serverless endpoint>/user/1 \
  --header 'Content-Type: application/json' \
  --data '{
	"id": "1",
	"name": "retgits",
	"emailAddress": "retgits@example.com",
	"orderID":[]
}'
```

##### Get User Details

```bash
curl --request GET \
  --url https://<your Akka Serverless endpoint>/user/1
```

##### Update User Orders

```bash
curl --request POST \
  --url https://<your Akka Serverless endpoint>/user/1/order \
  --header 'Content-Type: application/json' \
  --data '{
	"id": "1",
	"orderID": "1234"
}'
```

#### Orders

##### Add Order

```bash
curl --request POST \
  --url https://<your Akka Serverless endpoint>/order/1 \
  --header 'Content-Type: application/json' \
  --data '{
	"userID": "1", 
	"orderID": "4557", 
	"items":[
		{
			"productID": "turkey", 
		 	"quantity": 12, 
			"price": 10.4
		}
	]
}'
```

##### Get Order Details

```bash
curl --request GET \
  --url https://<your Akka Serverless endpoint>/order/1 \
  --header 'Content-Type: application/json' \
  --data '{
	"userID": "1",
	"orderID": "4557"
}'
```

##### Get All Orders

```bash
curl --request GET \
  --url https://<your Akka Serverless endpoint>/order/1/all
```

## Contributing

We welcome all contributions! [Pull requests](https://github.com/lightbend-labs/akkaserverless-ecommerce-javascript/pulls) are the preferred way to share your contributions. For major changes, please open [an issue](https://github.com/lightbend-labs/akkaserverless-ecommerce-javascript/issues) first to discuss what you would like to change.

## Support

This project is provided on an as-is basis and is not covered by the Lightbend Support policy.

## License

See the [LICENSE](./LICENSE).