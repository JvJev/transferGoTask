I filled this document while working on tasks. I worked on tasks from top to botom mostly. Document t below reflects working on tasks chronologicaly. Also, i left all git commits if you are interested to see progress, not only end result.


----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

I added project files to Claude.ai for better context.

`1`
## I checked responsive design issue first. Instantly in browser developer tools I see that on smaller screens crypto cards are off the middle and appear on just part of the screen. I made few different mobile screen sizes screenshots. Suggested solution worked and it was simple CSS fix as i expected. Suggested solution works fine, is simple and does not require many changes in the code base, so I applied it.

    grid-template-columns: repeat(4, 250px); /* Rigid column width */
chenged into:
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
Responsive design issue resolved.




`2`
##   I opened and went back few times into crypto cards and encoutered issue. I coppied error from browser for AI and it noted that it is "429 rate limits" issue. Also, copied terminal window logs to double check if issue is realy rate limits  - AI confirmed it.

## This quite serious issue because API data is not displayed, user gets error messages and application itself is crashing. Solution I have in mind would be cashing API data or similar workaround to save last posible API data states in order to send less API requests. I chave checked with AI, it suggested 3 solutions:

Option 1: Client-Side Data Fetching with SWR/React Query (Recommended)

Option 2: Server-Side Caching with Redis/Database (Production Ready)

Option 3: Hybrid Approach with Fallback Data

## I deep dived into solution 2 (cashing), tried suggested implementation but it didn't work because project does not have backend side. I found this by googling and asking questions with claude. I could create simple backend for the project and make redis work, but that would be an overkill for such project. Also, since I need this task only to run localy I decided to do a workaround (which i did while developing vehicles auction crawler, so I know it would work). I create local json file with API data that is updated every 60 seconds by an API call. Project's main page and id page will be taking API data from json file localy instead of making too many API calls, sending too many requests and crashing the app. Such workaround is chosen because app is runing localy without database or backend. In this case I need to create 1 simple node file, launch 1 extra command on other terminal and rate limit issue while working localy is resolved.

Process: With claude AI I created code files. Goal was to make working solution without overengineering it and make as little as posible changes in existing code files. To get to to satisfying solution took me a while because AI "halucinated" with unrequested code changes and I had an issue with 'fs' (file system) implementation that I noticed later. In final version I added 2 files: updateCoins.js for fetching every 60 seconds and dataUtils.js to get and use API data from file in the project instead of fetching everytime.

BONUS: while solving the issue I noticed that it made few changes related to other task ('* **Logical Bug:** The search bar on the main page is case-sensitive. Please correct it to search regardless of the case of the input text.'). I compared code before and after changes and honestly my solution would have been to implement toLowerCase function to search field anyway so I was satisfied with this AI fix. So 2 rabbits with 1 shot.
NOTE: Tasks list was not given for AI in the projects context. I feel that this task is more about though process and engaging with AI rather than plain solution.

`3` second day
## updated AI project context with ne code

## Gave AI task * **Data Formatting Bug:** On the details page, the price and market cap are displayed as raw, unreadable numbers. Please format them to be user-friendly (e.g., add thousand separators and a currency symbol).

## AI given sulution worked but lacked decimals for some cryptos. I reworked code to show 8 decimal digits (cents), because by default there was only 2 but some curencies like cardano or dodge has price with many numbers after , . With AI I reworked functions to show price after decimals only if it is given in API data. Example: Etherium price is 4294.16 USD in API, so in crypto card it will be displayed 4294.16 not 4294.16000000 USD to avoid redundant zeros, but if price needs to be accurate with decimals it is displayed in crypto cards. This functionality extends up to 8 decimal numbers maximum (maximum decimal numbers given by API).

After being satisfied with functionality I ordered AI to refactor functions (shorten/ improve). End result formatCurrency, formatLargeNumber, formatPercentage functions in [id].js file. No other application functionality is affected


`4`
## Next is * **Sorting:** Add the ability to **sort the list of cryptocurrencies** on the main page. The user should be able to sort the list by **name** (alphabetically A-Z) and by **price** (ascending and descending). I suspected this to be quite simple implementation, asked AI different implementation options. In one of the options it mentioned that sorting would be limited to price and sort alphabeticaly. I double checked API data and see that it gives much more that curent baisc implementation in the main page. I recreated main page cryptos data displayed and moved from crypto cards aproach to list approach (less visualy overwhelming). At the same time implemented sorting. In AI generated code i found similar formating functions. Since I already have this this functionality in [id].js page I moved the code to formatUtils.js file and reused functions in id and index pages. I planed to do it anyway later on. Furthermore, with new data from API added to main page i reworked styles as well with AI. CSS styles were good enough for now so i just pasted them. Usualy I work with design and styling at the end after application functionaly satisfies me, so will get back to improvement later.


`5` third day
## Task * **Loading State:** The application doesn't show any feedback to the user while data is being fetched. Implement a simple loading indicator (e.g., a "Loading..." message or a spinner) that displays while the initial list of coins is loading. Now reading this task again I see that I tried to tackle this problem previously from different angle in task `2`. I figured out that there should be different solution. In google I found in-memory chahing solution that I didn't know before, it seemed that it is exactly what i need and I could replace my previous solution. AI confirmed it. With claude I build code files, after some iterations it worked and even better than I expected. Speed was almost the same as previous solution but most improtantly it does not require to launch extra node command (user experience!). Since I am not familiar with this solution and how it works I spent extra time AI asking questions and getting familiar with the code. This solves data not being showed to the user issue and loading state compoment necesity. However, sometimes cache population takes some time so I added loading component as well.

Current solution: 
No memory leaks because it rewrites cache.
Timestamp file to check when API was last fetched. Even works after npm run dev command restarts.
If cache is older than 60 seconds API calls fetch to reniew info, if not - fetches cions data from cache.
If website is running but not used (AFK as example), when API calls are not made (avoin unneccesary calls). But after user requires fresh data API call is made because cache data becomes stale and fresh data is served.

`6`
**Component Refactoring:** The coin card on the main page is currently part of the `index.js` file. Refactor it by creating a separate, reusable component (e.g., `components/CoinCard.js`) and import it into the main page.
* **Visual Polish:** The single coin page is currently very basic. Improve its design to make it more visually appealing and professional. Feel free to be creative with the layout, typography, and styling.
## Coincards were changed into coin rows approach to fit more API info. Component exported from index.js page and now is reusable. This was very straight forward task with AI, nothing to elaborate more on this.

## **Visual Polish:** I browsed some crypto pages for styling ideas. I decided to go with dark theme for id and index pages. First I made pages to display more info about coins, because API is much richer that initialy was displayed on pages. In main page coin cards changed to into list view because in major similar sites this is the way to go, plus it is more efficient way to display coins, much more are visible on the screen and require less scroling. However, on mobile screens view changes into cards view, because screen becomes too small. I made screenshots for AI with examples and result was achieved. I needed to remake first table approach, but fixed it quite quicly with AI and clear instructions.

## In individual coins page I keep styling. Display as much info about coin as posible in the dedicated page. Here I had an issue from previous saved json file solution. I took transformed not raw API data from cache. For some time I stugled to create page layout and data was not displayed, but after I updated project context AI pointed out data transformation as one of the possible causes. I checked and found that dataUtils.js file indeed I tried to display transformed data and I simply overlooked it. After this issue resolved I finished page, styles and adopted same dark theme.

## I added simple next.js layout footer. I seen this next.js feature in Udemy course I took.

`7`

## Favorites page added as extra mile implementation. I implemented favorites page because I had some experience with similar functionalities before. Also, it alows to show how state can be stored in local storage and being saved after page refresh. Since, I had experience with such functionality it did not took me long to create page with AI. I gave clear instructions and had working code without many issues. Press star to add/remove from favorites.

