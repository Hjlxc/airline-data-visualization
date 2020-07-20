# airline-data-visualization

This project implements a data visualizer with React.js and D3.js. With the ability of interactive data visualization, easy customization, and expansion. It creates a simple platform that allows users to add visualizer, chart, style components, and combine them to build a visualizing app to meet your own needs.

## Structure

The project has 3 main modules that allow for easy extension, `visualizer`, `chart`, and `style`.

### Visualizer Component

The visualizer component can be found under `src/components/visualizers`. The visualizer component should and only should be responsible for the following two things:

- Pick the desired chart component used to render your data
- Define a parser function to parse the raw data into the desired format for the selected chart component

Note: you don't need to explicitly pass the parsed data into the chart component, the visualizer wrapper will do it for you.

### Chart Component

The chart component can be found under `src/components/charts`. The only thing it does is to convert input data and style into a graphic.

Currently there is only one hierarchical bar chart module available. The module is implemented based on an existing [example](https://observablehq.com/@d3/hierarchical-bar-chart) plus the additional feature of:

- option to turn animation and initial animation on/off
- dynamic bar size to always keep bar fit inside the graphic
- update chart alive based on provide data and style
- keep tracking the hierarchy tree of currently displayed data, you will remain in the same section when chart get updates.

### Style Component

The app saves the style using context for easily global access throughout the app. By wrapping your component with styleProvider, it will automatically pass the current style as well as an action to set the global style.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn feature:test`

Run the test to any test file inside path `src/test` follow the pattern of `*.test.js`. The unit test for any non-visual feature should be here.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Todo

- Hook window resize event to visualizer component to always feet chart to the current window
- The animation for HierarchicalBarChart currently only works well for summed data. That is, the parent node value equals to the sum of all its children. Fix the animation for any data type.
- Add animation to hierarchicalBarChart when input data changes
- Move data reading and parsing to the backend
