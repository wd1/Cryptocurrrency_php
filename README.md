Demo Application: https://stark-island-54204.herokuapp.com/index.html

This is a simple tool which allows users to select different exchanges and crypto-assets, and then get price, order book information, and other data about the crypto asset.
Furthermore, users can perform fake trades in the markets, as well as real trades on exchanges.


Structure

This is written in Javascript (jQuery) and PHP for simplicity purposes.

Front-end

The front-end logic is mostly handled by custom.js

This is an event-driven application. On trigger of given events, functions are called, usually making async AJAX calls and rending the data to appropriate fields.
All functions are named specifically after what they do, so reading the function names should always tell you what the purpose of a function is.

userAuth function authenicates users.

Guest users are created accounts when anyone accesses the application. They can perform trades as guests, and when they leave and re-enter the page, their trades and portfolio balances are there. If they sign-up, their trades are added to their updated account. Authentication is handled by a localStorage variable which is the oauth varibale. 



Back-end

All back-end functionality can be found in the cloud/api/beta folders

The cloud/api/beta/libs folder contains libraries for connecting with the database and performing functions that are commmonly used


There is simple protocol for naming of files.

bitfinex.php and poloniex.php return candlestick data for a given currency, given the period. All exchanges will be simply named "exchangeName".php for this data
orderbitfinex or orderpoloniex.pgp return the orderbook data for a given currency in a given period. All exchanges order book info should follow this convention.

There are simple login.php, logout.php and register.php files which authenitcate/unauthenticate users

Also, there are functions for performing fake trades as well as real trades. 



TODOS:

The dashboard should feel something like this: http://coderthemes.com/adminto/dark/index.html

There should be 3 options at the top at all times, that says "Analyze" (This is where you start), "Mock Portfolio" (Where you can see your mock portolfio and trade), and "Portfolio" where you can see your real holdings

Currently there are 3 exchanges active. We want to add the top 20.

For each exchange, we should record every currency available for that exchange and allow users to select from them. (Change exchanges, currencies dropdown sleection changes)

Users should be able to search for currencies and exchanges, and dropdowns (predictive text should appear instead of the simple dropdown)

The popular indicators for a chart should be present under volume. For example: STOCHRSI, etc.

For every exchange, you should be able to see your different wallet balances, transfer funds to external wallets, make trades, view your oders, recent trades, etc.

A view for viewing all your recent mock trades

A method for searching for other users by email and adding them to your "follow list", so you can view their portfolio (mock and real)

The ability to make your mock or real portfolio data private

In a "view My Portfolo" View, you can see your portfolio daily, weekly, monthly, YTD, and beginning of time gains/losses for mock or real portfolio, and share a snap shot of this data with friends as image with sperate link on social media: FB, Twitter, LinkedIn

Login with Facebook or LinkedIn

Simple messaging inside the app which allows traders to communicate with one another, and there should be an email notifcation containing the message to the recieving user, and it should also appear as n update in their navigation bar

hen trades clear while you were not there, nitifcations should be added in your notifcation (bell bar), informing you of a sell order completing or what not, for both real and mock trades

Charts need to update regularly, most recommended through web sockets (AKA real time)

A Correlation Matrix should be added for different cryptocurrencies, based on variety of popular indexes. This comes last AND WE ARE WORKING INTERNALLY  on this so maybe don't need.

Users should be able to save their encrypted authenitcation tokens locally for making real trades. They will not be saved on the server. They are sent in post requests for executing traded and getting data

The whole thing needs to be put inside of a nice dashboard template, and should look similar to trading view.

There should be a side bar with popular stock, index, commodity, crypto prices (Top 10, similar to Tradingview)

There should be a recent news feed for any currency pair you select

A view "Mock Portfolio" and "Portfolio" lightboxes/buttons that expand out from clicking on your protfolio info, and basic information should always be present, especially above where you are placing orders. You should be able to see your balance

Futher documentation in the PHP and Javascript, discribing functionality for easier maintenance in the future


