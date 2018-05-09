<template>
    <div class="editor">
        <button @click="exportPDFHTML">
            Take PDF
        </button>
        <button @click="exportPDFSVG">
            Take SVG PDF
        </button>

        <!-- Stage -->
        <v-stage ref="stage"
                 :config="configKonva"
                 class="stage">

            <!-- Layer -->
            <v-layer ref="layer">

                <!-- Circle -->
                <v-circle :config="configCircle"
                          @mousemove="handleMouseMove"
                          @mouseout="handleMouseOut"></v-circle>

                <!-- Polygon -->
                <v-regular-polygon :config="configPolygon"
                                   @mousemove="handleMouseMove"
                                   @mouseout="handleMouseOut"></v-regular-polygon>

                <!-- Polygon -->
                <v-regular-polygon :config="configRectangle"
                                   @mousemove="handleMouseMove"
                                   @mouseout="handleMouseOut"></v-regular-polygon>

                <!-- Stars  -->
                <v-star v-for="item in list"
                        :key="item.id"
                        :config="item"></v-star>
            </v-layer>

        </v-stage>

        <!-- paper -->
        <div ref="svgPaper"
             class="paper svg-paper">
            <svg x="0px"
                 y="0px"
                 width="450px"
                 height="100px"
                 viewbox="0 0 450 100">

                <rect x="10"
                      y="5"
                      fill="green"
                      stroke="black"
                      width="90"
                      height="90">
                </rect>

                <circle fill="red"
                        stroke="black"
                        cx="170"
                        cy="50"
                        r="45">
                </circle>

                <polygon fill="blue"
                         stroke="black"
                         points="279,5 294,35 328,40 303,62 309,94 279,79 248,94 254,62 230,39 263,35">
                </polygon>
            </svg>
        </div>

        <!-- DOM paper version -->
        <div class="dom-paper">
            <div ref="dom-rectangle"
                 class="dom-shape dom-shape--rect">
                Rect
            </div>

            <div ref="dom-circle"
                 class="dom-shape dom-shape--circle">
                Circle
            </div>

            <div ref="dom-polygon"
                 class="dom-shape dom-shape--polygon">
                Polygon
            </div>
        </div>

        <!-- PDF -->
        <div class="pdf-preview-wrapper">
            <iframe type="application/pdf"
                    :src="pdfURL"
                    class="pdf-preview">
            </iframe>
        </div>
    </div>
</template>

<script>
    // libraries
    import jsPDF from "jspdf";
    import html2canvas from "html2canvas";


    export default {
        name: "Editor",
        data: function () {
            return {
                // list of stars
                list: [],

                pdfURL: undefined,

                // stage
                configKonva: {
                    width: 800,
                    height: 200
                },

                // shapes
                configPolygon: {
                    x: 150,
                    y: 100,
                    sides: 5,
                    radius: 70,
                    fill: 'green',
                    stroke: 'black',
                    strokeWidth: 4,
                    opacity: 1
                },
                configCircle: {
                    x: 300,
                    y: 100,
                    radius: 70,
                    fill: "red",
                    stroke: "black",
                    strokeWidth: 4
                },
                configRectangle: {
                    x: 450,
                    y: 100,
                    sides: 5,
                    radius: 70,
                    fill: 'blue',
                    stroke: 'black',
                    opacity: 1
                },
            };
        },
        methods: {

            // HANDLERS

            handleMouseMove() {
            },

            handleMouseOut() {
                // this.writeMessage('Mouseout triangle');
            },

            exportPDF: function () {
                console.log('exportPDF');

                let vm = this;

                let contentWidth = 800;
                let contentHeight = 200;
                let horizontalMargin = 20;
                let vertialcalMargin = 20;

                // apply scale factor
                let scaleFactor = 3;
                contentWidth *= scaleFactor;
                contentHeight *= scaleFactor;
                horizontalMargin *= scaleFactor;
                vertialcalMargin *= scaleFactor;


                let stage = this.$refs['stage'];

                let cStyle = getComputedStyle(stage.$el);

                // log
                console.log(`Stage size : ( width : ${cStyle.width},  height : ${cStyle.height} )`);

                // take the screenshot
                html2canvas(stage.$el, {

                    logging: false,
                    scale: 3

                }).then(canvas => {

                    // log
                    console.log(`Screenshot size : ( width : ${canvas.width},  height : ${canvas.height} )`);


                    let pdf = new jsPDF({
                        orientation: 'landscape',
                        unit: 'px',
                        format: [contentWidth + (2 * horizontalMargin), contentHeight + (2 * vertialcalMargin)]
                    });

                    // log
                    console.log(`PDF size : ( width : ${pdf.internal.pageSize.width},  height : ${pdf.internal.pageSize.height} )`);


                    const screenshotDataURL = canvas.toDataURL("image/png");

                    pdf.addImage(
                        screenshotDataURL,
                        "PNG",
                        horizontalMargin, vertialcalMargin,
                        contentWidth, contentHeight,
                        '',
                        'FAST'
                    );


                    // get url to PDF file
                    vm.pdfURL = pdf.output('bloburi');

                });
            },

            exportPDFHTML: async function () {
                console.log('exportPDFHTML');

                let vm = this;

                let circle = this.$refs['dom-circle'];
                let polygon = this.$refs['dom-polygon'];
                let rect = this.$refs['dom-rectangle'];

                let pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: [300, 300]
                });


                let circleSS = await html2canvas(circle);
                let polygonSS = await html2canvas(polygon);
                let rectSS = await html2canvas(rect);

                pdf.addImage(
                    circleSS.toDataURL('image/png'),
                    'PNG',
                    0, 0, //x,y
                    300, 100, // w,h
                    '',
                    'FAST'
                );

                pdf.addImage(
                    polygonSS.toDataURL('image/png'),
                    'PNG',
                    0, 100,
                    300, 100,
                    '',
                    'FAST'
                );

                pdf.addImage(
                    rectSS.toDataURL('image/png'),
                    'PNG',
                    0, 200,
                    300, 100,
                    '',
                    'FAST'
                );

                // // get url to PDF file
                vm.pdfURL = pdf.output('bloburi');
            },

            exportPDFSVG: function () {
                console.log('exportPDFSVG');

                let vm = this;

                let paper = this.$refs['svgPaper'];

                html2canvas(paper)
                    .then(canvas => {

                        // log
                        console.log(`Screenshot size : ( width : ${canvas.width},  height : ${canvas.height} )`);


                        let pdf = new jsPDF({
                            orientation: 'landscape',
                            unit: 'px',
                            format: [450, 100]
                        });

                        // log
                        console.log(`PDF size : ( width : ${pdf.internal.pageSize.width},  height : ${pdf.internal.pageSize.height} )`);


                        const screenshotDataURL = canvas.toDataURL("image/png");

                        pdf.addImage(
                            screenshotDataURL,
                            "PNG",
                            0, 0,
                            450, 100,
                            '',
                            'FAST'
                        );


                        // get url to PDF file
                        vm.pdfURL = pdf.output('bloburi');
                    });
            }
        }
    }
</script>

<style scoped>
    .stage {
        display: block;

        border: 8px solid black;
        background: lightblue;
        width: 800px;
        height: 200px;
    }

    .pdf-preview-wrapper {
        width: 800px;
        height: 800px;
    }

    .pdf-preview {
        width: 100%;
        height: 100%;
    }

    .paper {
        display: block;
        border: 1px solid black;
        background: lightyellow;
    }

    .svg-paper {
        width: 450px;
        height: 100px;
    }

    .dom-paper {
        width: 100%;
        height: auto;

        background-color: lightgrey;
        border: 1px solid black;
    }

    .dom-paper::after {
        content: "";
        clear: both;
    }

    .dom-shape {
        float: left;

        width: 200px;
        height: 200px;

        font-size: 20px;
        color: white;

        display: flex;
        justify-content: center;
        align-items: center;

        border: 3px solid gray;
    }

    .dom-shape--rect {
        background: coral;
    }

    .dom-shape--circle {
        background: lightpink;

        border-radius: 50%;
    }

    .dom-shape--polygon {
        background: plum;
    }
</style>