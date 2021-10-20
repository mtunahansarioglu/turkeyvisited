console.log("Hello");
const HOVER_COLOR = "#EFAE88"
const HOVER_COLOR_B = "#88efaa"
const MAP_COLOR = "#fff2e3"
var cnt = 0
const total = 81
var side = 0
var total_a = 0
var total_b = 0
var game_status = 0 //0:started 1:finished

d3.json('https://mtunahansarioglu.github.io/turkeyvisited/tr-cities.json').then(function (data) {
    let width = 1200; height = 800;
    let projection = d3.geoEqualEarth();
    projection.fitSize([width, height], data);
    let path = d3.geoPath().projection(projection);

    let svg = d3.select("#map_container").append('svg').attr("width", width).attr("height", height);


    let g = svg.append('g').selectAll('path').data(data.features).join('path').attr('d', path).attr('fill', MAP_COLOR).attr('stroke', '#000')
        .on("mouseover", function (d, i) {
            if(!d.noFill)
                d3.select(this).attr("fill", side ? HOVER_COLOR_B : HOVER_COLOR)
        })

        .on("mouseout", function (d, i) {
            if (!d.noFill)
                d3.select(this).attr("fill", MAP_COLOR)
        })
        .on("click", function (d, i) {
            d.noFill = d.noFill || false;
            if (!d.noFill) {
                if(side == 0){
                    total_a++;
                    d3.select(this).attr("fill", HOVER_COLOR);
                }else{
                    total_b++;
                    d3.select(this).attr("fill", HOVER_COLOR_B);
                }
                switchSide();
                cnt++;
                d.noFill = !d.noFill;
            }
            updateCounterText();
        });


    console.log(data.features.map((f) => f.properties.name))

    g = svg.append('g')

    g
        .selectAll("text")
        .data(data.features)
        .enter()
        .append("text")
        .text(function (d) {
            return d.properties.name;
        })
        .attr("x", function (d) {
            return path.centroid(d)[0];
        })
        .attr("y", function (d) {
            return path.centroid(d)[1];
        })
        .attr('text-anchor', 'middle')
        .attr('font-size', '10pt')
        .attr('style', 'color: black;')
        .attr('style', 'pointer-events: none;');

});

function switchSide() {
    if(game_status == 0)
        side = 1 - side
}

function updateCounterText() {
    document.getElementById("side_a").innerHTML = total_a;
    document.getElementById("side_b").innerHTML = total_b;
}

function resignGame() {
    document.getElementById("winner_text_a").innerHTML = "";
    document.getElementById("winner_text_b").innerHTML = "";
    if(side){
        document.getElementById("winner_text_a").innerHTML = "WIN!";
    }else{
        document.getElementById("winner_text_b").innerHTML = "WIN!";
    }
    switchSide()
    game_status = 1
}

function downloadMap() {

    let div = document.getElementById('map_container')
    html2canvas(div).then(
        function (canvas) {

            var destCanvas = document.createElement('canvas');
            destCanvas.width = canvas.width;
            destCanvas.height = canvas.height;
            var destCtx = destCanvas.getContext('2d')
            destCtx.drawImage(canvas, 0, 0)

            const ctx = destCanvas.getContext('2d')
            ctx.textBaseline = "top"
            ctx.font = "2em Calibri";
            ctx.fillStyle = "black";
            ctx.textAlign = "start";
            var textWidth = ctx.measureText("mtunahansarioglu.github.io/turkeyvisited & credit to ozanyerli")
            ctx.fillText("mtunahansarioglu.github.io/turkeyvisited & credit to ozanyerli", 10, canvas.height - 25);
            
            /*ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width, canvas.height);
            ctx.stroke(); */

            destCanvas.toBlob(function (blob) {
                saveAs(blob, "turkeyvisited.png")
            }) 
        })
}