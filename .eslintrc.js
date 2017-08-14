module.exports = {
    "extends": "airbnb",
    "rules": {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }]
    },
    "globals": {
        "document": true,
        "it": true
    },
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ]
};