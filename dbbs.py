import math, copy


def tripletize(matrix):
    # turn matrix into array of numbers
    array = []
    for i in range(0, 3):
        for j in range(0, 3):
            array.append(matrix[i][j])
    # reverse array
    reversed_array = range(0, 9)
    reversed_array = map(lambda x : 9-x, array)
    reversed_array.sort()
    # split reversed array into triplets and find relative differences
    subtracted_array = range(0, 9)
    for i in range(0, 3):
        for j in range(0,3):
            subtracted_array[3*i+2-j] = reversed_array[3*i+2-j] - reversed_array[3*i]
    return subtracted_array, reversed_array


def choose_click(triplets, clicks):
    subtracted_array = triplets[0]
    reversed_array = triplets[1]
    print 'subtracted_array: ', subtracted_array
    print 'reversed_array: ', reversed_array
    # find the indecies inside the subtracted_array that should be incremented
    indecies_to_change = []
    while len(indecies_to_change) < 3:
        max_index = subtracted_array.index(max(subtracted_array))
        if not max_index in indecies_to_change:
            indecies_to_change.append(max_index)
        else:
            subtracted_array[max_index] = 0
    print 'indecies_to_change: ', indecies_to_change
    # turn the indecies into actual numbers
    numbers_to_change = [9 - reversed_array[i] for i in indecies_to_change]
    print 'numbers_to_change: ', numbers_to_change
    return numbers_to_change


def move(move_matrix, coordinates, clicks):
    # get concentration of rows/columns in blocks to move
    rows = [0, 0, 0]
    cols = [0, 0, 0]
    for i in coordinates:
        for j in range(0, 3):
            if i[0] == j:
                rows[j] += 1
            if i[1] == j:
                cols[j] += 1

    # already all in line
    for i in range(0, 3):
        if rows[i] == 3:
            to_inc = 0
        elif cols[i] == 3:
            to_inc = 1
        else:
            continue
        return [move_matrix, clicks, to_inc, i]

    # check if 2 blocks in same row/column
    rows2in = -1
    cols2in = -1
    for i in range(0, 3):
        if rows[i] is 2:
            rows2in = i
        if cols[i] is 2:
            cols2in = i

    # move with 2 blocks in same row and column
    if rows2in >= 0 and cols2in >= 0:
        # protects wrap-arounds
        add_rows2in = 0
        add_cols2in = 0
        sub_rows2in = 0
        sub_cols2in = 0
        if rows2in == 2:
            add_rows2in = -1
        if rows2in == 0:
            sub_rows2in = 3
        if cols2in == 2:
            add_cols2in = -1
        if cols2in == 0:
            sub_cols2in = 3

        # figures out which of three to move
        if rows[add_rows2in+1] == 0:
            for coordinate in coordinates:
                if coordinate[0] == sub_rows2in-1 and coordinate[1] == cols2in:
                    clicks.append(("right", coordinate[0]))
                    return move(right(move_matrix, coordinates, coordinate[0]), coordinates, clicks)
        else:
            if cols[add_cols2in+1] == 0:
                for coordinate in coordinates:
                    if coordinate[0] == add_rows2in+1 and coordinate[1] == cols2in:
                        clicks.append(("right", coordinate[0]))
                        return move(right(move_matrix, coordinates, coordinate[0]), coordinates, clicks)

            else:
                for coordinate in coordinates:
                    if coordinate[0] == rows2in and coordinate[1] == add_cols2in+1:
                        clicks.append(("up", coordinate[1]))
                        return move(up(move_matrix, coordinates, coordinate[1]), coordinates, clicks)

    # move with 2 blocks in same row
    if rows2in > 0:
        for i in range(0, 3):
            if rows[i] == 1:
                for coordinate in coordinates:
                    if coordinate[0] == i:
                        clicks.append(("up", coordinate[1]))
                        return move(up(move_matrix, coordinates, coordinate[1]), coordinates, clicks)

    # move with 2 blocks in same column
    if cols2in > 0:
        for i in range(0, 3):
            if cols[i] == 1:
                for coordinate in coordinates:
                    if coordinate[1] == i:
                        clicks.append(("right", coordinate[0]))
                        return move(right(move_matrix, coordinates, coordinate[0]), coordinates, clicks)

    # move "randomly" with no blocks in same row/column
    clicks.append(("up", coordinates[0][1]))
    return move(up(move_matrix, coordinates, coordinates[0][1]), coordinates, clicks)


def up(up_matrix, coordinates, col_num):
    new_matrix = copy.deepcopy(up_matrix)
    new_matrix[0][col_num] = up_matrix[1][col_num]
    new_matrix[1][col_num] = up_matrix[2][col_num]
    new_matrix[2][col_num] = up_matrix[0][col_num]
    for i in coordinates:
        if i[1] == col_num:
            i[0] -= 1
            if i[0] == -1:
                i[0] = 2
    return new_matrix


def right(right_matrix, coordinates, row_num):
    new_matrix = copy.deepcopy(right_matrix)
    new_matrix[row_num][0] = right_matrix[row_num][2]
    new_matrix[row_num][1] = right_matrix[row_num][0]
    new_matrix[row_num][2] = right_matrix[row_num][1]
    for i in coordinates:
        if i[0] == row_num:
            i[1] += 1
            if i[1] == 3:
                i[1] = 0
    return new_matrix


def inc_row(matrix, row_num):
    inc_matrix = [[],[],[]]
    for i in range(0, 3):
        for j in range(0, 3):
            if i == row_num:
                inc_matrix[i].append(matrix[i][j] + 1)
            else:
                inc_matrix[i].append(matrix[i][j])
    return inc_matrix


def inc_col(matrix, col_num):
    inc_matrix = [[],[],[]]
    for i in range(0, 3):
        for j in range(0, 3):
            if j == col_num:
                inc_matrix[i].append(matrix[i][j] + 1)
            else:
                inc_matrix[i].append(matrix[i][j])
    return inc_matrix


def find_in_matrix(find_matrix, numbers_to_change):
    # find the coordinates that correspond to the numbers that need changing
    # TODO: add in check for duplicates that can speed up move process
    coordinates = []
    for number in numbers_to_change:
        for row in find_matrix:
            for col in row:
                if col == number and not [find_matrix.index(row), row.index(col)] in coordinates:
                    coordinates.append([find_matrix.index(row), row.index(col)])
                    number = -1
                    break
            if number < 0:
                break
    print 'coordinates: ', coordinates
    return coordinates

def print_matrix(matrix):
    string = ''
    for i in matrix:
        for j in i:
            string += str(j) + ' '
        string += '\n'
    return string[:len(string)-2]

def get_triplets(matrix, clicks):
    print '\nmatrix:\n', print_matrix(matrix)
    print 'clicks: ', clicks
    triplets = tripletize(matrix)
    done = True
    for i in triplets[0]:
        if not i == 0:
            done = False
            break
    if done:
        return matrix, clicks
    after_move = move(matrix, find_in_matrix(matrix, choose_click(triplets, clicks)), clicks)
    if after_move[2] == 0:
        after_move[1].append(('inc_row', after_move[3]))
        return get_triplets(inc_row(after_move[0], after_move[3]), after_move[1])
    else:
        after_move[1].append(('inc_col', after_move[3]))
        return get_triplets(inc_col(after_move[0], after_move[3]), after_move[1])

def rearrange(tripleted):
    matrix = tripleted[0]
    clicks = tripleted[1]
    # TODO: optimize based on current arrangement


# matrix = [[],[],[]]
# matrix[0].append(int(raw_input('First row, first column: ')))
# matrix[0].append(int(raw_input('First row, second column: ')))
# matrix[0].append(int(raw_input('First row, third column: ')))
# matrix[1].append(int(raw_input('Second row, first column: ')))
# matrix[1].append(int(raw_input('Second row, second column: ')))
# matrix[1].append(int(raw_input('Second row, third column: ')))
# matrix[2].append(int(raw_input('Third row, first column: ')))
# matrix[2].append(int(raw_input('Third row, second column: ')))
# matrix[2].append(int(raw_input('Third row, third column: ')))
matrix = [[4, 6, 1], [8, 9, 9], [3, 4, 4]]
rearrange(get_triplets(matrix, []))
