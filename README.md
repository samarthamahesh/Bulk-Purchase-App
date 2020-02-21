# Bulk Purchase App

**__Samartha S M__**

*2018101094*

## Introduction

There are times when one wants to buy an item, only to find that buying them in bulk would make it much cheaper as opposed to buying a single unit. The app will have an option for sellers to host their products along with the minimum bulk dispatch quantity. Various customers can select from the listed products and order them with their own required quantity. When enough orders are placed for the product and bulk quantity requirements are met, the vendor can dispatch the order.

## Technical Stack Used

* Frontend in **React.js**
* Backend using **Express.js** whixh implements a **REST** API
* Database in **MongoDB**

## How to Run the App

```
$ cd frontend
$ npm install
$ npm start
```

```
$ cd backend
$ npm install
$ npm start
```

## Features of App

* There will be two types of users - Vendors and Customers
* Registration and Login features for both types of users
* Use cases of Vendor
  * Can create a new product specifying the following
    * Name of the product
    * Price of the bundle
    * Quantity in the bundle
  * Will be able to view all the current product listing done by him/her in Waiting list.
    * There will be an option to take down a listing making sure that customers get their product status as cancelled.
    * Once the product is ready to dispatch (when it has been ordered by sufficient people), it is removed from this view and becomes ready to dispatch.
  * Will be able to separately view all the orders that are ready to dispatch
    * Has a button to dispatch the product which removes it from this view.
    * Has a button to cancel the product which removes it from this view.
  * All dispatched orders will be displayed in another view with the reviews and ratings of each order.
* Use cases of Customer
  * Will be able to search for the product he/she wants
    * All the vendors selling that product will be displayed along with their price and quantity remaining
    * Will be able to sort the search results either by price or quantity of items in bundle left or the rating of the seller
  * Will be able to select a product listed in the search results and place the order after specifying the quantity he/she desires
  * Will be able to separately view the status of all the products he/she has ordered and will contain
    * Its dispatch status
      * Waiting (If not enough orders have been placed meeting the minimum bulk quantity requirement by the seller)
      * Placed (If the quantity requirements are met but is yet to get dispatched by the seller in his/her portal)
      * Dispatched (If the seller accepts the order in his/her portal)
      * Cancelled (If the seller cancels the order in his/her portal)
    * In the case of Waiting State, the following also will to be displayed/implemented
      * Quantity left for the order to get placed
      * Option to edit the order if not in the dispatched state
    * Should be able to rate the vendor once the order is placed. Average rating of the vendor must be displayed in the search results
    * Should be able to give a product review along with a rating once the product has been dispatched. Clicking on a button in search results will display all reviews of products of that particular vendor.
* Good UI for better user experience