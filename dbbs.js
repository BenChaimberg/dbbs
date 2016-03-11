javascript:(
    function() {
        function chooseClick(matrix) {
            array = [];
            for (var i=0; i<3; i++) {
                for (var j=0; j<3; j++) {
                    array.push(matrix[i][j]);
                }
            }
            var reversedArray = new Array(9);
            for (var i=0; i<9; i++) {
                reversedArray[i] = 9 - array[i];
            }
            var done;
            for (var i=0; i<reversedArray.length; i++) {
                if (reversedArray[i] != 9) {
                    done = false;
                    break
                } else {
                    done = true;
                }
            }
            if (done) return true;
            reversedArray.sort();
            var subtractedArray = new Array(9);
            for (var i=0; i<3; i++) {
                for (var j=2; j>=0; j--) {
                    subtractedArray[3*i+j] = reversedArray[3*i+j] - reversedArray[3*i];
                }
            }
            indexToChange = [2,5,8];
            indexToChange.sort(function(a,b){return subtractedArray[a]-subtractedArray[b];});
            for (var i=0; i<9; i++) {
                for (var j=2; j>=0; j--) {
                    if (i == indexToChange[j]) {
                        break;
                    }
                    else if (subtractedArray[i] > subtractedArray[indexToChange[j]]) {
                        indexToChange[0] = i;
                    }
                }
                indexToChange.sort(function(a,b){return subtractedArray[a]-subtractedArray[b];});
            }
            var numbersToChange = [];
            for (var i=0; i<3; i++) {
                numbersToChange.push(9 - (subtractedArray[indexToChange[i]] + reversedArray[3*Math.floor((indexToChange[i])/3)]));
            }
            var coordinates = findInMatrix(numbersToChange)
            console.log(coordinates);
            // move(matrix, coordinates);
            // chooseClick(matrix);
        }

        // function move(matrix, coordinates) {
        //     var rows = [0, 0, 0];
        //     var cols = [0, 0, 0];
        //     for (var i=0; i<3; i++) {
        //         for (var j=0; j<3; j++) {
        //             if (coordinates[i][0] == j) {
        //                 rows[j]++;
        //             }
        //             if (coordinates[i][1] == j) {
        //                 cols[j]++;
        //             }
        //         }
        //     }
        //     for (var i=0; i<3; i++) {
        //         if (rows[i] == 3 || cols[i] == 3) {
        //             //3 return to escape next loops?
        //         }
        //     }
        //     console.log(rows,cols);
        //     return matrix;
        // }
        //
        // function up(matrix, colNum) {
        //     console.log("up")
        //     column = [matrix[0][colNum],matrix[1][colNum],matrix[2][colNum]];
        //     matrix[0][colNum] = column[1];
        //     matrix[1][colNum] = column[2];
        //     matrix[2][colNum] = column[0];
        //     return matrix;
        // }
        //
        // function right(matrix, rowNum) {
        //     row = matrix[rowNum];
        //     matrix[rowNum][0] = column[2];
        //     matrix[rowNum][1] = column[0];
        //     matrix[rowNum][2] = column[1];
        //     return matrix;
        // }

        function findInMatrix(numbersToChange) {
            var coordinates = [];
            for (var i=0; i<3; i++) {
                for (var j=0; j<3; j++) {
                    for (var k=0; k<numbersToChange.length; k++) {
                        if (matrix[i][j] == numbersToChange[k]) {
                            coordinates.push([i,j]);
                            delete numbersToChange[k];
                            break;
                        }
                    }
                }
            }
            return coordinates;
        }

        var imageRegEx = /^http:\/\/dbbs\.me\/images\/(\d)\.png$/;
        var images = document.getElementsByTagName("img");
        var matrix = [];
        for (var i=0; i<3; i++) {
            matrix[i] = new Array(3);
        }
        for (var i=0; i<images.length; i++) {
            var iRegEx = imageRegEx.exec(images[i].src);
            if (iRegEx != null) {
                var parent = images[i].parentNode;
                var parentsParent = parent.parentNode;
                // parent.children[0].children[0].style.border = "1px solid red";
                var index = Array.prototype.indexOf.call(parent.children, images[i]) - 1;
                var parentsIndex = Array.prototype.indexOf.call(parentsParent.children, parent) - 1;
                matrix[parentsIndex][index] = iRegEx[1]!="0" ? +iRegEx[1]: 9;
            }
        }
        console.log(matrix);
        chooseClick(matrix);
        //endgame
    }
)();
