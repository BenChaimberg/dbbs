javascript:(
    function() {
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
        var coordinates = findInMatrix(chooseClick(matrix))
        console.log(matrix, coordinates)
        setTimeout(function(){
            var clicks = []
            up(matrix, 1)
            // var afterMove = move(matrix, coordinates, clicks);
            // clicks.push.apply(clicks, afterMove[1])
            // console.log(clicks, afterMove[0])
            // return chooseClick(incremented, clicks);
            // endgame
        }, 2000);

        function chooseClick(matrix, clicks) {
            // turn matrix into array of numbers
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
            if (done) return clicks;
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
            return numbersToChange
        }

        function move(moveMatrix, coordinates, clicks) {
            // get concentration of rows/columns in blocks to move
            var rows = [0, 0, 0];
            var cols = [0, 0, 0];
            for (var i=0; i<3; i++) {
                for (var j=0; j<3; j++) {
                    if (coordinates[i][0] == j) {
                        rows[j]++;
                    }
                    if (coordinates[i][1] == j) {
                        cols[j]++;
                    }
                }
            }
            // already all in line
            for (var i=0; i<3; i++) {
                if (rows[i] == 3 || cols[i] == 3) {
                    return(moveMatrix, clicks)
                }
            }
            // check if 2 blocks in same row/column
            var rows2In = -1;
            var cols2In = -1;
            for (var i=0; i<3; i++) {
                if (rows[i] == 2) {
                    rows2In = i;
                }
                if (cols[i] == 2) {
                    cols2In = i;
                }
            }
            // move with 2 blocks in same row and column
            if (rows2In >= 0 && cols2In >= 0) {
                // protects wrap-arounds
                if (rows2In == 2) {
                    var addRows2In = -1;
                }
                if (rows2In == 0) {
                    var subRows2In = 3;
                }
                if (cols2In == 2) {
                    var addCols2In = -1;
                }
                if (cols2In == 0) {
                    var subCols2In = 3;
                }
                // figures out which of three to move
                if (rows[addRows2In+1] == 0) {
                    for (var i=0; i<3; i++) {
                        if (coordinates[i][0] == subRows2In-1 && coordinates[i][1] == cols2In) {
                            coordinates[i][1]++;
                            if (coordinates[i][1] > 2) {
                                coordinates[i][1] = 0;
                            }
                            clicks.push(["right", coordinates[i][0]])
                            return move(right(moveMatrix, coordinates[i][0]), coordinates, clicks);
                        }
                    }
                } else {
                    if (cols[addCols2In+1] == 0) {
                        for (var i=0; i<3; i++) {
                            if (coordinates[i][0] == addRows2In+1 && coordinates[i][1] == cols2In) {
                                coordinates[i][1]++;
                                if (coordinates[i][1] > 2) {
                                    coordinates[i][1] = 0;
                                }
                                clicks.push(["right", coordinates[i][0]])
                                return move(right(moveMatrix, coordinates[i][0]), coordinates, clicks);
                            }
                        }
                    }
                    else {
                        for (var i=0; i<3; i++) {
                            if (coordinates[i][0] == rows2In && coordinates[i][1] == addCols2In+1) {
                                coordinates[i][0]++;
                                if (coordinates[i][0] < 0) {
                                    coordinates[i][0] = 2;
                                }
                                clicks.push(["up", coordinates[i][1]])
                                return move(up(moveMatrix, coordinates[i][1]), coordinates, clicks);
                            }
                        }
                    }
                }
            }
            // move with 2 blocks in same row
            if (rows2In < 0) {
                for (var i=0; i<3; i++) {
                    if (rows[i] == 1) {
                        for (var j=0; j<3; j++) {
                            if (coordinates[j][0] = i) {
                                coordinates[j][0]--;
                                if (coordinates[j][0] < 0) {
                                    coordinates[j][0] = 2;
                                }
                                clicks.push(["up", coordinates[j][1]])
                                return move(up(moveMatrix, coordinates[j][1]), coordinates, clicks);
                            }
                        }
                    }
                }
            }
            // move with 2 blocks in same column
            if (cols2In < 0) {
                for (var i=0; i<3; i++) {
                    if (cols[i] == 1) {
                        for (var j=0; j<3; j++) {
                            if (coordinates[j][1] = i) {
                                coordinates[j][1]++;
                                if (coordinates[j][1] > 2) {
                                    coordinates[j][1] = 0;
                                }
                                clicks.push(["right", coordinates[j][0]])
                                return move(right(moveMatrix, coordinates[j][0]), coordinates, clicks);
                            }
                        }
                    }
                }
            }
            // move "randomly" with no blocks in same row/column
            coordinates[0][0]--;
            if (coordinates[0][0] < 0) {
                coordinates[0][0] = 2;
            }
            clicks.push(["up", coordinates[0][1]])
            return move(up(moveMatrix, coordinates[0][1]), coordinates, clicks);
        }

        function up(upMatrix, colNum) {
            console.log("up", colNum);
            var newMatrix = upMatrix;
            newMatrix[0][colNum] = upMatrix[1][colNum];
            newMatrix[1][colNum] = upMatrix[2][colNum];
            newMatrix[2][colNum] = upMatrix[0][colNum];
            console.log(upMatrix, newMatrix);
            return newMatrix;
        }

        function right(rightMatrix, rowNum) {
            console.log("right", rowNum)
            var newMatrix = matrix;
            newMatrix[rowNum][0] = rightMatrix[rowNum][2];
            newMatrix[rowNum][1] = rightMatrix[rowNum][0];
            newMatrix[rowNum][2] = rightMatrix[rowNum][1];
            console.log(matrix, newMatrix);
            return newMatrix;
        }

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
    }
)();
