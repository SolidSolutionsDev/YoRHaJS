window.process = { env: { NODE_ENV: "development" } };
if (typeof global === "undefined") {
    window.global = window;
}
