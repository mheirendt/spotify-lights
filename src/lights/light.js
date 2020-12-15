import { merge } from 'lodash';



/**
 * Base class for all Light implementations
 */
export default class Light {

    /**
     * Merge defaults properties with custom properties to create a new Light
     * @param {object} props - Custom property values
     * @param [props.id=''] {string} - The Id of the light
     * @param [props.state='OFF'] {string} - Whether or not the light is currently 'OFF' or 'ON'. Requires toggle capability
     * @param [props.color=''] {string} - The current color of the light. Requires color capability
     * @param [props.location] {object} - The location of the light
     * @param [props.location.x=0] {number} - The X location
     * @param [props.location.y=0] {number} - The Y location
     * @param [props.capabilities] {object} - What the light is capable of doing
     * @param [props.capabilities.toggle=false] {boolean} - Whether or not the light can be toggled on / off
     * @param [props.capabilities.color=false] {boolean} - Whether or not the light supports color
     * @returns The newly constructed Light
     */
    constructor(props) {
        // If no existing properties, assign props to an empty object
        if (!props) props = {};

        // Setup the default values to be used when new Light() is called with no props
        const defaults = {
            id: '',
            state: 'OFF',
            color: '',
            location: {
                x: 0,
                y: 0,
            },
            capabilities: {
                toggle: false,
                color: false,
            },
        };

        // Merge all provided props into the defaults, then into the class instance
        merge(this, defaults, props);
    }

    /**
     * 
     */
    async toggle() {

    }

    /**
     * Place the light at X,Y coordinates
     * @param {object} location - The location where the light should be placed
     * @param [location.x] {number} - The X location
     * @param [location.y] {number} - The Y location
     * @returns {Light} The updated Light instance
     */
    place(location) {
        this.location = location;
        return this;
    }
}