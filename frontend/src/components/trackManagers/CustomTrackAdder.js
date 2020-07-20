import React from "react";
import PropTypes from "prop-types";
import { Tabs, Tab } from "react-bootstrap-tabs";
import JSON5 from "json5";
// import { notify } from 'react-notify-toast';
import TrackModel from "../../model/TrackModel";
import CustomHubAdder from "./CustomHubAdder";
import FacetTable from "./FacetTable";
import { HELP_LINKS } from "../../util";
import { TrackOptionsUI } from "./TrackOptionsUI";

// Just add a new entry here to support adding a new track type.
// const TRACK_TYPES = ['bigWig', 'bedGraph', 'methylC', 'categorical', 'bed', 'bigBed', 'repeatmasker','refBed', 'hic', 'longrange', 'bigInteract', 'cool', 'bam'];

export const TRACK_TYPES = {
    Numerical: ["bigWig", "bedGraph", "qBED"],
    Annotation: ["bed", "bigBed", "refBed"],
    Categorical: ["categorical"],
    Methylation: ["methylC"],
    Interaction: ["hic", "cool", "bigInteract", "longrange"],
    Repeats: ["repeatmasker"],
    Alignment: ["bam", "pairwise"],
    "3D Structure": ["g3d"],
    Dynamic: ["dbedgraph"],
};

export const NUMERRICAL_TRACK_TYPES = ["bigwig", "bedgraph"]; // the front UI we allow any case of types, in TrackModel only lower case

const TYPES_DESC = {
    bigWig: "numerical data",
    bedGraph: "numerical data, processed by tabix in .gz format",
    methylC: "methylation data, processed by tabix in .gz format",
    categorical: "categorical data, processed by tabix in .gz format",
    bed: "annotationd data, processed by tabix in .gz format",
    bigBed: "anotation data",
    repeatmasker: "repeats annotation data in bigBed format",
    refBed: "gene annotationd data, processed by tabix in .gz format",
    hic: "long range interaction data in hic format",
    longrange: "long range interaction data in longrange format",
    bigInteract: "long range interaction data in bigInteract format",
    cool: "long range interaction data in cool format, use data uuid instead of URL",
    bam: "reads alignment data",
    pairwise: "pairwise alignment data",
    qBED: "quantized numerical data, processed by tabix in .gz format",
    g3d: "3D structure in .g3d format",
    dbedgraph: "Dynamic bedgraph data",
};

/**
 * UI for adding custom tracks.
 *
 * @author Silas Hsu and Daofeng Li
 */
class CustomTrackAdder extends React.Component {
    static propTypes = {
        addedTracks: PropTypes.arrayOf(PropTypes.instanceOf(TrackModel)),
        customTracksPool: PropTypes.arrayOf(PropTypes.instanceOf(TrackModel)),
        onTracksAdded: PropTypes.func,
        onAddTracksToPool: PropTypes.func,
        addTermToMetaSets: PropTypes.func,
        addedTrackSets: PropTypes.instanceOf(Set),
    };

    constructor(props) {
        super(props);
        this.trackUI = null;
        this.state = {
            type: TRACK_TYPES.Numerical[0],
            url: "",
            name: "",
            urlError: "",
            trackAdded: false,
            selectedTabIndex: 0,
            options: null, // custom track options
        };
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
    }

    handleSubmitClick() {
        if (!this.props.onTracksAdded) {
            return;
        }

        if (!this.state.url) {
            this.setState({ urlError: "Enter a URL" });
        } else {
            const newTrack = new TrackModel({ ...this.state, datahub: "Custom track" });
            this.props.onTracksAdded([newTrack]);
            this.props.onAddTracksToPool([newTrack], false);
            this.setState({ urlError: "", trackAdded: true });
        }
    }

    renderTypeOptions() {
        return Object.entries(TRACK_TYPES).map((types) => (
            <optgroup label={types[0]} key={types[0]}>
                {types[1].map((type) => (
                    <option key={type} value={type}>
                        {type} - {TYPES_DESC[type]}
                    </option>
                ))}
            </optgroup>
        ));
    }

    renderButtons() {
        if (this.state.trackAdded) {
            return (
                <React.Fragment>
                    <button className="btn btn-success" disabled={true}>
                        Success
                    </button>
                    <button className="btn btn-link" onClick={() => this.setState({ trackAdded: false })}>
                        Add another track
                    </button>
                </React.Fragment>
            );
        } else {
            return (
                <button className="btn btn-primary" onClick={this.handleSubmitClick}>
                    Submit
                </button>
            );
        }
    }

    getOptions = (value) => {
        let options = null;
        try {
            options = JSON5.parse(value);
        } catch (error) {
            // notify.show('Option syntax is not correct, ignored', 'error', 3000);
        }
        this.setState({ options });
    };

    renderCustomTrackAdder() {
        const { type, url, name, urlError } = this.state;
        return (
            <form>
                <h1>Add remote track</h1>
                <div className="form-group">
                    <label>Track type</label>
                    <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
                        <a href={HELP_LINKS.tracks} target="_blank" rel="noopener noreferrer">
                            track format documentation
                        </a>
                    </span>
                    <select
                        className="form-control"
                        value={type}
                        onChange={(event) => this.setState({ type: event.target.value })}
                    >
                        {this.renderTypeOptions()}
                    </select>
                </div>
                <div className="form-group">
                    <label>Track file URL</label>
                    <input
                        type="text"
                        className="form-control"
                        value={url}
                        onChange={(event) => this.setState({ url: event.target.value })}
                    />
                    <span style={{ color: "red" }}>{urlError}</span>
                </div>
                <div className="form-group">
                    <label>Track label</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(event) => this.setState({ name: event.target.value })}
                    />
                </div>
                <TrackOptionsUI onGetOptions={(value) => this.getOptions(value)} />
                {this.renderButtons()}
            </form>
        );
    }

    renderCustomHubAdder() {
        return (
            <CustomHubAdder
                onTracksAdded={(tracks) => this.props.onTracksAdded(tracks)}
                onAddTracksToPool={(tracks) => this.props.onAddTracksToPool(tracks, false)}
            />
        );
    }

    render() {
        return (
            <div id="CustomTrackAdder">
                <div>
                    <Tabs
                        onSelect={(index, label) => this.setState({ selectedTabIndex: index })}
                        selected={this.state.selectedTabIndex}
                        headerStyle={{ fontWeight: "bold" }}
                        activeHeaderStyle={{ color: "blue" }}
                    >
                        <Tab label="Add Remote Track">{this.renderCustomTrackAdder()}</Tab>
                        <Tab label="Add Remote Data Hub">{this.renderCustomHubAdder()}</Tab>
                    </Tabs>
                </div>
                {this.props.customTracksPool.length > 0 && (
                    <FacetTable
                        tracks={this.props.customTracksPool}
                        addedTracks={this.props.addedTracks}
                        onTracksAdded={this.props.onTracksAdded}
                        addedTrackSets={this.props.addedTrackSets}
                        addTermToMetaSets={this.props.addTermToMetaSets}
                    />
                )}
            </div>
        );
    }
}

export default CustomTrackAdder;
