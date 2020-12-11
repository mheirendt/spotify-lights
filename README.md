# Spotlights

## Development
1. Create an app on the [Spotify Developer's Dashboard](https://developer.spotify.com/)
   - Be sure to specify a callback URL that matches the URL in the Express.js server and PORT in the env file e.g. http://localhost:4000/auth
2. Create a file called .env in the root directory and add the following entries:
    ```
    SPOTIFY_CLIENT_ID=<your-app-client-id>
    SPOTIFY_CLIENT_SECRET=<your-app-client-secret>
    VUE_APP_HOST=localhost
    PORT=4000
    ```
3. Open the terminal and run the following commands:
    ```bash
    # Install the project's dependencies
    npm i

    # Start the development web server
    npm run serve
    ```
4. Open another terminal and start the Express.js web server
    ```bash
    node server.js
    ```
5. Navigate to http://localhost:8081
