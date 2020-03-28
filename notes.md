#3/25/20
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

#3/27/19

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
Contains a bunch of enums for display settings, not sure why some are consts

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

