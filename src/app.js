import './styles/global.scss'
import { getGridFromMatrix, render } from './utils';
import Grid from './components/Grid';
import Description from './components/Description';

const { path, grid } = getGridFromMatrix(
    [
        '.X......',
        '.XXXXX..',
        '.....XX.',
        '........',
    ],
    0, 0,
    2, 0
);

render([
    Description(grid, path),
    Grid(grid, path),
])
