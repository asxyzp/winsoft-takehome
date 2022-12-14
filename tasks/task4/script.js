var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
console.log(typeof c, typeof ctx);
//Creating a rectangle
ctx.beginPath();
ctx.rect(40, 40, 800, 800);
ctx.stroke();

//Creating horizontal grid lines using for loops
for (let i = 40; i < 840; i = i + (800 / 30)) {
    ctx.beginPath();
    //Styling the line
    ctx.lineWidth = "1";
    ctx.strokeStyle = "#ccc";
    ctx.moveTo(40, i); 		//Starting coordinates of the line
    ctx.lineTo(840, i);		//Ending coordinates of the line
    ctx.stroke();
}

//Creating vertical grid lines using for loops
for (let i = 40; i < 840; i = i + (800 / 30)) {
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "#ccc";
    ctx.moveTo(i, 40);		//Starting coordinates of the line
    ctx.lineTo(i, 840); 		//Ending coordinates of the line
    ctx.stroke();
}

//Filling date horizontally
for (let i = 0; i < 31; i++) {
    ctx.fillText(i + 1 + "", 40 + (i * 800 / 30), 860);
}

//Filling label for x-axis
ctx.fillText("Dates of January 2019 (x-01-2019 | x = {1,...,31})", 40 + (11 * 800 / 30), 880);
ctx.fillText("INR value", 1, 20);


let INRValueJan19 = [];		//Will store [["date",value],...]
let sortedINRValueJan19 = [];	//Will stored [["date",value],...] WRT sorted date string
let dateArr = [];			//WIll store available dates of the year
let INRArr = [];			//Will store sorted INR values

//Accessing data.json data using fetch()
fetch("https://api.exchangeratesapi.io/history?start_at=2019-01-01&end_at=2019-01-31")
    .then(response => response.json())	//Converting response stream into JSON
    .then(data => {

        //Storing all dates in INR to search for dates with "2019-01" in an array dateArr
        dateArr = Object.keys(data["rates"]);

        //Iteratting through all values to find available dates within January
        for (let i = 0; i < dateArr.length; i++) {
            if (dateArr[i].indexOf("2019-01") != -1) {
                INRValueJan19.push([dateArr[i], data["rates"][dateArr[i]]["INR"]]);
            }
        }
        dateArr.sort();		//Creating a sorted date array

        //Creating a sorted date value array
        for (let i = 0; i < dateArr.length; i++) {
            for (let j = 0; j < INRValueJan19.length; j++) {
                if (dateArr[i] == INRValueJan19[j][0]) {
                    sortedINRValueJan19.push([dateArr[i], INRValueJan19[j][1]]);
                    break;
                }
            }
        }

        //INRArr sort
        for (let i = 0; i < sortedINRValueJan19.length; i++) {
            INRArr.push(sortedINRValueJan19[i][1]);
        }
        INRArr.sort((a, b) => a - b);

        //Stores the difference between minimum & maximum value of an array
        let difference = INRArr[INRArr.length - 1] - INRArr[0];
        //Stores the unit distance between each range value
        let unitDistance = difference / 30;

        //Places range value which will be printed along y-axis
        //THis will also be useful for computation
        let rangeVal = [INRArr[0]];
        let sum = rangeVal[0];
        for (let i = 1; i <= 30; i++) {
            rangeVal.push(rangeVal[i - 1] + unitDistance);
        }


        //Filling currency value along the vertical axis
        for (let i = 0; i < 31; i++) {
            ctx.fillText(rangeVal[i].toFixed(4), 1, 840 - i * (800 / 30));
        }

        //Returns value of x-cordinate while plotting line/point
        function getX(arr) {
            let posn = Number(arr[0].substr(arr[0].length - 2)) - 1;
            return 40 + (posn * 800 / 30);
        }

        //Returns value of x-cordinate while plotting line/point
        function getY(arr) {
            let posn = Number(((arr[1] - INRArr[0]) / unitDistance).toFixed(0));
            return 840 - (posn * 800 / 30);
        }

        //Computation for creating a line
        //Checking the range between which the sortedINR value exists
        for (let i = 0; i < sortedINRValueJan19.length; i++) {
            for (let j = 0; j < rangeVal.length - 1; j++) {

                //To check whether sorted pricing value is in between two values of the range
                if (sortedINRValueJan19[i][1] >= rangeVal[j] && sortedINRValueJan19[i][1] <= rangeVal[j + 1]) {

                    //Plotting points
                    ctx.beginPath();
                    ctx.lineWidth = "3";
                    ctx.strokeStyle = "black";
                    ctx.arc(getX(sortedINRValueJan19[i]), getY(sortedINRValueJan19[i]), 2, 0 * Math.PI, 2 * Math.PI);
                    ctx.stroke();

                    //Drawing line across the co-ordinates
                    ctx.beginPath();
                    ctx.lineWidth = "1";
                    ctx.strokeStyle = "black";
                    ctx.moveTo(getX(sortedINRValueJan19[i]), getY(sortedINRValueJan19[i]));
                    ctx.lineTo(getX(sortedINRValueJan19[i + 1]), getY(sortedINRValueJan19[i + 1]));
                    ctx.stroke();
                    break;
                }
            }
        }


        console.log(sortedINRValueJan19);
        console.log(rangeVal);
        console.log(INRArr[INRArr.length - 1] <= rangeVal[rangeVal.length - 1]);
    }
    );