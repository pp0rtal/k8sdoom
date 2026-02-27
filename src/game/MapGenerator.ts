export class MapGenerator {
  static generate(width: number, height: number): number[][] {
    const grid: number[][] = [];
    for (let y = 0; y < height; y++) {
      grid[y] = [];
      for (let x = 0; x < width; x++) {
        grid[y][x] = 1;
      }
    }

    const visited: boolean[][] = [];
    for (let y = 0; y < height; y++) {
      visited[y] = new Array(width).fill(false);
    }

    const carve = (cx: number, cy: number) => {
      visited[cy][cx] = true;
      grid[cy][cx] = 0;

      const dirs = [
        [0, -2], [0, 2], [-2, 0], [2, 0]
      ];

      // Shuffle directions
      for (let i = dirs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
      }

      for (const [dx, dy] of dirs) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && !visited[ny][nx]) {
          // Carve the wall between current and next
          grid[cy + dy / 2][cx + dx / 2] = 0;
          carve(nx, ny);
        }
      }
    };

    // Start from cell (1,1)
    carve(1, 1);

    // Assign varied wall types (1-4) to remaining walls
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[y][x] > 0) {
          grid[y][x] = ((x * 7 + y * 13) % 4) + 1;
        }
      }
    }

    return grid;
  }
}
