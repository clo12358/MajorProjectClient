module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        { jsxImportSource: "nativewind", disableImportExportTransform: false },
      ],
      "nativewind/babel",
    ],
    env: {
      production: {
        plugins: ["react-compiler"],
      },
    },
  };
};
