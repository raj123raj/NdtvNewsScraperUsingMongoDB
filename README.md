# NdtvNewsScraperUsingMongoDB
Using Mongoose, Node JS, Cheerio, NDTV news website is scraped and data is loaded into Mongo DB database

This is a full-stack JavaScript app built using MongoDB, Mongoose, Node.js, Express.js, Handlebars.js, HTML, and CSS. It scrapes the  [NDTV](https://ndtv.com/) homepage and stores article titles and links

## Get new articles, save favorites, and write notes

To see updated news stories, click `Get new articles` at the top of the `Home` page. To view the full article, click the `View article on NDTV` link. 

When you see an article in the list that you want to mark as a favorite, click `Save article`, and read it again by clicking `Saved articles` in the top menu bar. After you have an article in your saved list, you can comment on it by clicking `Add note`.



_Note: There is no login system, so all saved articles and comments are visible to and can be deleted by all users._

## Local set up for development purposes

These must be installed to run the app locally: For any Node JS projects, this is the mandatory step

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/get-npm)
 
## IDE
Visual Studio Code is the best IDE to code Node JS and Mongoose related projects

## Important instructions
1. You first need to make a local MongoDB database named `ndtvnews`. 
2. Then, in a terminal window, navigate into the folder where you downloaded this app and type `npm install`. All the dependencies mentioned in package.json file will be installed and this is a mandatory step
3. To start the app, type `node server.js` and open your browser to `localhost:3000`.
4. In case if 3000 port is used by some other process in your system, feel free to change the port number in "server.js"

## Technology

- HTML, CSS, jQuery, Bootstrap, [Handlebars.js](https://handlebarsjs.com/)
- JavaScript
- Node.js
- MongoDB and [Mongoose](http://mongoosejs.com/)
- [Express.js](https://expressjs.com/)
- npm, including [express](https://www.npmjs.com/package/express) and [body-parser](https://www.npmjs.com/package/body-parser) packages.
- [cheerio](https://cheerio.js.org/) for scraping the website

