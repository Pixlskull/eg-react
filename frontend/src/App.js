import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash";
import { ActionCreators } from "./AppState";
import GenomePicker from "./components/GenomePicker";
import Nav from "./components/Nav";
import GenomeNavigator from "./components/genomeNavigator/GenomeNavigator";
import TrackContainer from "./components/trackContainers/TrackContainer";
import withCurrentGenome from "./components/withCurrentGenome";
import { BrowserScene } from "./components/vr/BrowserScene";
import ErrorBoundary from "./components/ErrorBoundary";
import DisplayedRegionModel from "./model/DisplayedRegionModel";
import TrackModel from "./model/TrackModel";
import Notifications from "react-notify-toast";
import LoadSession from "./components/LoadSession";
import { RegionExpander } from "./model/RegionExpander";
import { Footer } from "./components/Footer";
import { SessionUI } from "./components/SessionUI";
import { Offline } from "react-detect-offline";
import { HELP_LINKS } from "./util";

import "./App.css";

const REGION_EXPANDER = new RegionExpander(1);

function mapStateToProps(state) {
    return {
        viewRegion: state.browser.present.viewRegion,
        tracks: state.browser.present.tracks,
        bundleId: state.browser.present.bundleId,
        sessionFromUrl: state.browser.present.sessionFromUrl,
        trackLegendWidth: state.browser.present.trackLegendWidth,
        isShowingNavigator: state.browser.present.isShowingNavigator,
        customTracksPool: state.browser.present.customTracksPool,
        virusBrowserMode: state.browser.present.virusBrowserMode
    };
}

const callbacks = {
    onNewViewRegion: ActionCreators.setViewRegion,
    onTracksChanged: ActionCreators.setTracks,
    onLegendWidthChange: ActionCreators.setTrackLegendWidth,
    onToggleNavigator: ActionCreators.toggleNavigator
};

const withAppState = connect(mapStateToProps, callbacks);
const withEnhancements = _.flowRight(withAppState, withCurrentGenome);

class App extends React.Component {
    static propTypes = {
        genomeConfig: PropTypes.object,
        viewRegion: PropTypes.instanceOf(DisplayedRegionModel),
        tracks: PropTypes.arrayOf(PropTypes.instanceOf(TrackModel)),
        onNewViewRegion: PropTypes.func,
        onTracksChanged: PropTypes.func,
        embeddingMode: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            isShowing3D: false,
            // isShowingNavigator: true,
            highlightEnteredRegion: true,
            enteredRegion: null,
            highlightColor: "rgba(255, 255, 0, 0.3)", // light yellow
            publicHubs: [],
            publicTracksPool: [],
            customTracksPool: [],
            // publicTrackSets: new Set(),
            // customTrackSets: new Set(),
            availableTrackSets: new Set(),
            suggestedMetaSets: new Set(["Track type"])
        };
        this.addTracksToPool = this.addTracksToPool.bind(this);
        this.addTracks = this.addTracks.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePublicHubs = this.updatePublicHubs.bind(this);
        this.addTracktoAvailable = this.addTracktoAvailable.bind(this);
        this.removeTrackFromAvailable = this.removeTrackFromAvailable.bind(this);
        this.addTermToMetaSets = this.addTermToMetaSets.bind(this);
    }

    componentDidMount() {
        if (this.props.genomeConfig && this.props.genomeConfig.publicHubList) {
            this.setState({
                publicHubs: this.props.genomeConfig.publicHubList.slice()
            });
        }
        this.initializeMetaSets(this.props.tracks);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.genomeConfig && nextProps.genomeConfig !== this.props.genomeConfig) {
            if (nextProps.genomeConfig.publicHubList) {
                this.setState({
                    publicHubs: nextProps.genomeConfig.publicHubList.slice()
                });
            } else {
                // when switch genome, need reset hub as well
                this.setState({
                    publicHubs: []
                });
            }
            this.setState({ publicTracksPool: [], customTracksPool: [] });
        }
        if (nextProps.publicTracksPool !== this.props.publicTracksPool) {
            if (nextProps.publicTracksPool) {
                this.setState({ publicTracksPool: nextProps.publicTracksPool });
            } else {
                this.setState({ publicTracksPool: [] });
            }
        }
        if (nextProps.customTracksPool !== this.props.customTracksPool) {
            if (nextProps.customTracksPool) {
                this.setState({ customTracksPool: nextProps.customTracksPool });
            } else {
                this.setState({ customTracksPool: [] });
            }
        }
        this.initializeMetaSets(nextProps.tracks);
    }

    initializeMetaSets = tracks => {
        const allKeys = tracks.map(track => Object.keys(track.metadata));
        const metaKeys = _.union(...allKeys);
        this.addTermToMetaSets(metaKeys);
    };

    addTermToMetaSets(term) {
        const toBeAdded = Array.isArray(term) ? term : [term];
        this.setState({
            suggestedMetaSets: new Set([...this.state.suggestedMetaSets, ...toBeAdded])
        });
    }

    addTracktoAvailable(trackModel) {
        this.setState({
            availableTrackSets: new Set([...this.state.availableTrackSets, trackModel])
        });
    }

    removeTrackFromAvailable(trackModel) {
        const newTrackSets = new Set(Array.from(this.state.availableTrackSets));
        newTrackSets.delete(trackModel);
        this.setState({
            availableTrackSets: newTrackSets
        });
    }

    /**
     * Adds a list of tracks to the list of all tracks available from a public or custom hub.
     *
     * @param {TrackModel[]} newTracks - additions to the list of all tracks available from a hub
     * @param {boolean} toPublic - whether to also add the tracks to public or custom pool
     */
    addTracksToPool(newTracks, toPublic = true) {
        if (toPublic) {
            // const urlSets = new Set([...this.state.publicTrackSets, ...newTracks.map(track => track.url)]);
            this.setState({
                publicTracksPool: this.state.publicTracksPool.concat(newTracks)
                // publicTrackSets: urlSets,
            });
        } else {
            // const urlSets = new Set([...this.state.customTrackSets, ...newTracks.map(track => track.url)]);
            this.setState({
                customTracksPool: this.state.customTracksPool.concat(newTracks)
                // customTrackSets: urlSets,
            });
        }
    }

    updatePublicHubs(publicHubs) {
        this.setState({ publicHubs });
    }

    addTracks(tracks) {
        const newTracks = this.props.tracks.concat(tracks);
        this.props.onTracksChanged(newTracks);
    }

    removeTrack(indexToRemove) {
        let newTracks = this.props.tracks.filter((track, index) => index !== indexToRemove);
        this.props.onTracksChanged(newTracks);
    }

    // toggleNavigator = () => {
    //     this.setState(prevState => {return {isShowingNavigator: !prevState.isShowingNavigator}});
    // };

    toggle3DScene = () => {
        this.setState(prevState => {
            return { isShowing3D: !prevState.isShowing3D };
        });
    };

    toggleHighlight = () => {
        this.setState(prevState => {
            return { highlightEnteredRegion: !prevState.highlightEnteredRegion };
        });
    };

    setEnteredRegion = chrInterval => {
        this.setState({ enteredRegion: chrInterval });
    };

    setHighlightColor = color => {
        const rgb = color.rgb;
        this.setState({
            highlightColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
        });
    };

    groupTrackByGenome = () => {
        const { genomeConfig, tracks } = this.props;
        const grouped = {}; // key: genome name like `hg19`, value: a set of track name or url
        tracks.forEach(track => {
            const gname = track.getMetadata("genome");
            const targeName = gname ? gname : genomeConfig.genome.getName();
            if (grouped[targeName]) {
                grouped[targeName].add(track.url || track.name);
            } else {
                grouped[targeName] = new Set([track.url || track.name]);
            }
        });
        return grouped;
    };

    render() {
        const {
            genomeConfig,
            viewRegion,
            tracks,
            onNewViewRegion,
            bundleId,
            sessionFromUrl,
            trackLegendWidth,
            onLegendWidthChange,
            isShowingNavigator,
            onToggleNavigator,
            embeddingMode,
            virusBrowserMode
        } = this.props;
        if (sessionFromUrl) {
            return (
                <div className="container-fluid">
                    <LoadSession bundleId={bundleId} />
                </div>
            );
        }
        if (!genomeConfig) {
            return (
                <div className="container-fluid">
                    <GenomePicker />
                    <SessionUI bundleId={bundleId} withGenomePicker={true} />
                    <hr />
                    <Footer />
                    <Notifications />
                </div>
            );
        }
        const tracksUrlSets = new Set([
            ...tracks.filter(track => track.url).map(track => track.url),
            ...tracks.filter(track => !track.url).map(track => track.name)
        ]);
        // tracksUrlSets.delete('Ruler'); // allow ruler to be added many times
        // const publicHubs = genomeConfig.publicHubList ? genomeConfig.publicHubList.slice() : [] ;
        const groupedTrackSets = this.groupTrackByGenome();
        return (
            <div className="App container-fluid">
                <Nav
                    {...this.state}
                    isShowingNavigator={isShowingNavigator}
                    onToggleNavigator={onToggleNavigator}
                    onToggle3DScene={this.toggle3DScene}
                    onToggleHighlight={this.toggleHighlight}
                    onSetEnteredRegion={this.setEnteredRegion}
                    onSetHighlightColor={this.setHighlightColor}
                    selectedRegion={viewRegion}
                    onRegionSelected={onNewViewRegion}
                    tracks={tracks}
                    genomeConfig={genomeConfig}
                    onTracksAdded={this.addTracks}
                    onTrackRemoved={this.removeTrack}
                    bundleId={bundleId}
                    trackLegendWidth={trackLegendWidth}
                    onLegendWidthChange={onLegendWidthChange}
                    onAddTracksToPool={this.addTracksToPool}
                    onHubUpdated={this.updatePublicHubs}
                    addedTrackSets={tracksUrlSets}
                    // publicHubs={publicHubs}
                    removeTrackFromAvailable={this.removeTrackFromAvailable}
                    addTracktoAvailable={this.addTracktoAvailable}
                    addTermToMetaSets={this.addTermToMetaSets}
                    embeddingMode={embeddingMode}
                    groupedTrackSets={groupedTrackSets}
                    virusBrowserMode={virusBrowserMode}
                />
                <Notifications />
                {isShowingNavigator && (
                    <GenomeNavigator selectedRegion={viewRegion} onRegionSelected={onNewViewRegion} />
                )}
                {this.state.isShowing3D && (
                    <ErrorBoundary>
                        <BrowserScene
                            viewRegion={viewRegion}
                            tracks={tracks}
                            expansionAmount={REGION_EXPANDER}
                            genomeConfig={genomeConfig}
                        />
                    </ErrorBoundary>
                )}
                <Offline>
                    <div className="alert alert-warning text-center lead" role="alert">
                        You are currently offline, so tracks on web won't load. But you can still use the{" "}
                        <a href={HELP_LINKS.localhub} target="_blank" rel="noopener noreferrer">
                            Local Track
                        </a>{" "}
                        and{" "}
                        <a href={HELP_LINKS.textTrack} target="_blank" rel="noopener noreferrer">
                            Local Text Track
                        </a>{" "}
                        functions.
                    </div>
                </Offline>
                <TrackContainer
                    enteredRegion={this.state.enteredRegion}
                    highlightColor={this.state.highlightColor}
                    highlightEnteredRegion={this.state.highlightEnteredRegion}
                    expansionAmount={REGION_EXPANDER}
                    suggestedMetaSets={this.state.suggestedMetaSets}
                    genomeConfig={genomeConfig}
                />
                {!embeddingMode && <Footer />}
            </div>
        );
    }
}

export default withEnhancements(App);

export const AppWithoutGenome = withAppState(App);
