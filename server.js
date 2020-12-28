require("dotenv").config();

const express = require("express");
const request = require("request");
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const port = process.env.PORT;
const server_address = `${process.env.VUE_APP_HOST}:${port}`;
const redirect_uri = `http://${server_address}/auth`;

const scope = "user-read-private user-read-email user-read-playback-state user-modify-playback-state user-library-read";

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = "spotify_auth_state";

const app = express();

app.use(express.static(__dirname + "/public"))
    .use(cors())
    .use(cookieParser())
    .use(bodyParser.json());

app.get("/login", function (req, res) {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    res.redirect("https://accounts.spotify.com/authorize?" +
        querystring.stringify({
            response_type: "code",
            client_id,
            scope,
            redirect_uri,
            state: state
        }));
});

// Authentication callback
app.get("/auth", function (req, res) {

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect("http://localhost:8081/?" +
            querystring.stringify({
                error: "state_mismatch"
            }));
    } else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: "https://accounts.spotify.com/api/token",
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: "authorization_code"
            },
            headers: {
                "Authorization": "Basic " + (Buffer.from(client_id + ":" + client_secret).toString("base64"))
            },
            json: true
        };

        request.post(authOptions, function (error, response, { access_token, refresh_token }) {
            if (!error && response.statusCode === 200) {
                res.cookie('access_token', access_token);
                res.cookie('refresh_token', refresh_token);
                res.redirect("http://localhost:8081");
            } else {
                res.redirect("http://localhost:8081/login");
            }
        });
    }
});

app.post("/token/refresh", function (req, res) {

    // requesting access token from refresh token
    const { refresh_token } = req.body;
    if (!refresh_token) {
        res.status(400).send({ message: "Bad Request: No refresh token" });
        return;
    }
    const authOptions = {
        url: "https://accounts.spotify.com/api/token",
        headers: { "Authorization": "Basic " + (Buffer.from(client_id + ":" + client_secret).toString("base64")) },
        form: {
            grant_type: "refresh_token",
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const { access_token, refresh_token } = body;
            console.log('token refreshed');
            res.cookie('access_token', access_token);
            res.cookie('refresh_token', refresh_token);
            res.send({
                access_token,
                refresh_token
            });
        }
    });
});

// port on with your Vue app is running
app.listen(port, () => {
    console.log("listening on " + port);
});