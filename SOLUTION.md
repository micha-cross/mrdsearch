# Soultion outline

## API/Search Service

Basic express service with 2 routes:

- '/api/products': the main product search route as outlined by the task. Searches for products based on a set of filters and can also order the results by rating and price
- '/api/products/categories': second route I added to get a discrete list of product categories to populate the filter

Project structure:

Broke down the api app into the following basic structure:

- routes: contains the api routes for the app
- crud: the repo layer, which for this app just processed the static data but in a real app would be the database crud operations
- integrations: the buiness logic for similating the downstream service
- service: middle layer containing business logic and tying the repo and downstream integration together
- data: folder containing simualted data for the app and downstream service
- http: middleware

You'll note the text search and category filter happen at a crud/'db level' but the sorting happens in the service (business logic). This is because I wanted to make a sort by price and this comes from the enrichment data, not the 'db', so had to happen after the downstream call populates the data

For the downstream service I just simulated it using a method rather than adding a route or another service. The variable latency is simulated with a timeout and the error is simulated with a random number (probablity 10%)

You'll also not I added a shared ID across the product and downstream product data datasets so the downstream service can fetch data per ID rather than randomly gen the downstream data

I intepreted the task to mean the enrichment data had to be inserted at the API level so the downstream call for the enrichment data happens during the product search. I made sure to do it concurrently as seen in the processProductInfo method. Also failures don't effect the overall call but rather just don't add the enriched data to the product. I also considered skipping the the product if the enrichment data is missing but decided to leave it in and just handle it on the front end

The test cases cover product-service.ts (which is essentially the business logic of the app). I made the crud product repo and downstream enrichment data provider both interfaces so that the test case can inject a mocked version with dummy data for test cases

Other things to note: I added error handling middleware to express, a simple rate limiter and allowed origins check to protect the API


## Client App

Client application with single page. I added tailwind to assist with styling

I added a number of UI components to cover text input, displaying the products and the filtering controls

Note: for an application like this I would typically use a UI kit (I like source code component kits like shadcn that do not add a npm package that needs support and that you can freely modify) but I also often us a coding agent to build a basic component set  that I then modify to my requirements. This is exactly what I did here - I had my agent build the UI components, which I then reviewed and made some small tweeks to

This app is just a single route that has the search and filters section and then displays the list of results in a product card list.

The product search function triggers when the filters change (text search, category added, sort by changed). I added a debounce mechanism using setTimeout to protect this function as well as an abort controller

I have added a sort by rating (which is just a 'popular' toggle) and price which can be asc or desc. Category filter is multi-select

Some other things to note, I make an initial API call to retrieve all categories on mount and I have added a handler (writeSearchParams, readSearchParams) to sync the search state with the URL

Loading is shown with a spinner and errors are shown when applicable 
