from collections import defaultdict
from typing import List, Set, Tuple

def parse_input(input_text: str) -> List[List[str]]:
    """Parse the input text into a 2D grid."""
    return [list(line) for line in input_text.strip().split('\n')]

def find_antennas(grid: List[List[str]]) -> defaultdict:
    """Find all antennas and group them by frequency."""
    antennas = defaultdict(list)
    for y in range(len(grid)):
        for x in range(len(grid[0])):
            if grid[y][x] != '.':
                antennas[grid[y][x]].append((x, y))
    return antennas

def find_antinodes(antenna1: Tuple[int, int], antenna2: Tuple[int, int],
                   grid_width: int, grid_height: int) -> Set[Tuple[int, int]]:
    """Find antinodes created by a pair of antennas."""
    x1, y1 = antenna1
    x2, y2 = antenna2
    antinodes = set()

    # Calculate vector between antennas
    dx = x2 - x1
    dy = y2 - y1

    # For each antenna as the closer one
    for base, other in [(antenna1, antenna2), (antenna2, antenna1)]:
        bx, by = base
        ox, oy = other

        # Calculate potential antinode positions
        # The antinode should be at position P where: distance(P, base) * 2 = distance(P, other)
        # We can find this by extending the vector from other to base
        vector_x = bx - ox
        vector_y = by - oy

        # The antinode will be located at base + vector
        antinode_x = bx + vector_x
        antinode_y = by + vector_y

        # Check if antinode is within grid bounds
        if (0 <= antinode_x < grid_width and
            0 <= antinode_y < grid_height):
            antinodes.add((int(antinode_x), int(antinode_y)))

    return antinodes

def solve_resonant_collinearity(input_text: str) -> int:
    """
    Solve the Resonant Collinearity puzzle.
    Returns the number of unique antinode locations.
    """
    # Parse input
    grid = parse_input(input_text)
    grid_height = len(grid)
    grid_width = len(grid[0])

    # Find all antennas grouped by frequency
    antennas = find_antennas(grid)

    # Find all antinodes
    all_antinodes = set()

    # For each frequency
    for freq, antenna_positions in antennas.items():
        # For each pair of antennas with the same frequency
        for i in range(len(antenna_positions)):
            for j in range(i + 1, len(antenna_positions)):
                antinodes = find_antinodes(
                    antenna_positions[i],
                    antenna_positions[j],
                    grid_width,
                    grid_height
                )
                all_antinodes.update(antinodes)

    return len(all_antinodes)

# Test with example input
test_input = """.........................7....................4...
.n......................R..............4..........
.....N........S.................K.C..........4....
...........N..r.....................B....K........
..................................................
......N.......x.............7.......K.....2....E..
...................r..H........R..................
.....................s....p........C...........2..
....3.......................M.....................
........k....................H....5...............
.....x....N................d.5..y................J
m.....................d7...................J......
.......exk........................................
.......x.............5.......R....................
..........eY......................................
...S.3..............................O.E...J.......
.......8...H....k...............J.................
......S.e.........C.H.....................X.....y.
................j..........y.........2............
...........e.........k............................
......YS...3..............5..........K...XR.......
...m..............j.s..........c..................
.........................j........................
...............j..................................
.....m................................2...........
.........Y......................................b.
..................................................
.......................h...........b..............
............m......D..............d...............
........o......D..................................
...................................O..............
..................................................
......8...........................................
........D.Y..o...................1................
.....................................b..9.........
........................h..0......................
.....o......................h..0........b1........
.........8.............X..........................
..........o..........c..........1...........O.....
....8....................y0...c...................
..............D.......c..................9..0.....
............................1..........O..9......."""

result = solve_resonant_collinearity(test_input)
print(f"Number of unique antinode locations: {result}")  # Should print 14