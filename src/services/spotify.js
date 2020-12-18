import MediaService from "./media";
import axios from "axios";

let latency = 0;

export default class SpotifyService extends MediaService {

    static async info() {
        try {
            const response = await axios.get("https://api.spotify.com/v1/me/player");

            // issue: https://github.com/spotify/web-api/issues/1073
            let timestamp = new Date() - latency;

            // If the difference between the timestamp & the current time is less than a second, it is probably an accurate latency
            const responseLatency = timestamp - response.data.timestamp;
            if (responseLatency < 1000) {
                latency = responseLatency;
                timestamp = response.data.timestamp;
            }

            let track = {
                timestamp,
                progress: response.data.progress_ms,
                paused: !response.data.is_playing,
                repeat: response.data.repeat_state !== "off",
                shuffle: response.data.shuffle_state,
            };

            if (response.data.item) {
                Object.assign(track, {
                    id: response.data.item.uri,
                    name: response.data.item.name,
                    artist: response.data.item.artists.map((m) => m.name).join(", "),
                    album: response.data.item.album.name,
                    images: response.data.item.album.images,
                    duration: response.data.item.duration_ms,
                });
            }
            return track;
        } catch (_e) {
            return false;
        }
    }

    static async analyis(id) {
        try {
            // Update the track analysis if we don't have it already, or if the track is new
            const response = await axios.get(
                `https://api.spotify.com/v1/audio-analysis/${id}`
            );
            return response.data;
        } catch (_e) {
            return false;
        }
    }

    static async play() {
        try {
            await axios.put(
                `https://api.spotify.com/v1/me/player/play`
            );
            return true;
        } catch (_e) {
            return false;
        }
    }

    static async pause() {
        try {
            await axios.put(
                `https://api.spotify.com/v1/me/player/pause`
            );
            return true;
        } catch (_e) {
            return false;
        }
    }

    static async previous() {
        try {
            await axios.put(
                `https://api.spotify.com/v1/me/player/previous`
            );
            return true;
        } catch (_e) {
            return false;
        }
    }

    static async next() {
        try {
            await axios.put(
                `https://api.spotify.com/v1/me/player/next`
            );
            return true;
        } catch (_e) {
            return false;
        }
    }

    static async seek(progress) {
        try {
            await axios.put(
                "https://api.spotify.com/v1/me/player/seek",
                {},
                {
                    params: { position_ms: progress },
                }
            );
            return true;
        } catch (_e) {
            return true;
        }

    }

    static async shuffle(turnOn) {
        try {
            await axios.put(
                "https://api.spotify.com/v1/me/player/shuffle",
                {},
                {
                    params: { state: turnOn },
                }
            );
            return true;
        } catch (_e) {
            return false;
        }
    }

    static async repeat(turnOn) {
        try {
            await axios.put(
                "https://api.spotify.com/v1/me/player/repeat",
                {},
                {
                    params: { state: turnOn ? "track" : "off" },
                }
            );
            return true;
        } catch (_e) {
            return false;
        }
    }
}