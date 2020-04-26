**ChromosomeInterval**
str.replace(/,/g, '') gets rid of commas
([\w:.]+)\W+(\d+)\W+(\d+), expects something like test:123:456
<T> is for passing through types without losing info through using any
Merged Locus takes in any type and will contain many smaller sources with that type

MergedAdvanced:
- groupByChromosome does what it says it does, don't know what the inputs look like yet, but the return should be something like {"6:" : ["6:1351:13513", "6:426222235"], "8" : ["8.13513", "8:355224", "8:673734:25235"]}
sort returns ordered from smallest to largest
loci: the important object, consists of chromosome intervals
mergeStartIndex
mergeEndIndex = mergeStartIndex + 1
mergedStart
mergedEnd
const [start end] = the start and end of the object in loci[mergeEndIndex]
if the end of the first and second are close enough, they get merged
else if (end > mergedEnd) checks if the 2nd one is beyond the 1st one, and if it is, it extends the end of the merged segment; needed because one could 1:100 and two could be 24:89.
Returns array of mergedLocus, which has chromosome intervals and their start/end

mergeOverlaps:
Does a merge and returns chromosome intervals. By default, the distance for merge is 2000bp
_.Identity is a no operation function

Constructor: 
Apparently typescript automatically creates and assigns class properties

**OpenInterval**
OpenInterval is chromosomeInterval except without chromosome number

**FeatureSegment**
Interval relative to a feature
Has methods for converting into chromosomeInterval and openInterval
Has methods for checking overlap between other featureSegments and other chromosomeIntervals

**FeatureArranger**
Default export
_assignRows can create rows with a set padding or a padding based on number of features
Not sure if horizontal padding is padding from top to bottom, or left to right
It seems to be top to bottom
Only returns the number of rows

**Feature**
has name, chromosome interval, and strand type
strands can be forward, reverse, or none
has method for computing navigation context coordinates
NumericalFeature has a method for setting value and returning itself

**FeatureAggregator**
contains aggregator functions
DefaultAggregator is an object containing aggregator types and has method for returning aggregators
For xToFeatures, not sure why it isn't just const xToFeatures = Array(width).fill([])
xToFeatures creates a map of x coordinates, and appends features to each x coordinate that the feature occupies.

**FlankingStrategy**
Has method for cloning and adding a property
chromosome 400:60000 upstream = 50 downstream = 75 isForwardStrand = true
Surround_All: 350:60075
Surround_Start: 350: 475
Surround_End: 59950 60075
makeFlankedFeature returns a flankedFeature if it is within the genome

**LinearDrawingModel**
Contains methods for converting from bases to pixels and pixels to base
baseToX is the number of pixels from start of the region to that base
ToX methods return pixel (base * pixel/base)
ToBase methods return base (pixel * base/pixel)
can convert openInterval of bases to openInterval of pixels
can turn pixel into featureSegment

**NavigationContext**
Contains method for creating Gap Chromosome, has start index of 0
Has a lot more getter methods / private properties
convertBaseToFeatureCoordinate returns a 1bp FeatureSegment relative to the feature the base is in
convertGenomeIntervalToBases returns a list of OpenInterval
Parse accepts"$chrName:$startBase-$endBase" OR "$featureName"
In the first case, it returns the center of the feature
Can return genome intervals between an interval, merges to prevent overlap

**RegionExpander**
Does some math to calculate the amount needed to expand the region

**RegionSet**
Creates NavigationContext with flanked features

**DisplayModes**
Contains a bunch of 4ms for display settings, not sure why some are consts

**DisplayedRegionModel**
Contains navigationContext, and decides the viewing area
SetRegion will extend view to left or right if end or start params are over the region interval
Pan moves by certain amount of basePairs, panLeft and panRight move by one screen, assuming the width is always the viewing area
Can also zoom
Can return the currently viewed region as a string

**Genome**
Has a name, a list of chromosomes, and a object matching names and chromosomes
Has method for finding intersect with chromosomesInterval
Has method for creating NavigatoinContext

**AllGenomes**
exports all genomes
has function for getting genomeConfig and speciesInfo

**cytobandTextToJson**
UCSC-style tab-separated cytoband data into JSON
Gets rid of tabs within data
zipObject is just zip except it returns an object

**hg19**
Has a genome composed of chromosomes
Has a navigation context and a default viewing region
Has publicHubList
Has TrackModel and the collections have numTracks

**mm10**
same model as hg19

**AppStateLoader**
In charge of serializing and deserializing the app state
A lot of properties in appstate do not directly have a serialize or deserialize method
Sends Json string and receives Json blob

**DataHubParser**
for each plainObject, checks to see if it has a url
for new hub format, plain object is fed as an argument to create a track model object
Function has a section for handling old hub format

**Binning**
xrange function
can convert region to bin or bins
has a bitwise operator in it
binning used in concert with mysql to speed processes

**Gene**
Extends Feature
Is constructed from mongoDB entry
dbrecord is parsed to get this._translated and this._utrs
parseDetails get translated and untranslated regions

**RepeatMaskerFeature**
Has a divergence value based on milliDiv, subtracted from value
NumericalFeature also has value
Multiple types of repeats

**Track Model**
Constructor uses a lot of "or" expressions
Creates Track Model from an object
MetaData has the important info
Clone methods are shallow copies
MetaData can be obtained as string, array of strings, or return meta value defined by user "asis"
Need to look into the ? when defining variables

**config-override**
Appears to load babel presets and plugins to get sourcemaps to work.

**App**
Contains pretty much everything
Most of the code deals with tracks, tracks are the most important component that the app manages
Will come back after getting more comfortable with react

**AppState**
storage for the app
simulates localstorage
enum actiontype
Will come back after getting more comfortable with react

**DesignRenderer**
Renders SVGs
Can draw on canvas or svg
CanvasDesignRender appears to draw on a canvasnode it is given
has cases for different shapes
Adjusts for device pixel ratio

**Designer**
a Designer can make a design without worrying about specifics of canvas, svg, etc.
Not made yet (check on branches aside from dev)

**Ruler Designer**
Creates the ruler for the coordinates
Has property for tick seperation and decimals points
Updates units based on magnitude
Uses LinearDrawingModel
RulerElementFactory returns svg elements for lines and ticks/their text

**ErrorBoundary**
A component that wraps around other components, and will render a custom error message if there's an error

**FlankingStratConfig**
requires a strategy and a onNewStrategy function
if no onNewStrategy function is given, its just a an empty function that returns undefined
Renders inputs, which when editted, will change the flanking strategy

**GenericDraggable**
Has props of ID of type string/numb and isDragDisabled boolean, which is false by default
Uses the draggable from react-beautiful-dnd
The draggable element takes in a "provided" and a "snapshot"

**GenericDroppable**
similar to the draggable, from react-beautiful-dnd
onDragStart: PropTypes.func, helps to stop updating the draggable upon being dragged
has a required onDrop function
Returns a DragDropContext with a Droppable nested inside. 

**GenomePicker**
The page you see when first entering the browser
has a onGenomeSelected function that is called upon selecting genome.
renderGenomeOption doesn't seem to be called anywhere
the functions inside the constructor are binded to this.
ex: this.renderGenomeOption = this.renderGenomeOption.bind(this);
I think it's because of event
chooseSpecies and chooseAssembly set the species and assembly based on the event target (user input)
renderTree creates a div for each species
radio input is the small circle buttons

GenomePicker will render the assemblies for the species that is selected
A go button will appear if an assembly is selected
not sure what connect is


**OutsideClickDetector**
onOutsideClick function runs upon user click outside of node
innerRef handles refs to inner nodes

**RegionSetConfig**
addRegion attempts to create a regionSet from newRegionLocus
handleAddList is an async method called upon submitting a form, parses the user input
parsed2 parses things if they are a list 
most methods handle onChange
renderRegions is not called, or vscode can't find its references

**RegionSetSelector**
Contains RegionSetConfig
Changing the sets will call setConfigured, which then calls either addSet or replaceSet
addSet and replaceSet will then call onSetsChanged on the new array of sets
replaceSet also handles side effects, if the old set was being selected, the new set will now be selected
renderItemforSet will make buttons clickable when the sets are not being displayed

**Reparentable**
a component that does not remount

**SelectableArea**
manages the selection box for selecting regions
the selectedSpawn is an openInterval based on dragStart and currentDrag
also has a drag limit.

**SelectableGenomeArea**
displays amount of bases selected
makes sure the number of bases selected is valid, and that the area selected is valid
returns selectableArea and boxCaption.

**TranslatableG**
a g element that accepts x and y attributes.
g is an svg

**Chromosome**
draws actual chromosomes???
returns TranslatableG with boxesAndLabels, cytobands, and a linearDrawingModel

**geneSearchBox**
requires current genome and navigation context
can accept speech
has code for showing isoforms
returns autosuggest inside a target inside a manager
will attempt to find suggestions when prompted, and will display them if found

**GenomeNavigator**
returns mainPane with functionsfor adjusting the view
initial view is to view the entire region

**GenomeNavigator.test**
I think it's a redux test

**Isoform Selector**
Appears to be the main search box, not sure what the other search box from earlier was

**MainPane**
uses functions provided by genomeNavigator
changes zoom on scrollwheel use
returns RegionPanTracker with SelectableGenomeArea inside of it

**MainPane.test**
redux test for mainpaine

**Ruler**
Returns translatable svg with a img created by RulerDesigner

**SelectedRegionBox**
if the selected view is smaller than total view, new view will be created upon button press
the goto button changes depending on where xEnd is, generally displayed when xEnd is less than 0 or greater than the width of the drawing model

**StandaloneGeneAnnotation**
a svg with a single gene annotation

**TrackRegionController**
The display above the main pane
Has a text input portion, with gene search, snp search, and region search
gene search and snp search are their own components, region search function is in this component

**image_snapshots**
arrow should be displayed when box is outside of view

**getComponentName**
accepts ComponentType or string, and returns a sting
if not string, will return 'Component' if component.displayName or component.name not found

**AnnotationTrackConfig**
extends TrackConfig
uses default options from annotation/AnnotationTrack
menuComponents also has AnnotationDisplayModeConfig, and another item depending on displayMode

**BedGraphTrackConfig**
converts raw bed records to NumericalFeatures
init data source returns either BedTextSource, LocalBedSource, or WorkerSource

**BedTrackConfig**
returns features instead of numericalFeatures

**BigBedTrackConfig**
example record 
DASFeature {
    label: "NR_037940",
    max: 27219880,
    min: 27202057,
    orientation: "-",
    score: 35336,
    segment: "chr7",
    type: "bigbed",
    _chromId: 19
}
converts DASFeatures to Feature

**BigWigTrackConfig**
same as above but numericalFeature

**GeneAnnotationTrackConfig**
HiddenPixelsConfig
returns geneSource or Gene

**NumericalTrackConfig**
extends TrackConfig
imports defaultOptions from trackVis/commonComponents/numerical/NumericalTrack
has a lot of extra menuComponents

**RepeatMaskerTrackConfig**
format data takes RepeatDASFeature and returns RepeatMaskerFeature

**RulerTrackConfig**
same as trackConfig but returns as type RulerTrack 

**TrackConfig**
setDefaultOptions adds or overrides existing keys
shouldFetchBecauseOptionChange suggests whether a change in settings should mean a new fetch
maining has methods to be overriden by child classes

**configDataFetch**
Component classes returned by withDataFetch will automatically fetch data when view region changes
configStaticDataSource is same as before, but it also configures a default data source, such that that output component classes do not require props to specify a DataSource.
need to get more comfortable with react

**getTrackRenderer**
returns TrackConfig from TrackModel
returns a base TrackConfig if no TrackConfig can be found from TrackModel

**MetadataHeader**
terms: PropTypes.arrayOf(PropTypes.string)
returns a MetadataSelectionMenu
displays terms

**MetadataSelectionMenu**
displays current terms, suggested terms, and allows the input of custom terms
concat returns a new array

**ReorderableTrackContainer**
getTrackGrouping groups the tracks into draggable groups based on whether or not the element was selected
bundleTracksInInterval returns a genericDroppable
GenericDroppable within GenericDroppable?

**TrackContainer**
contains all the tracks and has functions that apply to all of them
returns Controls, a specialized track container, and a circlet review

**TrackErrorBoundary**
returns ErrorBoundary, intended to behave like a track

**TrackHandle**
getTrackSpecialization returns component and options
returns TrackErrorBoundary
has method for returning itself in a reparentable

**ZoomableTrackContainer**
is called withTrackLegendWidth
returns SelectableGenomeArea
props requires ViewExpansion

**ColorConfig**
returns SingleInputConfig
has functions for returning ColorConfigs for configuring the color of different objects

**DisplayModeConfig**
returns selectConfig for annotations tracks, numermerical tracks, and interaction tracks?

**HeightConfig**
returns NumberConfig for configuring track height

**LabelConfig**
returns SingleInputConfig for setting track labels

**MaxRowsConfig**
A context menu item that configures the max number of rows of annotations to render
returns NumberConfig

**NumberConfig**
returns SingleInputConfig
renderInputElement handles number input

**SelectConfig**
returns SingleInputConfig
uses select and options

**SingleInputConfig**
base class for rendering a single element for inputting data
can render a set button

**TrackContextMenu**
manages track options and metadata
has a bunch of function-based components

**aggregateOptions**
takes in a bunch of track options
if they all share the same option, return that option or default option
otherwise return a multivalue

**AnnotationTrackSelector**
convertAnnotationJsonSchema takes a schemaNode
returns object with keys isExpanded, label, children
children are TrackModel objects
returns TreeView

**AnnotationTrackUI**
GUI for selecting annotation tracks to add based on genome
returns React Fragment with AnnotationTrackSelector

**CustomHubAdder**
contains RemoteHubAdder and FileHubAdder
the CustomHubAdder returns both hubs in a div
remote seems to receive, filehub seems to send

**CustomTrackAdder**
contains both customtrackadder and customhubadder
customtrackadder is a form
render returns Tabs and FacetTable

**HubPane**
returns HubTable and FacetTable

**HubTable**
displays available public track hubs
onHubLoaded is a function

**HubTrackTable**
displays tracks available from loaded hubs

**TrackManager**
everything for managing tracks
has a submenu with  AnnotationTrackSelector, HubPane, and CustomTrackAdder

**TrackSearchBox**
returns Autosuggest
search seems to be from tracks.getMetadataAsArray
for some reason renderSuggestion takes in a suggestion and just returns it

**TreeView**
has DefaultExpandButton
A tree view (outline view) of data
can render leaves or subtrees (another TreeView)

**RepeatMaskerTrack**
returns track or annotation track if too zoomed out
annotation is TranslatableG

**RulerTrack**
ruler visualizer returns HoverTooltipContext with an svg inside, containing chromosome and ruler
rulertrack returns a track with the visualizer

**UnknownTrack**
placeholder, does nothing, contains error message

**BedAnnotation**
can return a minimal TranslatableG 
can also return one with background text and arrows

**BedTrack**
Track component for BedAnnotation
returns track
has function for rendering tooltip

**BackgroundedText**
svg text element. it also guesses box size for performance reasons
returns react fragment
background is a rect element

**GenomicCoordinates**
calculates genomic coordinates at a page coordinate and displays them
either returns the segment name or the coordinate

**MetadataIndicator**
uses the colored box component
describes track metadata
box is created for each term

**Track**
all default props are optional
xOffset, onContextMenu, onClick, onMetadataClick, options
viewWindow component
renders div (kinda obvious in retrospect)
legend is a key part

**TrackLegend**
displays important track info
also returns a div

**AnnotationArrows**
code is mainly math for the arrow spacing and stuff like that
returns svgs

**AnnotationTrack**
either returns numerical track or full display mode
also the function is passed through withOptionMerging

**FeatureDetail**
box with feature details
div

**FullDisplayMode**
contains FullVisualizer
returns track

**configOptionMerging**
don't fully understand this, will come back to it.

**NumericalTrack**
returns track
visualizer contains valueplot
valueplot returns designrender
also contains hoverTooltipContext

**HoverTooltipContext**
returns div
on hover creates a tooltip element

**Tooltip**
OutsideClickDetector will close the tooltip
render checks if tooltip has children
manager element
stopPropagation prevents the event from sending up the tree

**withTooltip**
allows toolTips to be rendered as children
callbacks allow for that
returns wrappedComponent
**GeneAnnotation**
a svg
has intron and exon arrows which are AnnotationArrows
centerLine is a line element
exonClip is a clipPath
utr arrows and rects are rect elements
uses featurePlacer

**GeneAnnotationTrack**
returns annotationTrack
geneAnnotationScaffold
tooltip contains GeneDetail

**GeneDetail**
displays gene details
returns div with FeatureDetail

**image_snapshots**

**BrowserScene**
for every track, return react fragment with component3D, VrRuler, and a-text
if of type hic or longrange will return interaction track
children within a-scene

**Custom3DObject**
will call setObject3D on its node
returns a-entity

**VrRuler**
returns custom3DObject with lines and text
makeLines returns three.LineSegment
makeText returns three.mesh
uses rulerDesigner

**mergeGeometries**
merges array of BufferGeometry

**withAutoDimensions**
automatically sets dimensions
based on node.clientDimensions

**withCurrentGenome**
makes it so that the component class always has genome configuration
**DataSource**
getData has three parameters
DisplayedRegionModel region for which to fetch data
basesPerPixel, Higher = more zoomed out
options
returns promise
cleanUp functions as destructor
**GeneSource**
takes in a trackModel
getData takes region
**TwoBitSource**
gets 2bit data from url
constructor requires url
getSequenceInInterval gets a sequence from a genome interval

**Bed.worker**
runs registerWorkerRunnableSource(BedSourceWorker)
the function allows the data source class to be run in a webworker context
not sure exactly what that is

**BedSourceWorker**
extends WorkerRunnableSource 
gets BedRecords from remote bed files
not sure exactly what that is either

**Big.worker**
registerWorkerRunnableSource(BigSourceWorker);
**BigSourceWorker**
extends WorkerRunnableSource 
gets data from bigwig or bigbed
need to do more research on this

**WorkerMessage**
MessageWriter and MessageReader class
writer takes a worker
writer has send init message, send get message, and send delete message
all use worker.postMessage
reader handles messages of type init, run, and delete 

**WorkerRunnableSource**
seems to be an abstract class
source of data that webworkers can run

**WorkerSource**
contains workerManager and workerSource which extends runnableSource
getInstance in workerManager returns instance or creates a new worker
workerSource takes a workerClass
constructor creates messageWriter and sends init message
cleanUp sends delete message and sets messageWriter to null
getData sends a getDataMessage

**registerWorkerRunnableSource**
clientmanager takes WorkerRunnableSource, has insert, run, and delete function for the sources
registerWorkerRunnableSource runs the registerPromiseWorker function, 
returns messageReader.handleMessage(message, clientManager)

**index**
seems to be the root file
need to figure out what (window as any) does
stuff is inside a Provider

**registerServiceWorker**
allows page to load faster and work somewhat offline
however, updates will only be seen after all tabs to the site are closed

**setupTests**
runs configure({ adapter: new Adapter() });

**geneAnnotationStories**
all commented out
seems to render annotations for genes

**genomeNavStories**
renders two views

**testUtils**
runs AppState.dispatch(ActionCreators.setGenome("hg19"));
return Provider store={AppState} {...props} ;
seems like a setup for a test

**util**
contains utility functions
functions such as event coordinates, math related stuff, =colors

