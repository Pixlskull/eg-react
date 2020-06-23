import _ from "lodash";
import TrackModel from "../../model/TrackModel.ts";
import { variableIsObject } from "../../util.ts";

self.onmessage = (e) => {
    const allTracks = e.data;
    const allKeys = allTracks.map(track => Object.keys(track.metadata));
    const metaKeys = _.union(...allKeys);
    let rawtracks = []; //add raw metadata after dup remove, add is
    const parent2children = {}; // key: parent terms, value: set of [child terms]
    const child2ancestor = {};
    for (let meta of metaKeys) {
        parent2children[meta] = new Set();
        child2ancestor[meta] = meta; // add 'sample': sample as well
    }
    for (let track of allTracks) {
        let metadata = {};
        for (let [metaKey, metaValue] of Object.entries(track.metadata)) {
            if (Array.isArray(metaValue)) {
                metaValue = _.uniq(metaValue);
                // array metadata, also need check length
                if (metaValue.length > 1) {
                    // need loop over the array, constuct new key in parent2children hash
                    for (let [idx, ele] of metaValue.entries()) {
                        if (idx < metaValue.length - 1) {
                            if (!parent2children[ele]) {
                                parent2children[ele] = new Set();
                            }
                            parent2children[ele].add(metaValue[idx + 1]);
                            child2ancestor[ele] = metaKey;
                        }
                    }
                }
                parent2children[metaKey].add(metaValue[0]);
                child2ancestor[metaValue[0]] = metaKey;
            } else {
                if (variableIsObject(metaValue)) {
                    parent2children[metaKey].add(metaValue.name);
                    child2ancestor[metaValue.name] = metaKey;
                } else {
                    // string metadata
                    parent2children[metaKey].add(metaValue);
                    child2ancestor[metaValue] = metaKey;
                }
            }
            metadata[metaKey] = metaValue;
        }
        let newTrack = { ...track, metadata: metadata };
        rawtracks.push(newTrack);
    }
    self.postMessage({
        rawtracks,
        parent2children,
        child2ancestor,
        metaKeys,
    })
};
