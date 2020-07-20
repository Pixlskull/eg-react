import React from "react";
import Chromosome from "../Chromosome";
import Genome from "../Genome";
import TrackModel from "../../TrackModel";

const genome = new Genome("SARS-CoV-2", [new Chromosome("NC_045512.2", 29903)]);

const navContext = genome.makeNavContext();
const defaultRegion = navContext.parse("NC_045512.2:0-29903");

const defaultTracks = [
    new TrackModel({
        type: "geneAnnotation",
        name: "ncbiGene",
        label: "NCBI genes",
        genome: "SARS-CoV-2",
    }),
    new TrackModel({
        type: "ruler",
        name: "Ruler",
    }),
    new TrackModel({
        type: "bedgraph",
        name: "Sequence diversity (Shannon Entropy)",
        url: "https://wangftp.wustl.edu/~cfan/gisaid/latest/diversity/ncov_entropy.bedgraph.sort.gz",
        options: {
            aggregateMethod: "MAX",
        },
    }),
    new TrackModel({
        type: "qbed",
        name: "Mutation Alert",
        url: "https://wangftp.wustl.edu/~cfan/gisaid/latest/diversity/ncov_alert.bed.sort.gz",
        options: {
            height: 60,
            color: "darkgreen",
        },
    }),
    new TrackModel({
        name: "Viral RNA expression (nanopore)",
        type: "bigwig",
        url: "https://wangftp.wustl.edu/~xzhuo/bat_genomes/VeroInf24h.bw",
        options: {
            zoomLevel: "0",
        },
    }),
    new TrackModel({
        type: "bed",
        name: "Putative SARS Immune Epitopes",
        url: "https://wangftp.wustl.edu/~mchoudhary/viralBrowser/IEDB_NC_045512.2_SARS-tblastn-nCoV_3H3V6ZBF01R.bed.gz",
        options: {
            color: "#9013fe",
            displayMode: "density",
            height: 60,
        },
    }),
    new TrackModel({
        type: "categorical",
        name: "Transcription regulatory sequences (TRSs)",
        url: "https://wangftp.wustl.edu/~gmatt/viralBrowser/sars-cov-2_trs_sorted.bed.gz",
        options: {
            height: 15,
            alwaysDrawLabel: true,
            maxRows: 20,
            hiddenPixels: 0,
            category: {
                "TRS-L": { name: "TRS-L", color: "#000000" },
                "TRS-B": { name: "TRS-B", color: "#FF0000" },
            },
        },
    }),
    new TrackModel({
        type: "longrange",
        name: "TRS-L-dependent recombination",
        url: "https://wangftp.wustl.edu/~gmatt/viralBrowser/TRS-L-dependent_recombinationEvents_sorted.bed.gz",
        options: {
            yScale: "fixed",
            yMax: 7000000,
            yMin: 0,
            displayMode: "arc",
            lineWidth: 5,
            height: 205,
            greedyTooltip: true,
        },
    }),
    new TrackModel({
        type: "dbedgraph",
        name: "Viral RNA Modifications",
        url: "https://wangftp.wustl.edu/~mchoudhary/viralBrowser/studies/kim-2020/Table_S5_frac.dbg.gz",
        options: {
            dynamicLabels: ["gRNA", "S", "3a", "E", "M", "6", "7a", "7b", "8", "N"],
            speed: [3],
        },
        showOnHubLoad: true,
    }),
];

const annotationTracks = {
    Ruler: [
        {
            type: "ruler",
            label: "Ruler",
            name: "Ruler",
        },
    ],
    Genes: [
        {
            name: "ncbiGene",
            label: "NCBI genes",
            filetype: "geneAnnotation",
            genome: "SARS-CoV-2",
        },
    ],
    Assembly: [
        {
            type: "bedgraph",
            name: "GC Percentage",
            url: "https://vizhub.wustl.edu/public/virus/ncov_CGpct.bedgraph.sort.gz",
        },
    ],
    Diversity: [
        {
            type: "bedgraph",
            name: "Sequence diversity (Shannon Entropy)",
            url: "https://wangftp.wustl.edu/~cfan/gisaid/latest/diversity/ncov_entropy.bedgraph.sort.gz",
            options: {
                aggregateMethod: "MAX",
            },
        },
        {
            type: "qbed",
            name: "Mutation Alert",
            url: "https://wangftp.wustl.edu/~cfan/gisaid/latest/diversity/ncov_alert.bed.sort.gz",
        },
    ],
    "Genome Comparison": [
        {
            name: "merstonCoV2019",
            label: "MERS to SARS-CoV-2 alignment",
            querygenome: "MERS",
            filetype: "genomealign",
            url: "https://vizhub.wustl.edu/public/virus/ncov_mers.genomealign.gz",
        },
        {
            name: "sarstonCoV2019",
            label: "SARS to SARS-CoV-2 alignment",
            querygenome: "SARS",
            filetype: "genomealign",
            url: "https://vizhub.wustl.edu/public/virus/ncov_sars.genomealign.gz",
        },
        {
            name: "pangolinCoVtonCoV2019",
            label: "pangolin CoV to SARS-CoV-2 alignment",
            querygenome: "pangolin",
            filetype: "genomealign",
            url: "https://wangftp.wustl.edu/~dli/virusGateway/nCoV-pangolin.fa.genomealign1.gz",
        },
        {
            name: "batCoVtonCoV2019",
            label: "bat CoV to SARS-CoV-2 alignment",
            querygenome: "bat",
            filetype: "genomealign",
            url: "https://wangftp.wustl.edu/~dli/virusGateway/nCoV-RaTG13.fa.genomealign1.gz",
        },
    ],
};

const publicHubData = {
    "NCBI database":
        "SNV tracks of all SARS-CoV-2 strains on NCBI Genbank displaying their sequence variation from reference",
    "Nextstrain database":
        "SNV tracks of all SARS-CoV-2 strains from Nextstrain, displaying their sequence variation from the reference",
    "GISAID database":
        "SNV tracks of SARS-CoV-2 strains from GISAID, displaying their sequence variation from the reference",
    Diagnostics: "Primers, gRNAs, etc. for diagnostic tests",
    "Epitope predictions": "SARS-CoV-2 Epitope Predictions Across HLA-1 Alleles",
    "Recombination events": "Recombination events detected by junction-spanning RNA-seq",
    "Viral RNA modifications": "RNA modifications detected using Nanopore direct RNA sequencing",
    "Viral RNA expression": "Viral RNA expression measured by Nanopore",
    "Sequence variation": "Demo tracks for using the browser to study sequence variation and diversity across strains",
    "Putative SARS-CoV-2 Immune Epitopes":
        "Datahubs with tracks providing predicted epitope sequences across the SARS-CoV-2 reference genome",
};

const publicHubList = [
    {
        collection: "NCBI database",
        name: "All NCBI SARS-CoV-2 isolates",
        numTracks: "Updating",
        oldHubFormat: false,
        url: "https://wangftp.wustl.edu/~cfan/updates/latest/browser_strains.json",
        description: {
            "hub built by": "Changxu Fan (fanc@wustl.edu)",
            "hub info":
                "All SARS-CoV-2 strains available on NCBI. Aligned to reference genome (NC_045512.2) using EMBL 'stretcher'.",
            "data source": "https://www.ncbi.nlm.nih.gov/nuccore",
            "white space": "Matching the reference",
            "colored bars":
                "Variation from the reference. Details are color coded. Zoom in to click on the bar to see detail",
            "long stretches of rosy brown": "Unsequenced regions",
        },
    },
    {
        collection: "Nextstrain database",
        name: "All Nextstrain SARS-CoV-2 isolates",
        numTracks: "Updating",
        oldHubFormat: false,
        url: "https://wangftp.wustl.edu/~cfan/nextstrain/latest/browser_strains.json",
        description: {
            "hub built by": "Changxu Fan (fanc@wustl.edu)",
            "track type":
                "SNV tracks of all SARS-CoV-2 strains from Nextstrain, displaying their sequence variation from the reference",
            "data source": "http://data.Nextstrain.org/ncov.json",
        },
    },
    {
        collection: "GISAID database",
        name: "All GISAID SARS-CoV-2 isolates",
        numTracks: "Updating",
        oldHubFormat: false,
        url: "https://wangftp.wustl.edu/~cfan/gisaid/latest/browser_strains.json",
        description: {
            "track type":
                "SNV tracks of all SARS-CoV-2 strains from GISAID, displaying their sequence variation from the reference",
            "data source": (
                <a href="https://www.gisaid.org/" target="_blank" rel="noopener noreferrer">
                    <img src="https://www.gisaid.org/fileadmin/gisaid/img/schild.png" alt="GISAID logo" />
                </a>
            ),
        },
    },
    {
        collection: "Diagnostics",
        name: "Primers",
        numTracks: "Updating",
        oldHubFormat: false,
        url: "https://wangftp.wustl.edu/~cfan/viralBrowser/primers/primers.json",
        description: {
            "hub built by": "Changxu Fan (fanc@wustl.edu)",
            "hub info": "CDC primers and WHO non-CDC primers",
            "data source:":
                "https://www.who.int/emergencies/diseases/novel-coronavirus-2019/technical-guidance/laboratory-guidance",
        },
    },
    {
        collection: "Diagnostics",
        name: "CRISPR-based diagnostic tests",
        numTracks: 2,
        oldHubFormat: false,
        url: "https://wangftp.wustl.edu/~gmatt/viralBrowser/crispr_diagnostic_tests.json",
        description: {
            "hub built by": "Gavriel Matt (gavrielmatt@wustl.edu)",
            "hub info": "CRISPR-based assays for detecting SARS-CoV-2.",
            "SHERLOCK diagnostic test track":
                "Primer and guide RNA sequences used in the CRISPR-Cas13a-based SHERLOCK assay for detecting SARS-CoV-2 (source: https://www.broadinstitute.org/files/publications/special/COVID-19%20detection%20(updated).pdf; accessed on 05-08-20).",
            "DETECTR diagnostic test track":
                "Primer and guide RNA sequences used in the CRISPR-Cas12-based DETECTR assay for detecting SARS-CoV-2 (source: Broughton et al., 2020; doi: https://doi.org/10.1038/s41587-020-0513-4).",
        },
    },
    {
        collection: "Putative SARS-CoV-2 Immune Epitopes",
        name: "SARS-CoV-2 Epitopes Predicted to Bind HLA Class 1 Proteins Database",
        numTracks: "1",
        oldHubFormat: false,
        url: "https://wangftp.wustl.edu/~jflynn/virus_genome_browser/Campbell_et_al/campbell_et_al.json",
        description: {
            "hub built by": "Jennifer Flynn (jaflynn@wustl.edu)",
            "hub info": "Predicted SARS-CoV-2 epitopes that bind to class 1 HLA proteins",
            values:
                "Values represent number of strains with the predicted epitope. Only epitope predictions with 100% sequence identity in SARS-CoV-2 are displayed.",
            "data source": "Campbell, et al. (2020) pre-print (DOI: 10.1101/2020.03.30.016931)",
        },
    },
    {
        collection: "Putative SARS-CoV-2 Immune Epitopes",
        name: "Congeneric (or Closely-related) Putative SARS Immune Epitopes Locations (this publication)",
        numTracks: 1,
        oldHubFormat: false,
        url: "https://wangftp.wustl.edu/~mchoudhary/viralBrowser/IEDB_NC_045512.2_SARS-tblastn-nCoV_3H3V6ZBF01R.hub",
        description: {
            "hub built by": "Mayank Choudhary (mayank-choudhary@wustl.edu)",
            "hub info":
                "Congeneric (or closely-related) putative SARS linear immune epitopes catalogued in IEDB mapped to exact-match locations in SARS-CoV-2",
        },
    },
    {
        collection: "Putative SARS-CoV-2 Immune Epitopes",
        name: "Putative SARS-CoV-2 Epitopes",
        numTracks: 14,
        oldHubFormat: false,
        url: "https://wangftp.wustl.edu/~mchoudhary/viralBrowser/SARS-CoV-2_immune_epitopes.hub",
        description: {
            "hub built by": "Mayank Choudhary (mayank-choudhary@wustl.edu)",
            "hub info": "SARS-CoV-2 Immune Epitopes from various pre-prints and publications",
        },
    },
    {
        collection: "Recombination events",
        name: "Recombination events (Kim et al., 2020)",
        numTracks: 3,
        oldHubFormat: false,
        url: "https://wangftp.wustl.edu/~gmatt/viralBrowser/recombinationEvents.json",
        description: {
            "hub built by": "Gavriel Matt (gavrielmatt@wustl.edu)",
            "hub info":
                "Coordinates of transcription regulatory sequences (TRSs) were retrieved from (Wu et al., 2020; DOI: 10.1038/s41586-020-2008-3). Recombination events were detected by junction-spanning RNA-seq reads that were generated by (Kim et al., 2020; DOI: 10.1016/j.cell.2020.04.011). The color intensity of the arc corresponds to the number of reads supporting the recombination event.",
            TRS:
                "Transcription regulatory sequences (TRSs). The leader TRS (TRS-L) is colored black and body TRSs (TRS-B) are colored red.",
            "TRS-L-dependent recombination track": "Recombination events mediated by TRS-L. Scale 0-7000000 reads.",
            "TRS-L-independent recombination track": "Recombination events not mediated by TRS-L. Scale 0-1000 reads.",
        },
    },
    {
        collection: "Viral RNA modifications",
        name: "Viral RNA modifications (Kim et al., 2020)",
        numTracks: 10,
        oldHubFormat: false,
        url: "https://wangftp.wustl.edu/~mchoudhary/viralBrowser/studies/kim-2020/rnamodifications.json",
        description: {
            "hub built by": "Mayank Choudhary (mayank-choudhary@wustl.edu)",
            "hub info":
                "RNA modifications detected using Nanopore direct RNA sequencing (Kim et al., 2020; DOI: 10.1016/j.cell.2020.04.011). Values are displayed as fractions",
            "data source": "Supplementary Table 5, Kim et al 2020",
        },
    },
    {
        collection: "Viral RNA expression",
        name: "Viral RNA expression (Kim et al., 2020)",
        numTracks: 1,
        oldHubFormat: false,
        url: "https://wangftp.wustl.edu/~xzhuo/viralBrowser/nanoporeBW.json",
        description: {
            "hub built by": "Xiaoyu Zhuo (xzhuo@wustl.edu)",
            "hub info":
                "a bigwig track displaying nanopore expression from SARS-CoV-2 infected Vero cells (Kim et al., 2020; DOI: 10.1016/j.cell.2020.04.011).",
        },
    },
    {
        collection: "Sequence variation",
        name: "D614G prevalence across time",
        numTracks: 1,
        oldHubFormat: false,
        url: "https://wangftp.wustl.edu/~mchoudhary/viralBrowser/D614G_byweek.hub",
        description: {
            "hub built by": "Mayank Choudhary (mayank-choudhary@wustl.edu)",
            "hub info":
                "Percentage of strains with D614G mutation collected in each week between 12/23/2019 and 05/04/2020",
        },
    },
];

const nCoV2019 = {
    genome: genome,
    navContext: navContext,
    cytobands: {},
    defaultRegion: defaultRegion,
    defaultTracks: defaultTracks,
    twoBitURL: "https://vizhub.wustl.edu/public/virus/nCoV2019.2bit",
    annotationTracks,
    publicHubData,
    publicHubList,
};

export default nCoV2019;
