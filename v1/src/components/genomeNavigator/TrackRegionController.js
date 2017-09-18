import React from 'react';

/**
 * The display that is above the main pane of the genome navigator, which shows the current track region and a text
 * input to modify it.
 * 
 * @author Silas Hsu
 */
class TrackRegionController extends React.Component {
    constructor(props) {
        super(props);
        this.input = null;
        this.state = {
            badInputMessage: "",
        };
    }

    /**
     * @return {string} the currently displayed region in human-readable form
     */
    _currentRegionAsString() {
        let regionList = this.props.model.getRegionList();
        if (regionList.length === 1) {
            return regionList[0].toString();
        } else {
            let first = regionList[0];
            let last = regionList[regionList.length - 1];
            return `${first.name}:${first.start}-${last.name}:${last.end}`;
        }
    }

    /**
     * Parses user input that expresses a desired region for tracks to display.
     */
    parseRegion() {
        let parsedRegion = null;
        try {
            parsedRegion = this.props.model.parseRegionString(this.input.value);
        } catch (error) {
            if (error instanceof RangeError) {
                this.setState({badInputMessage: error.message});
                return;
            } else {
                throw error;
            }
        }

        // Yay, parsing successful!
        if (this.state.badInputMessage.length > 0) {
            this.setState({badInputMessage: ""});
        }
        this.props.newRegionCallback(parsedRegion.start, parsedRegion.end);
    }

    /**
     * @inheritdoc
     */
    render() {
        let region = this._currentRegionAsString();
        return (
        <div>
            <p>Current track region: {region}</p>
            <label>
                Set new region:
                <input type="text" ref={(input) => this.input = input} />
                <button onClick={this.parseRegion.bind(this)}>Go</button>
                {
                    this.state.badInputMessage.length > 0 ? <p>{this.state.badInputMessage}</p> : null
                }
            </label>
        </div>
        );
    }
}

export default TrackRegionController;
