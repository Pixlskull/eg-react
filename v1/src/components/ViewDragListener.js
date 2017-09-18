import DisplayedRegionModel from '../model/DisplayedRegionModel';
import DomDragListener from './DomDragListener';
import PropTypes from 'prop-types';
import React from 'react';
import SvgComponent from './SvgComponent';

/**
 * Listens for drag-across events as specified by {@link DomDragListener}, but as a SvgComponent, this component also 
 * calculates changes in view region as the result of the drag.
 * 
 * @author Silas Hsu
 */
class ViewDragListener extends SvgComponent {
    constructor(props) {
        super(props);

        this.dragOriginModel = null;

        this.dragStart = this.dragStart.bind(this);
        this.drag = this.drag.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
    }

    /**
     * Initializes view dragging.  Signals that dragging has started to the callback passed in via props.
     * 
     * @param {MouseEvent} event - mouse event that signals a drag start
     */
    dragStart(event) {
        this.dragOriginModel = this.props.model;
        if (this.props.onViewDragStart) {
            this.props.onViewDragStart(event);
        }
    }

    /**
     * If view dragging has been initialized, calcuates a new view region depending on where the mouse has been dragged.
     * Then gives this information to the callback passed in via props.
     * 
     * @param {MouseEvent} event - a mousemove event fired from within this pane
     * @param {object} coordinateDiff - an object with keys `dx` and `dy`, how far the mouse has moved since drag start
     */
    drag(event, coordinateDiff) {
        if (this.props.onViewDrag && this.dragOriginModel) {
            let newRegion = this._getRegionOffsetByX(this.dragOriginModel, -coordinateDiff.dx);
            this.props.onViewDrag(newRegion.start, newRegion.end, event, coordinateDiff);
        }
    }

    /**
     * Uninitializes view dragging.  Also calcuates a new view region depending on where the mouse has been dragged.
     * Then gives this information to the callback passed in via props.
     * 
     * @param {MouseEvent} event - mouse event that signals a drag end
     * @param {object} coordinateDiff - an object with keys `dx` and `dy`, how far the mouse has moved since drag start
     */
    dragEnd(event, coordinateDiff) {
        if (this.props.onViewDragEnd && this.dragOriginModel) {
            let newRegion = this._getRegionOffsetByX(this.dragOriginModel, -coordinateDiff.dx);
            this.props.onViewDragEnd(newRegion.start, newRegion.end, event, coordinateDiff);
        }
        this.dragOriginModel = null;
    }

    /**
     * Calculates the absolute displayed region panned by some number of pixels.  Does not modify any of the inputs.
     * 
     * @param {LinearDrawingModel} model - drawing model used to convert from pixels to bases
     * @param {number} xDiff - number of pixels to pan the region
     * @return {object} - absolute region resulting from panning the input region
     */
    _getRegionOffsetByX(model, xDiff) {
        let baseDiff = this.props.drawModel.xWidthToBases(xDiff);
        let startRegion = model.getAbsoluteRegion();
        return {
            start: startRegion.start + baseDiff,
            end: startRegion.end + baseDiff,
        }
    }

    /**
     * @inheritdoc
     */
    render() {
        return (
            <DomDragListener
                button={this.props.button}
                onDragStart={this.dragStart}
                onDrag={this.drag}
                onDragEnd={this.dragEnd}
                node={this.props.svgNode}
            />
        );
    }
}

export default ViewDragListener;

ViewDragListener.propTypes = {
    button: PropTypes.number.isRequired,
    model: PropTypes.instanceOf(DisplayedRegionModel),
    onViewDragStart: PropTypes.func, // function(MouseEvent)
    onViewDrag: PropTypes.func, // function({number} view region start, {number} view region end, MouseEvent, Object)
    onViewDragEnd: PropTypes.func, // function({number} view region start, {number} view region end, MouseEvent, Object)
}
