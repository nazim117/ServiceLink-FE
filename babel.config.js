module.exports = {
    presets: [
      ["@babel/preset-env", {
        targets: "> 0.25%, not dead",
        useBuiltIns: "usage",
        corejs: 3
      }],
      "@babel/preset-react"
    ],
    plugins: [
      "@babel/plugin-transform-runtime",
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-proposal-nullish-coalescing-operator"
    ],
  };