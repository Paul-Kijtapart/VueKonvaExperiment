<template>
    <div class="editor">
        <button @click="exportPDF">
            Take PDF
        </button>

        <!-- Stage -->
        <v-stage ref="stage"
                 :config="configKonva"
                 class="stage">

            <!-- Layer -->
            <v-layer ref="layer">

                <!-- Circle -->
                <v-circle ref="circle"
                          :config="configCircle"
                          @mousemove="handleMouseMove"
                          @mouseout="handleMouseOut"></v-circle>

                <!-- Polygon -->
                <v-regular-polygon ref="polygon"
                                   :config="configPolygon"
                                   @mousemove="handleMouseMove"
                                   @mouseout="handleMouseOut"></v-regular-polygon>

                <!-- Polygon -->
                <v-regular-polygon ref="polygon-2"
                                   :config="configRectangle"
                                   @mousemove="handleMouseMove"
                                   @mouseout="handleMouseOut"></v-regular-polygon>

                <!-- Stars  -->
                <v-star v-for="item in list"
                        :key="item.id"
                        :config="item"></v-star>
            </v-layer>

        </v-stage>

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
                // console.log('exportPDF');

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
            }

        }
    }
</script>

<style scoped>
    .stage {
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
</style>