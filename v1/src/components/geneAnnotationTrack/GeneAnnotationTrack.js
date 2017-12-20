import React from 'react';

import AnnotationArranger from './AnnotationArranger';
import GeneDetail from './GeneDetail';

import { TRACK_PROP_TYPES } from '../Track'
import TrackLegend from '../TrackLegend';
import TrackLoadingNotice from '../TrackLoadingNotice';
import SvgContainer from '../SvgContainer';
import ScrollingData from '../ScrollingData';

import Gene from '../../model/Gene';
import RegionExpander from '../../model/RegionExpander';

const HEIGHT = 120;

/**
 * A gene annotation track.
 * 
 * @author Silas Hsu
 */
class GeneAnnotationTrack extends React.Component {
    static propTypes = TRACK_PROP_TYPES;

    constructor(props) {
        super(props);
        this.state = {
            geneDetail: null
        };

        this.geneClicked = this.geneClicked.bind(this);
        this.divNode = null;
        this.genes = this._processGenes(props);
    }

    _processGenes(props) {
        let genes = [];
        let pixelsPerBase = props.width / props.viewRegion.getWidth();
        for (let bedRecord of props.data) {
            if ((bedRecord.end - bedRecord.start) * pixelsPerBase >= 1) {
                genes.push(new Gene(bedRecord, props.viewRegion));
            }
        }
        return genes;
    }

    componentWillUpdate(nextProps) {
        if (this.props.data !== nextProps.data) {
            this.genes = this._processGenes(nextProps);
        }
    }

    /**
     * Called when a gene annotation is clicked.  Sets state so a detail box is displayed.
     * 
     * @param {MouseEvent} event 
     * @param {Gene} gene 
     */
    geneClicked(event, gene) {
        event.stopPropagation();
        let detail = <GeneDetail
            left={event.clientX}
            top={event.clientY}
            rightBoundary={this.divNode.clientWidth}
            gene={gene}
        />;
        this.setState({geneDetail: detail});
    }

    render() {
        let svgStyle = {paddingTop: 10, display: "block"};
        if (this.props.error) {
            svgStyle.backgroundColor = "red";
        }
        let regionExpander = new RegionExpander(this.props.viewExpansionValue);
        let viewExpansion = regionExpander.calculateExpansion(this.props.width, this.props.viewRegion);

        return (
        <div
            style={{display: "flex", borderBottom: "1px solid grey"}}
            ref={node => this.divNode = node}
            onClick={(event) => this.setState({geneDetail: null})}
        >
            <TrackLegend height={HEIGHT} trackModel={this.props.trackModel} />
            {this.props.isLoading ? <TrackLoadingNotice height={this.props.height} /> : null}
            <ScrollingData
                width={this.props.width}
                height={HEIGHT}
                viewExpansion={viewExpansion}
                xOffset={this.props.xOffset}
            >
                <SvgContainer
                    model={viewExpansion.expandedRegion}
                    drawModelWidth={viewExpansion.expandedRegion.expandedWidth}
                    svgProps={{style: svgStyle}}
                >
                    {this.genes ?
                        <AnnotationArranger
                            data={this.genes}
                            viewRegion={this.props.viewRegion}
                            leftBoundary={viewExpansion.leftExtraPixels}
                            onGeneClick={this.geneClicked}
                            maxRows={this.props.maxRows}
                        />
                        : null
                    }
                </SvgContainer>
            </ScrollingData>
            {this.state.geneDetail}
        </div>
        );
    }
}

export default GeneAnnotationTrack;
