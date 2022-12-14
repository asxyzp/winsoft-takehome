
// DECLARING VARIABLES
const canvas = document.getElementById("myCanvas");
const canvasContext = canvas.getContext("2d");

//Will store [["date",value],...]
//Will stored [["date",value],...] WRT sorted date string
//WIll store available dates of the year
//Will store sorted INR values
let INRValDateArr = [], sortedINRValDateArr = [], dates = [], INRArr = [];

/**
* @name setGrid
* @description METHOD TO GET GRID & IT'S LABELS
* @returns {undefined} undefined
**/
const setGrid = () => {
    //CREATING RECTANFLE
    canvasContext.beginPath();
    canvasContext.rect(40, 40, 800, 800);
    canvasContext.stroke();

    //CREATING HORIZONTAL GRID LINES USING LOOP
    for (let i = 40; i < 840; i = i + (800 / 30)) {
        canvasContext.beginPath();
        //Styling the line
        canvasContext.lineWidth = "1";
        canvasContext.strokeStyle = "#ccc";
        canvasContext.moveTo(40, i); 		//STARTING COORDINATE
        canvasContext.lineTo(840, i);		//ENDING COORDINATE
        canvasContext.stroke();
    }

    //CREATING VERTICAL GRID LINES USING LOOP
    for (let i = 40; i < 840; i = i + (800 / 30)) {
        canvasContext.beginPath();
        canvasContext.lineWidth = "1";
        canvasContext.strokeStyle = "#ccc";
        canvasContext.moveTo(i, 40);		//STARTING COORDINATE
        canvasContext.lineTo(i, 840); 		//ENDING COORDINATE
        canvasContext.stroke();
    }

    //CREATING HORIZONTAL DATE LABELS
    for (let i = 0; i < 31; i++) {
        canvasContext.fillText(i + 1 + "", 40 + (i * 800 / 30), 860);
    }

    //CREATING VERTICAL VALUE LABELS
    canvasContext.fillText("Dates of January 2019 (x-01-2019 | x = {1,...,31})", 40 + (11 * 800 / 30), 880);
    canvasContext.fillText("INR value", 1, 20);
}

/*
* @name getY 
* @description METHOD TO RETURN VALUE ON GRID FOR A GIVEN GRID VALUE
* @param {*} val VALUE FOR Y
* @param {*} minVal MIN VALUE FOR Y
* @param {*} unitDistance VALUE BETWEEN TWO GRID POINTS
* returns POSITION ON GRID
*/
function getY(val, minVal, unitDistance){
	let posn = Number(((val-minVal)/unitDistance).toFixed(0));
	return 840-(posn*800/30);
}

/**
* @name setGridValues
* @description METHOD TO SET GRID VALUES
* @param {*} source FILE NAME
* @returns {undefined} undefined
**/
const setGridValues = async (source) => {

    fetch(source, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors",
        cache: "default"
    })
        .then(response => response.json())
        .then(data => {

            //SORTING DATES
            dates = Object.keys(data["rates"]).sort();

            //STORES THE PAIR OF DATE AND VALUE
            INRValDateArr = dates
                .filter((date) => date.indexOf("2019-01") !== -1)
                .map((date) => {
                    return [date, data["rates"][date]["INR"]]
                });

            // STORES VALUE OF INR-EUR EXCHANGE RATE
            const INRValArr = INRValDateArr.map((INRValDate) => {
                return INRValDate[1]
            })

            // STORING MIN & MAX VALUE
            const minVal = Math.min(...INRValArr)
            const maxVal = Math.max(...INRValArr)
            const unitDistance = Number(((maxVal - minVal) / 30).toFixed(3))

            //FILLING CURRENCY VALUE IN Y-AXIS
            for (let i = 0; i < 31; i++) {
                canvasContext.fillText(minVal + i * unitDistance, 1, 840 - i * (800 / 30));
            }

            //COMPUTATION FOR LINE CREATION
            INRValDateArr.forEach((INRValDate, index) => {
                //Plotting points
                canvasContext.beginPath();
                canvasContext.lineWidth = "2";
                canvasContext.strokeStyle = "black";
                
                canvasContext.arc(
                    40 + ((Number(INRValDate[0].split('-')[2]) - 1) * 800 / 30),
                    getY(INRValDate[1], minVal, unitDistance),
                    1, 
                    1, 
                    false);
                canvasContext.stroke();

                //Drawing line across the co-ordinates
                if (index !== INRValDateArr.length - 1) {

                    canvasContext.beginPath();
                    canvasContext.lineWidth = "1";
                    canvasContext.strokeStyle = "black";
                    
                    canvasContext.moveTo(
                        40 + ((Number(INRValDate[0].split('-')[2]) - 1) * 800 / 30),
                        getY(INRValDate[1], minVal, unitDistance));
                    canvasContext.lineTo(
                        40 + ((Number(INRValDateArr[index+1][0].split('-')[2]) - 1) * 800 / 30),
                        getY(INRValDateArr[index+1][1], minVal, unitDistance));
                    canvasContext.stroke();
                }
            })
        }
        );
}

setGrid()
setGridValues("/data/data.json")